import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { applyOperation, createInitialState } from './model.js';

export const inject = ['commands', 'tools', 'storageDomain', 'connection'];

const stateSchema = z.object({
  tags: z.array(z.object({ id: z.string(), name: z.string() })),
  assignments: z.record(z.string(), z.string()),
});

const outputSchema = {
  type: 'object',
  properties: {
    tags: {
      type: 'array',
      items: {
        type: 'object',
        properties: { id: { type: 'string' }, name: { type: 'string' } },
        required: ['id', 'name'],
        additionalProperties: false,
      },
    },
    assignments: { type: 'object' },
  },
  required: ['tags', 'assignments'],
  additionalProperties: false,
};

export async function apply(ctx) {
  const domain = await ctx.storageDomain.open({
    name: 'local_session_tags',
    version: 1,
    tables: {},
    global: { schema: stateSchema, initial: createInitialState() },
  });
  let queue = Promise.resolve();
  ctx.effect(() => async () => {
    await queue;
    await domain.close();
  });

  // Reads also join the queue so both callers see the latest persisted write.
  function execute(operation) {
    const result = queue.then(async () => {
      const state = applyOperation(
        domain.global.get(),
        operation,
        operation?.action === 'create' ? randomUUID() : undefined,
      );
      if (operation.action !== 'list') await domain.global.set(state);
      return state;
    });
    // Recover only the scheduling tail; the original rejection reaches the caller.
    queue = result.then(() => undefined, () => undefined);
    return result;
  }

  // Connection authenticates the desktop owner before dispatching this route.
  ctx.connection.fetch.register({
    path: '/api/local-session-tags',
    methods: ['POST'],
    requestBody: 'buffered',
    fetch: async request => {
      try {
        return Response.json(await execute(await request.json()), { headers: { 'cache-control': 'no-store' } });
      } catch (reason) {
        return Response.json({ error: reason.message }, { status: 400 });
      }
    },
  });

  ctx.effect(() => ctx.commands.register({
    name: 'session-tags',
    description: 'Manage session tags and assignments without deleting sessions.',
    input: { hint: 'JSON: {"action":"list"}' },
    handler: async ({ rawInput }) => ({
      kind: 'success',
      text: JSON.stringify(await execute(JSON.parse(rawInput))),
    }),
  }));

  ctx.effect(() => ctx.tools.register({
    name: 'session_tags',
    description: 'List or manage session tags and assignments. Deleting a tag unassigns its sessions; it never deletes sessions. Returns the saved tags and assignments.',
    parameters: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['list', 'create', 'rename', 'delete', 'assign', 'unassign'],
        },
        name: { type: 'string', description: 'Required for create and rename; must be non-empty and unique.' },
        tagId: { type: 'string', description: 'Required for rename, delete, and assign.' },
        sessionIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'Non-empty session ID array required for assign and unassign.',
        },
      },
      required: ['action'],
      additionalProperties: false,
    },
    output: {
      schema: outputSchema,
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value) }],
    },
    execute,
  }));
}
