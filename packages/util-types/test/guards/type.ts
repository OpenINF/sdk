// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { type } from '../../src/guards/type';

describe(type.name, () => {
  it('should identify null and undefined', () => {
    assert.strictEqual(type(null), 'null');
    assert.strictEqual(type(undefined), 'undefined');
  });

  it('should identify primitives by typeof', () => {
    assert.strictEqual(type(1), 'number');
    assert.strictEqual(type('a'), 'string');
    assert.strictEqual(type(true), 'boolean');
  });

  it('should identify built-in object types', () => {
    assert.strictEqual(type({}), 'object');
    assert.strictEqual(type([]), 'array');
    assert.strictEqual(type(new Date()), 'date');
    assert.strictEqual(type(/abc/), 'regexp');
    assert.strictEqual(type(new Error('boom')), 'error');
  });

  it('should identify functions', () => {
    assert.strictEqual(
      type(function foo(): void {}),
      'function'
    );
  });
});
