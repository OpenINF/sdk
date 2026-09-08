// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getAllKeys } from '../../src/helpers/get-all-keys';

describe(getAllKeys.name, () => {
  it('should collect own property names across the prototype chain', () => {
    const base = Object.create(null) as Record<string, unknown>;
    base['a'] = 1;
    const mid = Object.create(base) as Record<string, unknown>;
    mid['b'] = 2;

    assert.deepStrictEqual(getAllKeys(mid).sort(), ['a', 'b']);
  });

  it('should not duplicate a key shadowed at multiple levels', () => {
    const base = Object.create(null) as Record<string, unknown>;
    base['a'] = 1;
    const mid = Object.create(base) as Record<string, unknown>;
    mid['a'] = 2;

    assert.deepStrictEqual(getAllKeys(mid), ['a']);
  });
});
