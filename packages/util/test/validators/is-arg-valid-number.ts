// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isArgValidNumber } from '../../src/validators/is-arg-valid-number';

describe(isArgValidNumber.name, () => {
  it('should not throw for a number', () => {
    assert.doesNotThrow(() => isArgValidNumber(42, 'argName'));
  });

  it('should throw for a non-number', () => {
    assert.throws(() => isArgValidNumber('42', 'argName'));
  });
});
