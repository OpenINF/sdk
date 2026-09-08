// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import * as utilText from '../src/index';

describe('index', () => {
  it('should export every public guard and helper as a function', () => {
    const names = [
      'isEmail',
      'isEmptyString',
      'isNonEmptyString',
      'isStringContaining',
      'isStringNotContaining',
      'blueify',
      'curlyQuote',
      'ellipsify',
      'italicize',
      'mdCodeSpans2html',
      'redden',
      'stringify',
      'underline',
      'yellow',
    ] as const;

    for (const name of names) {
      assert.strictEqual(typeof utilText[name], 'function');
    }
  });

  it('should agree with its exports on a representative value', () => {
    assert.strictEqual(utilText.isEmail('foo@example.com'), true);
    assert.strictEqual(utilText.stringify('foo'), 'foo');
  });
});
