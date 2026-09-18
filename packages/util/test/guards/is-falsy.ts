// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isFalsy } from '../../src/guards/is-falsy';

describe(isFalsy.name, () => {
  it('should detect falsy values', () => {
    assert.strictEqual(isFalsy(false), true);
    assert.strictEqual(isFalsy(0), true);
    assert.strictEqual(isFalsy(-0), true);
    assert.strictEqual(isFalsy(0n), true);
    assert.strictEqual(isFalsy(''), true);
    assert.strictEqual(isFalsy(null), true);
    assert.strictEqual(isFalsy(undefined), true);
    assert.strictEqual(isFalsy(NaN), true);
  });

  it('should reject truthy values', () => {
    assert.strictEqual(isFalsy(new Boolean()), false);
    assert.strictEqual(isFalsy(1), false);
    assert.strictEqual(isFalsy('foo'), false);
    assert.strictEqual(isFalsy({}), false);
  });

  it('should agree with ToBoolean, which is what `!` performs', () => {
    const values: unknown[] = [
      false,
      0,
      -0,
      0n,
      '',
      null,
      undefined,
      Number.NaN,
      true,
      1,
      'a',
      {},
      [],
      new Boolean(false),
      () => {},
    ];

    for (const value of values) {
      assert.strictEqual(isFalsy(value), !value, String(value));
    }
  });

  // Annex B.3.6: an object with an [[IsHTMLDDA]] internal slot, `document.all`
  // in a browser, is falsy. Nothing in Node has that slot, so this stands in
  // for it: whatever ToBoolean says of a value, isFalsy says the same.
  it('should follow ToBoolean for an object, rather than a list of values', () => {
    const htmlDda = { [Symbol.toPrimitive]: () => '' };
    assert.strictEqual(isFalsy(htmlDda), !htmlDda);
    assert.strictEqual(isFalsy(htmlDda), false);
  });
});
