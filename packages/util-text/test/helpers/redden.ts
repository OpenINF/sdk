// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { afterEach, describe, it, mock } from 'node:test';

import * as ansi from '../../src/_internal/supports-ansi';
import { redden } from '../../src/helpers/redden';

// The compiled helper reads `supportsAnsi` from this module's exports on
// every call, so replacing it there works on every Node.js line, without a
// module mock.

describe('redden', () => {
  afterEach(() => {
    mock.reset();
  });

  it('should colorize the string red when ANSI is supported', () => {
    mock.method(ansi, 'supportsAnsi', () => true);
    const result: string = redden('foo');
    assert.notStrictEqual(result, 'foo');
    assert.ok(result.includes('foo'));
  });

  it('should return the string unchanged when ANSI is unsupported', () => {
    mock.method(ansi, 'supportsAnsi', () => false);
    assert.strictEqual(redden('foo'), 'foo');
  });
});
