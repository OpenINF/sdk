// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { assertIsDefined } from '../../src/assertions/assert-is-defined';

describe(assertIsDefined.name, () => {
  it('should not throw for defined values', () => {
    assert.doesNotThrow(() => assertIsDefined(0));
    assert.doesNotThrow(() => assertIsDefined(''));
  });

  it('should throw for undefined', () => {
    assert.throws(
      () => assertIsDefined(undefined),
      /Expected 'val' to be defined, but received undefined/
    );
  });

  it('should throw for null', () => {
    assert.throws(
      () => assertIsDefined(null),
      /Expected 'val' to be defined, but received null/
    );
  });
});
