import test from 'node:test';
import assert from 'node:assert/strict';
import { apply } from './host.js';
import { createInitialState } from './model.js';

async function fixture() {
  let state = createInitialState();
  let route;
  await apply({
    effect: fn => fn(),
    storageDomain: { open: async () => ({
      global: { get: () => state, set: async next => { state = next; } }, close: async () => {},
    }) },
    commands: { register: () => () => {} },
    tools: { register: () => () => {} },
    connection: { fetch: { register: value => { route = value; } } },
  });
  const call = body => route.fetch(new Request('http://local' + route.path, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
  }));
  return { route, call };
}

test('desktop data route creates and reads persisted tags without a chat command', async () => {
  const { call } = await fixture();
  const created = await call({ action: 'create', name: '合金研究' });
  assert.equal(created.status, 200);
  assert.equal(created.headers.get('cache-control'), 'no-store');
  const state = await created.json();
  assert.equal(state.tags[0].name, '合金研究');
  assert.deepEqual(await (await call({ action: 'list' })).json(), state);
});

test('an invalid UI operation reports its error and does not block the next request', async () => {
  const { call } = await fixture();
  const invalid = await call({ action: 'create', name: '' });
  assert.equal(invalid.status, 400);
  assert.match((await invalid.json()).error, /non-empty/);
  assert.equal((await call({ action: 'list' })).status, 200);
});
