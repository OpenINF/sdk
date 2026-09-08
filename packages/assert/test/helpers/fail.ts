// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { AssertionError } from '../../src/errors/assertion-error';
import { fail } from '../../src/helpers/fail';

describe(fail.name, () => {
  it('should throw with the given message', () => {
    assert.throws(() => fail('boom'), /boom/);
  });

  it('should default the message when none is given', () => {
    assert.throws(() => fail(), /Assertion failed/);
  });

  it('should throw an instance of AssertionError', () => {
    assert.throws(() => fail('boom'), AssertionError);
  });
});
