// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isNode } from '../../src/helpers/is-node';

describe('isNode', () => {
  it('should be true when running under Node.js', () => {
    assert.strictEqual(isNode, true);
  });
});
