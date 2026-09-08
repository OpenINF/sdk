// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { UnhandledErrorError } from '../../src/exceptions/unhandled-error-error';

describe(UnhandledErrorError.name, () => {
  it('should set name and code', () => {
    const err = new UnhandledErrorError();
    assert.ok(err instanceof Error);
    assert.strictEqual(err.name, 'UnhandledErrorError');
    assert.strictEqual(err.code, 'ERR_UNHANDLED_ERROR');
  });

  it('should use a generic message when no error is given', () => {
    const err = new UnhandledErrorError();
    assert.strictEqual(err.message, 'Unhandled error.');
  });

  it('should include the given error in the message', () => {
    const err = new UnhandledErrorError('boom');
    assert.strictEqual(err.message, 'Unhandled error. (boom)');
  });
});
