// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { NodeError } from '../../src/abstractions/node-error';

describe(NodeError.name, () => {
  it('should replace only the stack header', () => {
    function createError(): NodeError {
      return new NodeError('ERR_TEST', 'short message');
    }

    const error = createError();
    const [header, ...frames] = error.stack?.split('\n') ?? [];

    assert.strictEqual(header, 'Error [ERR_TEST]: short message');
    assert.ok(frames.some((frame) => frame.includes('createError')));
  });
});
