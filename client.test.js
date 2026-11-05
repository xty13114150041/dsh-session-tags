import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function clientFixture(hasOriginal) {
  let plugin;
  vm.runInNewContext(readFileSync(new URL('./client.js', import.meta.url), 'utf8'), {
    window: { __ModuleLoader__: { load: value => { plugin = value.factory(() => ({})); } } },
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
