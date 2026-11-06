window.__ModuleLoader__.load({
  id: '@local/dsh-session-tags',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const NS = 'local.sessionTags';
    const SESSION_DRAG_TYPE = 'application/x-dsh-session-tag';
    const dictionaries = {
      zh: { tags: '标签', create: '新建标签', name: '标签名称', save: '保存', cancel: '取消', rename: '重命名标签', remove: '删除标签', removeConfirm: '删除标签后，会话回到原工作区；不会删除会话。', empty: '拖动会话到这里，或使用会话的 ⋯ 菜单', untitled: '未命名', newSession: '新会话', move: '移至标签', original: '移回原工作区', refresh: '刷新标签', loading: '正在加载标签…', retry: '重试', select: '选择标签', search: '筛选标签内的会话', noSession: '请先打开一个会话', menu: '会话操作', count: '{count} 个会话', close: '关闭', workspaces: '工作区', more: '显示更多', less: '收起列表' },
      en: { tags: 'Tags', create: 'New tag', name: 'Tag name', save: 'Save', cancel: 'Cancel', rename: 'Rename tag', remove: 'Delete tag', removeConfirm: 'Sessions return to their original workspaces. No sessions will be deleted.', empty: 'Drop a session here, or use its ⋯ menu', untitled: 'Untitled', newSession: 'New session', move: 'Move to tag', original: 'Return to workspace', refresh: 'Refresh tags', loading: 'Loading tags…', retry: 'Retry', select: 'Choose tag', search: 'Filter tagged sessions', noSession: 'Open a session first', menu: 'Session actions', count: '{count} sessions', close: 'Close', workspaces: 'Workspaces', more: 'Show more', less: 'Show less' },
    };
    const css = `
.st-root{display:flex;flex:1;flex-direction:column;min-height:0;overflow-x:hidden;overflow-y:auto;scrollbar-gutter:stable;color:var(--dsw-alias-label-primary)}
.st-tags{flex:none;padding:2px 8px 8px 0;border-bottom:1px solid var(--dsw-alias-border-l1);margin-bottom:6px}
.st-heading,.st-group-head,.st-row{display:flex;align-items:center;gap:6px;min-width:0}
.st-heading{height:32px;color:var(--dsw-alias-label-tertiary);font-size:12px;padding-left:4px}.st-heading>span{flex:1}
.st-tags button,.st-dialog button{font:inherit;color:inherit;cursor:pointer;border:0;background:transparent;border-radius:6px}
.st-icon{width:28px;height:28px;flex:none;display:inline-flex;align-items:center;justify-content:center;font-size:17px}
.st-tags button:hover,.st-dialog button:hover{background:var(--dsw-alias-bg-layer-2)}
.st-tags button:focus-visible,.st-dialog :focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-2px}
.st-group{border-radius:8px}.st-group.st-drop{background:var(--dsw-alias-bg-layer-2);outline:1px dashed var(--dsw-alias-brand-primary)}
.st-native-workspaces{display:contents}.st-native-workspaces .st-workspace-drop{background:var(--dsw-alias-bg-layer-2);outline:1px dashed var(--dsw-alias-brand-primary);outline-offset:-1px;border-radius:6px}
.st-native-workspaces>div,.st-native-workspaces [class*="_listArea"],.st-native-workspaces [class*="_treeBody"],.st-native-workspaces [role="tree"]{flex:none;min-height:auto;overflow:visible}.st-native-workspaces [role="tree"]{scrollbar-gutter:auto}.st-native-workspaces [class*="_fade"]{display:none}
.st-group-head{height:34px}.st-fold{display:flex;align-items:center;gap:7px;flex:1;min-width:0;text-align:left;height:32px;padding:4px;font-size:13px;font-weight:500}.st-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}.st-count{font-size:11px;color:var(--dsw-alias-label-tertiary);font-weight:400}
.st-row{position:relative;min-height:34px;border-radius:6px;padding-left:16px;font-size:13px}.st-row[aria-current=true]{background:var(--dsw-alias-bg-layer-2)}.st-open{display:flex;align-items:center;gap:7px;min-width:0;flex:1;text-align:left;padding:7px 2px}.st-row:hover{background:var(--dsw-alias-bg-layer-1)}.st-dot{width:6px;height:6px;border-radius:50%;flex:none;background:var(--dsw-alias-state-idle-primary)}.st-dot.running{background:var(--dsw-alias-brand-primary)}.st-dot.waiting{background:var(--dsw-alias-state-warn-primary)}.st-dot.done{background:var(--dsw-alias-state-success-primary)}
.st-caption{font-size:11px;color:var(--dsw-alias-label-tertiary);padding:0 4px 5px 31px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.st-muted{font-size:12px;line-height:1.6;color:var(--dsw-alias-label-tertiary);padding:8px 12px}.st-error{color:var(--dsw-alias-state-error-primary);font-size:12px;padding:6px;overflow-wrap:anywhere}.st-search{box-sizing:border-box;width:100%;padding:6px 8px;font:inherit;font-size:12px;background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l1);border-radius:6px;color:inherit;margin-bottom:4px}
.st-popover-layer{position:fixed;inset:0;z-index:2000}.st-dialog{position:absolute;width:288px;max-width:calc(100vw - 16px);max-height:calc(100vh - 16px);overflow:auto;box-sizing:border-box;padding:12px;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;box-shadow:0 8px 28px rgba(0,0,0,.16);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font-size:13px}.st-dialog .st-heading{padding:0;margin-bottom:8px}.st-dialog h3{margin:0;font-size:14px}.st-dialog input{box-sizing:border-box;width:100%;padding:7px 9px;border-radius:6px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);color:inherit;font:inherit}.st-dialog label{display:block;margin-bottom:6px}.st-buttons{display:flex;gap:8px;justify-content:flex-end;margin-top:12px}.st-dialog .st-primary{background:var(--dsw-alias-brand-primary);color:var(--dsw-alias-bg-base)}.st-buttons button{padding:6px 10px}.st-choice{display:block;text-align:left;width:100%;padding:8px}.st-dialog button:disabled{opacity:.5;cursor:default}.st-drag{cursor:grab}
`;
    function readFolds() {
      try { return JSON.parse(localStorage.getItem('dsh.sessionTags.folds') || '{}'); } catch { return {}; }
    }
    function anchorOf(event) {
      const rect = event.currentTarget.getBoundingClientRect();
      return { x: event.clientX || rect.left, y: event.clientY || rect.bottom };
    }
    function Popover({ title, close, children, t, anchor }) {
      const ref = React.useRef(null);
      const [position, setPosition] = React.useState({ left: 8, top: 8 });
      React.useLayoutEffect(() => {
        function place() {
          const rect = ref.current.getBoundingClientRect();
          const left = Math.max(8, Math.min(anchor.x, window.innerWidth - rect.width - 8));
          const top = Math.max(8, anchor.y + 6 + rect.height <= window.innerHeight - 8 ? anchor.y + 6 : anchor.y - rect.height - 6);
          setPosition(previous => previous.left === left && previous.top === top ? previous : { left, top });
        }
        place();
        window.addEventListener('resize', place);
        return () => window.removeEventListener('resize', place);
      }, [anchor, title, children]);
      React.useEffect(() => {
        const old = document.activeElement;
        const node = ref.current;
        const input = node.querySelector('input');
        (input || node.querySelector('button'))?.focus();
        input?.select();
        function key(event) {
          if (event.key === 'Escape') { event.preventDefault(); close(); }
          if (event.key !== 'Tab') return;
          const items = [...node.querySelectorAll('button:not(:disabled),input:not(:disabled)')];
          const first = items[0], last = items[items.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        }
        node.addEventListener('keydown', key);
        return () => { node.removeEventListener('keydown', key); old?.focus(); };
      }, [title]);
      return h('div', { className: 'st-popover-layer', onMouseDown: e => { if (e.target === e.currentTarget) close(); } },
        h('section', { className: 'st-dialog', style: position, ref, role: 'dialog', 'aria-modal': true, 'aria-label': title },
          h('div', { className: 'st-heading' }, h('h3', { style: { flex: 1 } }, title), h('button', { className: 'st-icon', onClick: close, 'aria-label': t('close') }, '×')), children));
    }
    return {
      inject: ['slots', 'locale', 'uiWorkspace'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, dictionaries));
        const t = ctx.locale.bind(NS);
        let state = null;
        let error = '';
        const listeners = new Set();
        const notify = () => { for (const fn of listeners) fn(); };
        async function execute(input) {
          const response = await fetch('/api/local-session-tags', {
            method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(input),
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || response.statusText);
          state = result;
          error = '';
          notify();
          return state;
        }
        const refresh = () => execute({ action: 'list' }).catch(reason => { error = reason.message; notify(); });
        const source = { subscribe: fn => { listeners.add(fn); return () => listeners.delete(fn); }, getSnapshot: () => state };
        let openMove = null;
        function MoveMenu({ sessionId: id, useMenuOpenState }) {
          const [, setOpen] = useMenuOpenState();
          return h('button', { type: 'button', role: 'menuitem', className: 'st-choice', onClick: e => { const anchor = anchorOf(e); setOpen(false); openMove?.(id, anchor); } }, '#  ' + t('move'));
        }
        // Keep the dragged row mounted while the target highlight changes.
        // The "…" button opens the native Session menu: it owns the built-in
        // actions and renders this plugin's registered "Move to tag" row.
        function SessionRow({ s, statuses, workspaces, pinned, panelActive, selected, title, openMenu }) {
          const status = statuses.get(s.id);
          const pending = status?.pendingInteraction;
          const running = status?.running ?? s.running;
          const workspace = workspaces.items.find(w => w.sessionIds.includes(s.id));
          return h('div', null,
            h('div', { className: 'st-row st-drag', 'data-row-key': 'session:' + s.id, 'aria-current': !panelActive && s.id === selected, draggable: !s.blank, onDragStart: e => { e.dataTransfer.setData(SESSION_DRAG_TYPE, s.id); e.dataTransfer.effectAllowed = 'move'; } },
              h('button', { className: 'st-open', onClick: () => ctx.uiWorkspace.openSession(s.id), title: title(s) }, h('span', { className: 'st-dot ' + (pending ? 'waiting' : running ? 'running' : status?.completionUnread ? 'done' : ''), 'aria-label': pending?.kind || (running ? 'running' : '') }), h('span', { className: 'st-name' }, (pinned.has(s.id) ? '⌑ ' : '') + title(s))),
              !s.blank && h('button', { className: 'st-icon', title: t('menu'), 'aria-label': t('menu'), 'aria-haspopup': 'menu', 'data-context-menu-trigger': '', onPointerDown: e => e.stopPropagation(), onClick: e => { const anchor = anchorOf(e); if (openMenu) openMenu(s.id, s.title || '', anchor, 'toggle'); else openMove?.(s.id, anchor); } }, '⋯')),
            h('div', { className: 'st-caption', title: workspace?.path || s.cwd }, workspace?.title || s.cwd));
        }
        ctx.slots.inject('sidebar.workspaces', () => {
          let installed;
          let installedOriginal;
          const install = () => {
            const original = ctx.slots.entries('sidebar.workspaces').find(entry => (entry.options.priority || 0) === 0);
            if (original === installedOriginal) return;
            installed?.();
            installed = undefined;
            installedOriginal = original;
            if (!original) return;
            const Original = original.component;
          function Browser(props) {
            const list = props.useSessions(s => s);
            const workspaces = props.useWorkspaces(s => s);
            const statuses = props.useSessionStatus(s => s);
            const panelActive = props.usePanelInfo(s => s.activePanelId !== null);
            const data = React.useSyncExternalStore(source.subscribe, source.getSnapshot);
            const [, force] = React.useState(0);
            const [folds, setFolds] = React.useState(readFolds);
            const [query, setQuery] = React.useState('');
            const [dialog, setDialog] = React.useState(null);
            const [draft, setDraft] = React.useState('');
            const [busy, setBusy] = React.useState(false);
            const [failure, setFailure] = React.useState('');
            const [drop, setDrop] = React.useState(null);
            const [limits, setLimits] = React.useState({});
            const draggedSession = React.useRef(null);
            const workspaceDrop = React.useRef(null);
            const selected = Object.values(list.byId).find(s => (s.retainedBy.mainView || 0) > 0)?.id;
            React.useEffect(() => {
              const off = source.subscribe(() => force(v => v + 1));
              refresh();
              const focus = () => refresh();
              window.addEventListener('focus', focus);
              const reset = ctx.on('connection/reset', focus);
              return () => { off(); reset(); window.removeEventListener('focus', focus); };
            }, []);
            React.useEffect(() => {
              openMove = (id, anchor) => { setFailure(''); setDialog({ kind: 'move', id, anchor }); refresh(); };
              return () => { openMove = null; };
            }, []);
            const assignments = data?.assignments || {};
            const excluded = React.useMemo(() => new Set(Object.keys(assignments)), [data]);
            const filteredSessions = React.useMemo(() => {
              const cache = new WeakMap();
              return s => {
                if (!cache.has(s)) cache.set(s, { ...s, ids: s.ids.filter(id => !excluded.has(id)), byId: Object.fromEntries(Object.entries(s.byId).filter(([id]) => !excluded.has(id))) });
                return cache.get(s);
              };
            }, [excluded]);
            const filteredWorkspaces = React.useMemo(() => {
              const cache = new WeakMap();
              return s => {
                if (!cache.has(s)) cache.set(s, { ...s, items: s.items.map(w => ({ ...w, sessionIds: w.sessionIds.filter(id => !excluded.has(id)) })) });
                return cache.get(s);
              };
            }, [excluded]);
            const sessionHook = (selector, equal) => props.useSessions(s => selector(filteredSessions(s)), equal);
            const workspaceHook = (selector, equal) => props.useWorkspaces(s => selector(filteredWorkspaces(s)), equal);
            function close() { if (!busy) { setDialog(null); setFailure(''); } }
            async function act(input) {
              setBusy(true); setFailure('');
              try { await execute(input); setDialog(null); }
              catch (reason) { setFailure(reason.message); }
              finally { setBusy(false); }
            }
            function toggle(id) {
              const next = { ...folds, [id]: !folds[id] };
              setFolds(next);
              try { localStorage.setItem('dsh.sessionTags.folds', JSON.stringify(next)); } catch (reason) { error = reason.message; notify(); }
            }
            const archived = new Set(workspaces.archivedSessionIds);
            const pinned = new Set(workspaces.pinnedSessionIds);
            const title = s => s.blank ? t('newSession') : s.title || t('untitled');
            const rows = list.ids.map(id => list.byId[id]).filter(s => s && s.origin !== 'subagent' && (!s.blank || s.id === selected) && !archived.has(s.id));
            function draggableSession(id) {
              const session = list.byId[id];
              return session && !session.blank && session.origin !== 'subagent' && !archived.has(id);
            }
            function workspaceDropTarget(target, id) {
              if (!assignments[id] || !target.closest('.st-native-workspaces')) return null;
              const row = target.closest('[data-row-key]');
              const key = row?.getAttribute('data-row-key');
              let targetId;
              if (key?.startsWith('workspace:')) targetId = key.slice('workspace:'.length);
              else if (key?.startsWith('session:')) targetId = workspaces.items.find(w => w.sessionIds.includes(key.slice('session:'.length)))?.workspaceId ?? '';
              else return null;
              const originalId = workspaces.items.find(w => w.sessionIds.includes(id))?.workspaceId ?? '';
              return targetId === originalId ? row : null;
            }
            function highlightWorkspace(row) {
              if (workspaceDrop.current === row) return;
              workspaceDrop.current?.classList.remove('st-workspace-drop');
              workspaceDrop.current = row;
              row?.classList.add('st-workspace-drop');
            }
            let content;
            if (dialog?.kind === 'move') content = h(React.Fragment, null,
              h('button', { className: 'st-choice', disabled: busy, onClick: () => act({ action: 'unassign', sessionIds: [dialog.id] }) }, t('original')),
              ...(data?.tags || []).map(tag => h('button', { key: tag.id, className: 'st-choice', disabled: busy, onClick: () => act({ action: 'assign', tagId: tag.id, sessionIds: [dialog.id] }) }, '# ' + tag.name + (assignments[dialog.id] === tag.id ? ' ✓' : ''))),
              h('button', { className: 'st-choice', disabled: busy, onClick: () => { setDraft(''); setDialog({ kind: 'create', moveId: dialog.id, anchor: dialog.anchor }); } }, '+ ' + t('create')));
            else if (dialog?.kind === 'menu') content = h(React.Fragment, null,
              h('button', { className: 'st-choice', onClick: () => { setDraft(dialog.tag.name); setDialog({ kind: 'rename', tag: dialog.tag, anchor: dialog.anchor }); } }, t('rename')),
              h('button', { className: 'st-choice', onClick: () => setDialog({ kind: 'delete', tag: dialog.tag, anchor: dialog.anchor }) }, t('remove')));
            else if (dialog?.kind === 'delete') content = h(React.Fragment, null, h('p', null, t('removeConfirm')), h('div', { className: 'st-buttons' }, h('button', { onClick: close, disabled: busy }, t('cancel')), h('button', { disabled: busy, onClick: () => act({ action: 'delete', tagId: dialog.tag.id }) }, t('remove'))));
            else if (dialog) content = h('form', { onSubmit: async e => {
              e.preventDefault();
              if (dialog.kind === 'rename') return act({ action: 'rename', tagId: dialog.tag.id, name: draft });
              setBusy(true); setFailure('');
              try {
                const next = await execute({ action: 'create', name: draft });
                if (dialog.moveId) await execute({ action: 'assign', tagId: next.tags.find(tag => tag.name === draft.trim()).id, sessionIds: [dialog.moveId] });
                setDialog(null);
              } catch (reason) { setFailure(reason.message); }
              finally { setBusy(false); }
            } }, h('label', { htmlFor: 'st-tag-name' }, t('name')), h('input', { id: 'st-tag-name', value: draft, maxLength: 80, required: true, onChange: e => setDraft(e.target.value), disabled: busy }), h('div', { className: 'st-buttons' }, h('button', { type: 'button', onClick: close, disabled: busy }, t('cancel')), h('button', { type: 'submit', className: 'st-primary', disabled: busy || !draft.trim() }, t('save'))));
            return h('div', {
              className: 'st-root',
              onDragStartCapture: e => {
                draggedSession.current = null;
                const key = e.target.closest('[data-row-key]')?.getAttribute('data-row-key');
                if (!key?.startsWith('session:')) return;
                const id = key.slice('session:'.length);
                if (draggableSession(id)) {
                  draggedSession.current = id;
                  e.dataTransfer.setData(SESSION_DRAG_TYPE, id);
                }
              },
              onDragOverCapture: e => {
                const row = workspaceDropTarget(e.target, draggedSession.current);
                highlightWorkspace(row);
                if (!row) return;
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = 'move';
                setDrop(null);
              },
              onDropCapture: e => {
                highlightWorkspace(null);
                const id = e.dataTransfer.getData(SESSION_DRAG_TYPE);
                if (!draggableSession(id) || !workspaceDropTarget(e.target, id)) return;
                e.preventDefault();
                e.stopPropagation();
                return act({ action: 'unassign', sessionIds: [id] });
              },
              onDragEndCapture: () => { draggedSession.current = null; highlightWorkspace(null); setDrop(null); },
            }, h('style', null, css),
              props.wide && h('section', { className: 'st-tags', 'aria-label': t('tags') },
                h('div', { className: 'st-heading' }, h('span', null, t('tags')), h('button', { className: 'st-icon', title: t('refresh'), 'aria-label': t('refresh'), onClick: refresh }, '↻'), h('button', { className: 'st-icon', title: t('create'), 'aria-label': t('create'), onClick: e => { setFailure(''); setDraft(''); setDialog({ kind: 'create', anchor: anchorOf(e) }); } }, '+')),
                error && h('div', { className: 'st-error', role: 'alert' }, error),
                !data && !error && h('div', { className: 'st-muted' }, t('loading')),
                data?.tags.length > 0 && h('input', { className: 'st-search', type: 'search', placeholder: t('search'), 'aria-label': t('search'), value: query, onChange: e => setQuery(e.target.value) }),
                data?.tags.map(tag => {
                  const all = rows.filter(s => assignments[s.id] === tag.id);
                  const matching = all.filter(s => (title(s) + ' ' + (s.cwd || '')).toLowerCase().includes(query.toLowerCase()));
                  const limit = limits[tag.id] || 5;
                  return h('section', { key: tag.id, className: 'st-group' + (drop === tag.id ? ' st-drop' : ''), onDragOver: e => { if (e.dataTransfer.types.includes(SESSION_DRAG_TYPE)) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDrop(tag.id); } }, onDragLeave: e => { if (!e.currentTarget.contains(e.relatedTarget)) setDrop(null); }, onDrop: e => { setDrop(null); const id = e.dataTransfer.getData(SESSION_DRAG_TYPE); if (!draggableSession(id)) return; e.preventDefault(); e.stopPropagation(); act({ action: 'assign', tagId: tag.id, sessionIds: [id] }); } },
                    h('div', { className: 'st-group-head' }, h('button', { className: 'st-fold', 'aria-expanded': !folds[tag.id], onClick: () => toggle(tag.id) }, h('span', null, folds[tag.id] ? '›' : '⌄'), h('span', null, '#'), h('span', { className: 'st-name' }, tag.name), h('span', { className: 'st-count' }, all.length)), h('button', { className: 'st-icon', 'aria-label': tag.name + ' ⋯', onClick: e => { setFailure(''); setDialog({ kind: 'menu', tag, anchor: anchorOf(e) }); } }, '⋯')),
                    !folds[tag.id] && (matching.length ? matching.slice(0, limit).map(s => h(SessionRow, { key: s.id, s, statuses, workspaces, pinned, panelActive, selected, title, openMenu: props.openSessionMenu })) : h('div', { className: 'st-muted' }, t('empty'))),
                    !folds[tag.id] && matching.length > 5 && h('button', { className: 'st-choice', onClick: () => setLimits({ ...limits, [tag.id]: limit >= matching.length ? 5 : limit + 10 }) }, t(limit >= matching.length ? 'less' : 'more')));
                })),
              failure && !dialog && h('div', { className: 'st-error', role: 'alert' }, failure),
              h('div', { className: 'st-native-workspaces' }, h(Original, { ...props, useSessions: sessionHook, useWorkspaces: workspaceHook })),
              dialog && h(Popover, { title: t(dialog.kind === 'move' ? 'move' : dialog.kind === 'menu' ? 'tags' : dialog.kind === 'delete' ? 'remove' : dialog.kind === 'rename' ? 'rename' : 'create'), close, t, anchor: dialog.anchor }, content, failure && h('div', { className: 'st-error', role: 'alert' }, failure)));
          }
            // Keep the native registration: its child-slot render bindings belong
            // to that entry and cannot be copied to a second registration.
            original.component = Browser;
            installed = () => { if (original.component === Browser) original.component = Original; };
          };
          const unsubscribe = ctx.slots.subscribe('sidebar.workspaces', install);
          try { install(); }
          catch (reason) { unsubscribe(); installed?.(); throw reason; }
          return () => { unsubscribe(); installed?.(); };
        });
        ctx.slots.inject('sidebar.workspaces.session.menu.item', () => ctx.slots.register({ name: 'sidebar.workspaces.session.menu.item', id: 'local.session-tags.move', order: 50 }, MoveMenu));
      },
    };
  },
});
