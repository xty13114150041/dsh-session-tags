export function createInitialState() {
  return { tags: [], assignments: {} };
}

function requiredString(value, field) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${field} must be a non-empty string.`);
  }
  return value;
}

function sessionIdsOf(operation) {
  if (!Array.isArray(operation.sessionIds) || operation.sessionIds.length === 0) {
    throw new Error('sessionIds must be a non-empty array of session IDs.');
  }
  return operation.sessionIds.map((id) => requiredString(id, 'sessionId'));
}

// The caller supplies a fresh ID for create so this operation stays pure.
export function applyOperation(state, operation, newTagId) {
  if (!operation || typeof operation !== 'object' || Array.isArray(operation)) {
    throw new Error('Operation must be an object.');
  }
  const next = {
    tags: state.tags.map((tag) => ({ ...tag })),
    assignments: { ...state.assignments },
  };
  const { action } = operation;
  if (action === 'list') return next;

  if (action === 'create' || action === 'rename') {
    const name = requiredString(operation.name, 'name').trim();
    let tag;
    if (action === 'rename') {
      requiredString(operation.tagId, 'tagId');
      tag = next.tags.find((item) => item.id === operation.tagId);
      if (!tag) throw new Error(`Tag not found: ${operation.tagId}`);
    }
    if (next.tags.some((item) => item.name === name && item.id !== tag?.id)) {
      throw new Error(`Tag name already exists: ${name}`);
    }
    if (action === 'create') {
      const id = requiredString(newTagId, 'newTagId');
      if (next.tags.some((item) => item.id === id)) {
        throw new Error(`Tag ID already exists: ${id}`);
      }
      next.tags.push({ id, name });
    } else {
      tag.name = name;
    }
    return next;
  }

  if (action === 'delete' || action === 'assign') {
    const tagId = requiredString(operation.tagId, 'tagId');
    if (!next.tags.some((tag) => tag.id === tagId)) {
      throw new Error(`Tag not found: ${tagId}`);
    }
    if (action === 'delete') {
      next.tags = next.tags.filter((tag) => tag.id !== tagId);
      next.assignments = Object.fromEntries(
        Object.entries(next.assignments).filter(([, assigned]) => assigned !== tagId),
      );
    } else {
      next.assignments = Object.fromEntries([
        ...Object.entries(next.assignments),
        ...sessionIdsOf(operation).map((id) => [id, tagId]),
      ]);
    }
    return next;
  }

  if (action === 'unassign') {
    const sessionIds = new Set(sessionIdsOf(operation));
    next.assignments = Object.fromEntries(
      Object.entries(next.assignments).filter(([id]) => !sessionIds.has(id)),
    );
    return next;
  }

  throw new Error(`Unknown session-tags action: ${String(action)}`);
}
