// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isArgValidString } from '../../src/validators/is-arg-valid-string';

describe(isArgValidString.name, () => {
  it('should not throw for a string', () => {
    assert.doesNotThrow(() => isArgValidString('foo', 'argName'));
  });

  it('should throw for a non-string', () => {
    assert.throws(() => isArgValidString(42, 'argName'));
  });
});
