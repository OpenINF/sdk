// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { Integer } from '../../src/guards/is-integer';
import { validateArgCount } from '../../src/validators/validate-arg-count';

const int = (n: number): Integer => n as Integer;

describe(validateArgCount.name, () => {
  it('should not throw when argCount is within range', () => {
    assert.doesNotThrow(() => validateArgCount('foo', int(1), int(2), int(1)));
  });

  it('should throw when argCount is below minCount', () => {
    assert.throws(
      () => validateArgCount('foo', int(1), int(2), int(0)),
      /expected by the .foo. function is 1, but 0 were passed/
    );
  });

  it('should throw when argCount is above maxCount', () => {
    assert.throws(
      () => validateArgCount('foo', int(1), int(2), int(3)),
      /expected by the .foo. function is 2, but 3 were passed/
    );
  });
});
