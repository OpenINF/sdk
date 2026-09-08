// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { generateStackTrace } from '../../src/helpers/generate-stack-trace';

describe(generateStackTrace.name, () => {
  it('should return a non-empty stack trace string', () => {
    const stack = generateStackTrace();
    assert.strictEqual(typeof stack, 'string');
    assert.ok(stack.length > 0);
  });
});
