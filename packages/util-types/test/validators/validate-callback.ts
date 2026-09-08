// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { validateCallback } from '../../src/validators/validate-callback';

describe(validateCallback.name, () => {
  it('should not throw for a function', () => {
    assert.doesNotThrow(() => validateCallback(() => {}));
  });

  it('should throw a TypeError for a non-function', () => {
    assert.throws(() => validateCallback('not a function'), TypeError);
    assert.throws(
      () => validateCallback('not a function'),
      /The 'callback' argument must be of type function\. Received string/
    );
  });
});
