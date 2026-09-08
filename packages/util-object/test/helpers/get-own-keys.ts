// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getOwnKeys } from '../../src/helpers/get-own-keys';

describe(getOwnKeys.name, () => {
  it('should return own enumerable keys', () => {
    assert.deepStrictEqual(getOwnKeys({ a: 1, b: 2 }), ['a', 'b']);
  });

  it('should not return inherited keys', () => {
    const obj = Object.create({ inherited: 1 }) as Record<string, unknown>;
    obj['own'] = 2;
    assert.deepStrictEqual(getOwnKeys(obj), ['own']);
  });
});
