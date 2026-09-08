// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getEntries } from '../../src/helpers/get-entries';

describe(getEntries.name, () => {
  it('should return key/value pairs for own enumerable properties', () => {
    assert.deepStrictEqual(getEntries({ a: 1, b: 2 }), [
      ['a', 1],
      ['b', 2],
    ]);
  });

  it('should return an empty array for an empty object', () => {
    assert.deepStrictEqual(getEntries({}), []);
  });
});
