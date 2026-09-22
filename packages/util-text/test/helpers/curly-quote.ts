// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { afterEach, describe, it, mock } from 'node:test';

import * as unicode from '../../src/_internal/has-unicode';
import { curlyQuote } from '../../src/helpers/curly-quote';

// The compiled helper reads `hasUnicode` from this module's exports on
// every call, so replacing it there works on every Node.js line, without a
// module mock.

describe('curlyQuote', () => {
  afterEach(() => {
    mock.reset();
  });

  it('should curly quote the string when Unicode is supported', () => {
    mock.method(unicode, 'hasUnicode', () => true);
    assert.strictEqual(curlyQuote('foo'), '“foo”');
  });

  it('should straight quote the string when Unicode is unsupported', () => {
    mock.method(unicode, 'hasUnicode', () => false);
    assert.strictEqual(curlyQuote('foo'), '"foo"');
  });
});
