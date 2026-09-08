// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getPropertyDescriptor } from '../../src/helpers/get-property-descriptor';

describe(getPropertyDescriptor.name, () => {
  it('should return the descriptor for an own property', () => {
    assert.deepStrictEqual(getPropertyDescriptor({ a: 1 }, 'a'), {
      value: 1,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  });

  it('should return undefined for a missing property', () => {
    assert.strictEqual(getPropertyDescriptor<string>({}, 'a'), undefined);
  });
});
