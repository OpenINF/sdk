// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import * as util from '../src/index';

describe('index', () => {
  it('should export every public guard as a function', () => {
    const guardNames = [
      'hasInterface',
      'isAny',
      'isArray',
      'isBigInt',
      'isBoolean',
      'isBuffer',
      'isDate',
      'isDefined',
      'isError',
      'isFiniteNumber',
      'isFunction',
      'isInt32',
      'isInteger',
      'isNaN',
      'isNegativeInteger',
      'isNegative',
      'isNonNullish',
      'isNull',
      'isNullish',
      'isNumber',
      'isObject',
      'isPositiveInteger',
      'isPositive',
      'isPrimitive',
      'isString',
      'isSymbol',
      'isUint32',
      'isUndefined',
      'isUnknown',
      'and',
      'or',
    ] as const;

    for (const name of guardNames) {
      assert.strictEqual(typeof util[name], 'function');
    }
  });

  it('should agree with its guards on a representative value', () => {
    assert.strictEqual(util.isString('foo'), true);
    assert.strictEqual(util.isNumber(42), true);
    assert.strictEqual(util.isArray([1, 2, 3]), true);
    assert.strictEqual(util.isNullish(null), true);
  });
});
