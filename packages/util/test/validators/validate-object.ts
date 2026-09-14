// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { validateObject } from '../../src/validators/validate-object';

const strict = { nullable: false, allowArray: false, allowFunction: false };

describe(validateObject.name, () => {
  it('should not throw for a plain object', () => {
    assert.doesNotThrow(() => validateObject({}, 'argName', strict));
  });

  it('should throw for null unless nullable is true', () => {
    assert.throws(() => validateObject(null, 'argName', strict));
    assert.doesNotThrow(() =>
      validateObject(null, 'argName', { ...strict, nullable: true })
    );
  });

  it('should throw for arrays unless allowArray is true', () => {
    assert.throws(() => validateObject([], 'argName', strict));
    assert.doesNotThrow(() =>
      validateObject([], 'argName', { ...strict, allowArray: true })
    );
  });

  it('should throw for functions unless allowFunction is true', () => {
    assert.throws(() => validateObject(() => {}, 'argName', strict));
    assert.doesNotThrow(() =>
      validateObject(() => {}, 'argName', { ...strict, allowFunction: true })
    );
  });
});
