import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function clientFixture(hasOriginal, react = {}, fetch) {
  let plugin;
  vm.runInNewContext(readFileSync(new URL('./client.js', import.meta.url), 'utf8'), {
    fetch,
    window: { __ModuleLoader__: { load: value => { plugin = value.factory(() => react); } } },
  });
  const entries = [];
  const subscribers = new Set();
  const declared = new Set(['sidebar.workspaces']);
  const cleanups = [];
  const original = {
    component: function Original() {}, options: { priority: 0 },
    store: {}, inject: () => ({}), locale: 'workspace',
    children: {
      'sidebar.workspaces.session.menu.item': {},
      'sidebar.workspaces.session.row.action': {},
    },
  };
  const nativeComponent = original.component;
  function addOriginal() {
    entries.push(original);
    for (const name of Object.keys(original.children)) declared.add(name);
    for (const fn of subscribers) fn();
  }
  const ctx = {
    effect: fn => { cleanups.push(fn()); },
    locale: { register: () => () => {}, bind: () => key => key },
    slots: {
      entries: () => entries,
      subscribe: (_name, fn) => { subscribers.add(fn); return () => subscribers.delete(fn); },
      inject: (name, fn) => { if (declared.has(name)) cleanups.push(fn()); },
      register: (options, component) => {
        for (const name of Object.keys(options.children || {})) {
          if (declared.has(name)) throw new Error(`slot "${name}" is already declared`);
        }
        const entry = { ...options, options, component };
        if (options.name === 'sidebar.workspaces') {
          entries.push(entry);
          entries.sort((a, b) => (a.options.priority || 0) - (b.options.priority || 0));
          for (const fn of subscribers) fn();
        }
        return () => {
          const index = entries.indexOf(entry);
          if (index >= 0) entries.splice(index, 1);
        };
      },
    },
  };
  if (hasOriginal) addOriginal();
  plugin.apply(ctx);
  return { entries, original, nativeComponent, addOriginal, dispose: () => cleanups.reverse().forEach(fn => fn?.()) };
}

test('client wraps the native entry and preserves its child-slot ownership', () => {
  const { entries, original, nativeComponent, dispose } = clientFixture(true);
  assert.equal(entries.length, 1);
  assert.equal(entries[0], original);
  assert.notEqual(original.component, nativeComponent);
  assert.ok(original.children['sidebar.workspaces.session.menu.item']);
  dispose();
  assert.deepEqual(entries, [original]);
  assert.equal(original.component, nativeComponent);
});

test('client waits for the native browser when only the slot has been declared', () => {
  const { entries, original, nativeComponent, addOriginal, dispose } = clientFixture(false);
  assert.equal(entries.length, 0);
  addOriginal();
  assert.equal(entries.length, 1);
  assert.equal(entries[0], original);
  assert.notEqual(original.component, nativeComponent);
  dispose();
  assert.deepEqual(entries, [original]);
  assert.equal(original.component, nativeComponent);
});

function elements(node, out = []) {
  if (Array.isArray(node)) {
    for (const child of node) elements(child, out);
    return out;
  }
  if (!node || typeof node !== 'object') return out;
  if (node.type) out.push(node);
  if (Array.isArray(node.children)) for (const child of node.children) elements(child, out);
  return out;
}

function renderFixture() {
  const react = {
    createElement: (type, props, ...children) => ({ type, props, children }),
    useState: initial => [typeof initial === 'function' ? initial() : initial, () => {}],
    useSyncExternalStore: () => ({ tags: [{ id: 'tag', name: 'Tag' }], assignments: { main: 'tag' } }),
    useMemo: fn => fn(),
    useEffect: () => {},
    useRef: initial => ({ current: initial }),
  };
  const fixture = clientFixture(true, react, async () => ({ ok: true, json: async () => ({ tags: [], assignments: {} }) }));
  const byId = Object.fromEntries(['main', 'other'].map(id => [id, { id, retainedBy: {}, blank: false, origin: 'user' }]));
  const calls = [];
  const tree = fixture.original.component({
    wide: true,
    useSessions: selector => selector({ ids: Object.keys(byId), byId }),
    useWorkspaces: selector => selector({ items: [{ workspaceId: 'origin', sessionIds: ['main', 'other'] }], archivedSessionIds: [], pinnedSessionIds: [] }),
    useSessionStatus: selector => selector(new Map()),
    usePanelInfo: selector => selector({ activePanelId: null }),
    openSessionMenu: (...args) => calls.push(args),
  });
  return { ...fixture, tree, calls };
}

test('a tagged row opens the native session menu instead of re-rendering foreign menu slots', () => {
  const { tree, calls, dispose } = renderFixture();
  const row = elements(tree).find(node => node.type?.name === 'SessionRow');
  assert.ok(row);
  const rendered = row.type(row.props);
  assert.equal(elements(rendered).some(node => node.props?.className === 'st-menu'), false);
  const button = elements(rendered).find(node => node.props?.['aria-label'] === 'menu');
  assert.ok(button);
  assert.equal(button.props['data-context-menu-trigger'], '');
  let stopped = false;
  button.props.onPointerDown({ stopPropagation: () => { stopped = true; } });
  assert.equal(stopped, true);
  button.props.onClick({ currentTarget: { getBoundingClientRect: () => ({ left: 12, bottom: 34 }) } });
  assert.equal(calls.length, 1);
  const [sessionId, displayTitle, point, mode] = calls[0];
  assert.equal(sessionId, 'main');
  assert.equal(displayTitle, '');
  assert.deepEqual({ ...point }, { x: 12, y: 34 });
  assert.equal(mode, 'toggle');
  dispose();
});

function dragFixture() {
  const requests = [];
  const react = {
    createElement: (type, props, ...children) => ({ type, props, children }),
    useState: initial => [typeof initial === 'function' ? initial() : initial, () => {}],
    useSyncExternalStore: () => ({ tags: [{ id: 'tag', name: 'Tag' }], assignments: { main: 'tag' } }),
    useMemo: fn => fn(),
    useEffect: () => {},
    useRef: initial => ({ current: initial }),
  };
  const fixture = clientFixture(true, react, async (_url, options) => {
    requests.push(JSON.parse(options.body));
    return { ok: true, json: async () => ({ tags: [], assignments: {} }) };
  });
  const byId = Object.fromEntries(['main', 'ordinary', 'blank', 'child', 'archived'].map(id => [id, {
    id, retainedBy: {}, blank: id === 'blank', origin: id === 'child' ? 'subagent' : 'user',
  }]));
  const browser = fixture.original.component({
    useSessions: selector => selector({ ids: Object.keys(byId), byId }),
    useWorkspaces: selector => selector({ items: [
      { workspaceId: 'origin', sessionIds: ['main', 'ordinary'] },
      { workspaceId: 'other', sessionIds: ['blank', 'child', 'archived'] },
    ], archivedSessionIds: ['archived'], pinnedSessionIds: [] }),
    useSessionStatus: selector => selector(new Map()),
    usePanelInfo: selector => selector({ activePanelId: null }),
  });
  return { ...fixture, browser, requests };
}

test('native session drags carry the tag payload alongside the native text payload', () => {
  const { browser, dispose } = dragFixture();
  const values = new Map([['text/plain', 'main']]);
  browser.props.onDragStartCapture({
    target: { closest: () => ({ getAttribute: () => 'session:main' }) },
    dataTransfer: { setData: (type, value) => values.set(type, value) },
  });
  assert.equal(values.get('text/plain'), 'main');
  assert.equal(values.get('application/x-dsh-session-tag'), 'main');
  dispose();
});

test('workspace, blank, archived, subagent and unrelated drags are not taggable', () => {
  const { browser, dispose } = dragFixture();
  for (const key of ['workspace:main', 'session:blank', 'session:child', 'session:archived', 'session:missing', null]) {
    const values = new Map();
    browser.props.onDragStartCapture({
      target: { closest: () => key === null ? null : { getAttribute: () => key } },
      dataTransfer: { setData: (type, value) => values.set(type, value) },
    });
    assert.equal(values.size, 0, String(key));
  }
  dispose();
});

function workspaceDragEvent(key, native = true) {
  const classes = new Set();
  const row = {
    getAttribute: () => key,
    classList: { add: name => classes.add(name), remove: name => classes.delete(name) },
  };
  return {
    classes,
    target: { closest: selector => selector === '.st-native-workspaces' ? native ? {} : null : row },
    dataTransfer: { getData: () => 'main' },
    prevented: false, stopped: false,
    preventDefault() { this.prevented = true; },
    stopPropagation() { this.stopped = true; },
  };
}

test('a tagged session can return through its original workspace header or a row in that workspace', async () => {
  for (const key of ['workspace:origin', 'session:ordinary']) {
    const { browser, requests, dispose } = dragFixture();
    browser.props.onDragStartCapture({
      target: { closest: () => ({ getAttribute: () => 'session:main' }) },
      dataTransfer: { setData: () => {} },
    });
    const event = workspaceDragEvent(key);
    browser.props.onDragOverCapture(event);
    assert.equal(event.classes.has('st-workspace-drop'), true);
    assert.equal(event.dataTransfer.dropEffect, 'move');
    await browser.props.onDropCapture(event);
    assert.deepEqual(requests, [{ action: 'unassign', sessionIds: ['main'] }]);
    assert.equal(event.classes.size, 0);
    assert.equal(event.prevented, true);
    assert.equal(event.stopped, true);
    dispose();
  }
});

test('dropping over another workspace or a tag does not unassign the session', async () => {
  const { browser, requests, dispose } = dragFixture();
  for (const event of [workspaceDragEvent('workspace:other'), workspaceDragEvent('session:ordinary', false)]) {
    await browser.props.onDropCapture(event);
    assert.equal(event.prevented, false);
  }
  assert.deepEqual(requests, []);
  dispose();
});
