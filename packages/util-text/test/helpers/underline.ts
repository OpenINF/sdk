// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { afterEach, describe, it, mock } from 'node:test';

import * as ansi from '../../src/_internal/supports-ansi';
import { underline } from '../../src/helpers/underline';

// The compiled helper reads `supportsAnsi` from this module's exports on
// every call, so replacing it there works on every Node.js line, without a
// module mock.

describe('underline', () => {
  afterEach(() => {
    mock.reset();
  });

  it('should underline the string when ANSI is supported', () => {
    mock.method(ansi, 'supportsAnsi', () => true);
    const result: string = underline('foo');
    assert.notStrictEqual(result, 'foo');
    assert.ok(result.includes('foo'));
  });

  it('should return the string unchanged when ANSI is unsupported', () => {
    mock.method(ansi, 'supportsAnsi', () => false);
    assert.strictEqual(underline('foo'), 'foo');
  });
});
