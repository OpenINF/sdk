// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isMap } from '../../src/guards/is-map';

describe(isMap.name, () => {
  it('should detect a Map instance', () => {
    assert.strictEqual(isMap(new Map()), true);
  });

  it('should reject a Set instance', () => {
    assert.strictEqual(isMap(new Set()), false);
  });

  it('should reject a plain object', () => {
    assert.strictEqual(isMap({}), false);
  });

  it('should reject a Map-tagged object without internal Map slots', () => {
    const fake: unknown = { [Symbol.toStringTag]: 'Map' };
    assert.strictEqual(isMap(fake), false);
  });
});
