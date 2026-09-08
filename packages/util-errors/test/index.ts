// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import * as utilErrors from '../src/index';

describe('index', () => {
  it('should export every public exception as a constructor', () => {
    const names = [
      'InvalidArgsNumberError',
      'InvalidArgTypeError',
      'InvalidArgValueError',
      'InvalidPropertyTypeError',
      'InvalidPropertyValueError',
      'InvalidReturnPropertyTypeError',
      'InvalidReturnPropertyValueError',
      'InvalidReturnTypeError',
      'InvalidReturnValueError',
      'MissingArgsError',
      'MissingOptionError',
      'OutOfRangeError',
      'UnhandledErrorError',
    ] as const;

    for (const name of names) {
      assert.strictEqual(typeof utilErrors[name], 'function');
    }
  });

  it('should agree with its exports on a representative value', () => {
    const err = new utilErrors.UnhandledErrorError('boom');
    assert.ok(err instanceof Error);
    assert.strictEqual(err.code, 'ERR_UNHANDLED_ERROR');
  });
});
