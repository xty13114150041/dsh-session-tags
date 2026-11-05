import test from 'node:test';
import assert from 'node:assert/strict';
import { applyOperation, createInitialState } from './model.js';

function fixture() {
  return {
    tags: [{ id: 'work', name: 'Work' }, { id: 'study', name: 'Study' }],
    assignments: { s1: 'work', s2: 'study', s3: 'work' },
  };
}

function freezeState(state) {
  state.tags.forEach(Object.freeze);
  Object.freeze(state.tags);
  Object.freeze(state.assignments);
  return Object.freeze(state);
}

test('initial states are empty and independent', () => {
  const first = createInitialState();
  assert.deepEqual(first, { tags: [], assignments: {} });
  first.tags.push({ id: 'one', name: 'One' });
  assert.deepEqual(createInitialState(), { tags: [], assignments: {} });
});

test('list returns an isolated snapshot', () => {
  const state = freezeState(fixture());
  const listed = applyOperation(state, { action: 'list' });
  assert.deepEqual(listed, state);
  assert.notEqual(listed, state);
  listed.tags[0].name = 'Changed';
  listed.assignments.s1 = 'study';
  assert.equal(state.tags[0].name, 'Work');
  assert.equal(state.assignments.s1, 'work');
});

test('create trims names and leaves its input untouched', () => {
  const state = freezeState(fixture());
  const next = applyOperation(state, { action: 'create', name: '  Personal  ' }, 'personal');
  assert.deepEqual(next.tags.at(-1), { id: 'personal', name: 'Personal' });
  assert.equal(state.tags.length, 2);
  assert.deepEqual(next.assignments, state.assignments);
});

test('create rejects empty names, duplicate names and duplicate IDs', () => {
  const state = fixture();
  for (const name of ['', '   ', undefined, null, 42]) {
    assert.throws(() => applyOperation(state, { action: 'create', name }, 'new'), /name must/);
  }
  assert.throws(() => applyOperation(state, { action: 'create', name: ' Work ' }, 'new'), /already exists/);
  assert.throws(() => applyOperation(state, { action: 'create', name: 'New' }, 'work'), /ID already exists/);
  assert.throws(() => applyOperation(state, { action: 'create', name: 'New' }), /newTagId must/);
});

test('rename changes only the matching tag and permits its own name', () => {
  const state = freezeState(fixture());
  const next = applyOperation(state, { action: 'rename', tagId: 'work', name: ' Office ' });
  assert.deepEqual(next.tags[0], { id: 'work', name: 'Office' });
  assert.deepEqual(next.tags[1], state.tags[1]);
  assert.deepEqual(next.assignments, state.assignments);
  assert.equal(state.tags[0].name, 'Work');
  assert.deepEqual(applyOperation(state, { action: 'rename', tagId: 'work', name: 'Work' }), state);
});

test('rename rejects empty names and another tag’s name', () => {
  const state = fixture();
  assert.throws(() => applyOperation(state, { action: 'rename', tagId: 'work', name: ' ' }), /name must/);
  assert.throws(() => applyOperation(state, { action: 'rename', tagId: 'work', name: 'Study' }), /already exists/);
});

test('delete removes only the tag and its assignments', () => {
  const state = freezeState(fixture());
  const next = applyOperation(state, { action: 'delete', tagId: 'work' });
  assert.deepEqual(next, {
    tags: [{ id: 'study', name: 'Study' }],
    assignments: { s2: 'study' },
  });
  assert.deepEqual(state.assignments, { s1: 'work', s2: 'study', s3: 'work' });
});

test('assign handles multiple sessions, deduplicates IDs and replaces a previous assignment', () => {
  const state = freezeState(fixture());
  const next = applyOperation(state, { action: 'assign', tagId: 'study', sessionIds: ['s1', 's4', 's4'] });
  assert.deepEqual(next.assignments, { s1: 'study', s2: 'study', s3: 'work', s4: 'study' });
  assert.equal(state.assignments.s1, 'work');
  assert.deepEqual(next.tags, state.tags);
});

test('unassign removes only requested assignments and accepts an unassigned session', () => {
  const state = freezeState(fixture());
  const next = applyOperation(state, { action: 'unassign', sessionIds: ['s1', 'absent'] });
  assert.deepEqual(next.assignments, { s2: 'study', s3: 'work' });
  assert.deepEqual(next.tags, state.tags);
  assert.equal(state.assignments.s1, 'work');
});

test('missing or nonexistent tags fail explicitly', () => {
  for (const action of ['rename', 'delete', 'assign']) {
    const operation = { action, name: 'New', sessionIds: ['s1'] };
    assert.throws(() => applyOperation(fixture(), operation), /tagId must/);
    assert.throws(() => applyOperation(fixture(), { ...operation, tagId: 'absent' }), /Tag not found: absent/);
  }
});

test('assign and unassign reject invalid session ID arrays without mutating input', () => {
  const state = freezeState(fixture());
  for (const action of ['assign', 'unassign']) {
    for (const sessionIds of [undefined, 's1', [], [''], [' '], ['s1', 1]]) {
      assert.throws(() => applyOperation(state, { action, tagId: 'work', sessionIds }), /sessionIds? must/);
    }
  }
  assert.deepEqual(state, fixture());
});

test('arbitrary session ID keys remain own data properties', () => {
  const next = applyOperation(fixture(), {
    action: 'assign', tagId: 'work', sessionIds: ['__proto__', 'constructor'],
  });
  assert.equal(Object.getPrototypeOf(next.assignments), Object.prototype);
  assert.equal(Object.hasOwn(next.assignments, '__proto__'), true);
  assert.equal(next.assignments.__proto__, 'work');
  assert.equal(next.assignments.constructor, 'work');
  const unassigned = applyOperation(next, { action: 'unassign', sessionIds: ['__proto__'] });
  assert.equal(Object.hasOwn(unassigned.assignments, '__proto__'), false);
});

test('invalid operations and unknown actions fail explicitly', () => {
  for (const operation of [undefined, null, [], 'list']) {
    assert.throws(() => applyOperation(fixture(), operation), /Operation must/);
  }
  assert.throws(() => applyOperation(fixture(), { action: 'remove-session' }), /Unknown session-tags action/);
});
