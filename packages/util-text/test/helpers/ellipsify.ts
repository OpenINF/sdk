// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { afterEach, describe, it, mock } from 'node:test';

import * as unicode from '../../src/_internal/has-unicode';
import { ellipsify } from '../../src/helpers/ellipsify';

// The compiled helper reads `hasUnicode` from this module's exports on
// every call, so replacing it there works on every Node.js line, without a
// module mock.

describe('ellipsify', () => {
  afterEach(() => {
    mock.reset();
  });

  it('should append a Unicode ellipsis when Unicode is supported', () => {
    mock.method(unicode, 'hasUnicode', () => true);
    assert.strictEqual(ellipsify('foo'), 'foo…');
  });

  it('should append three dots when Unicode is unsupported', () => {
    mock.method(unicode, 'hasUnicode', () => false);
    assert.strictEqual(ellipsify('foo'), 'foo...');
  });
});
