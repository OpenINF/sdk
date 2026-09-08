// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isArgValidObject } from '../../src/validators/is-arg-valid-object';

const strict = { nullable: false, allowArray: false, allowFunction: false };

describe(isArgValidObject.name, () => {
  it('should not throw for a plain object', () => {
    assert.doesNotThrow(() => isArgValidObject({}, 'argName', strict));
  });

  it('should throw for null unless nullable is true', () => {
    assert.throws(() => isArgValidObject(null, 'argName', strict));
    assert.doesNotThrow(() =>
      isArgValidObject(null, 'argName', { ...strict, nullable: true })
    );
  });

  it('should throw for arrays unless allowArray is true', () => {
    assert.throws(() => isArgValidObject([], 'argName', strict));
    assert.doesNotThrow(() =>
      isArgValidObject([], 'argName', { ...strict, allowArray: true })
    );
  });

  it('should throw for functions unless allowFunction is true', () => {
    assert.throws(() => isArgValidObject(() => {}, 'argName', strict));
    assert.doesNotThrow(() =>
      isArgValidObject(() => {}, 'argName', { ...strict, allowFunction: true })
    );
  });
});
