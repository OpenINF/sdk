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
});
