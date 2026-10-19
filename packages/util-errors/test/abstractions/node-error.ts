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

  it('should keep a multiline message out of the frames', () => {
    function createError(): NodeError {
      return new NodeError('ERR_TEST', 'first line\nsecond line');
    }

    const error = createError();
    const lines = error.stack?.split('\n') ?? [];

    assert.deepStrictEqual(lines.slice(0, 2), [
      'Error [ERR_TEST]: first line',
      'second line',
    ]);
    assert.match(lines[2] ?? '', /^\s+at /);
    assert.ok(lines.slice(2).every((line) => line !== 'second line'));
  });
});
