// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { inspectValue } from '../../src/helpers/inspect-value';

describe(inspectValue.name, () => {
  it('should format numbers as their literal', () => {
    assert.strictEqual(inspectValue(1), '1');
  });

  it('should format strings with quotes', () => {
    assert.strictEqual(inspectValue('foo'), "'foo'");
  });

  it('should format objects', () => {
    assert.ok(inspectValue({ a: 1 }).includes('a: 1'));
  });

  it('should format arrays', () => {
    assert.ok(inspectValue([1, 2]).includes('1'));
    assert.ok(inspectValue([1, 2]).includes('2'));
  });
});
