// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { assertUnreachable } from '../../src/assertions/assert-unreachable';

describe(assertUnreachable.name, () => {
  it('should always throw with a default message', () => {
    assert.throws(
      () => assertUnreachable(),
      /Statement should not be reachable/
    );
  });

  it('should throw with a custom message', () => {
    assert.throws(() => assertUnreachable('custom message'), /custom message/);
  });
});
