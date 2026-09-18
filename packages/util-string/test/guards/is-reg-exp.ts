// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isRegExp } from '../../src/guards/is-reg-exp';

describe(isRegExp.name, () => {
  it('should detect a RegExp literal', () => {
    assert.strictEqual(isRegExp(/abc/), true);
  });

  it('should detect a RegExp instance', () => {
    assert.strictEqual(isRegExp(new RegExp('abc')), true);
  });

  it('should reject a regex-like string', () => {
    assert.strictEqual(isRegExp('/abc/'), false);
  });

  // The specification's IsRegExp, section 7.2.6, asks for Symbol.match first,
  // and the string methods use it. This guard asks for the internal slot, as
  // node:util's types.isRegExp does, so the two disagree here.
  it('should refuse an object carrying Symbol.match', () => {
    assert.strictEqual(isRegExp({ [Symbol.match]: true }), false);
  });
});
