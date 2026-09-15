// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import * as utilString from '../src/index';

describe('index', () => {
  it('should export every public guard as a function', () => {
    const names = [
      'isEmail',
      'isEmptyString',
      'isNonEmptyString',
      'isRegExp',
      'isStringContaining',
      'isStringNotContaining',
      'isStringObject',
    ] as const;

    for (const name of names) {
      assert.strictEqual(typeof utilString[name], 'function');
    }
  });
});
