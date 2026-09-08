// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getFunctionName } from '../../src/helpers/get-function-name';

describe(getFunctionName.name, () => {
  it("should return a named function's name", () => {
    function namedFn(): void {
      /* no-op */
    }
    assert.strictEqual(getFunctionName(namedFn), 'namedFn');
  });

  it('should prefer displayName when set', () => {
    function fn(): void {
      /* no-op */
    }
    (fn as any).displayName = 'CustomName';
    assert.strictEqual(getFunctionName(fn), 'CustomName');
  });

  it('should return an empty string for a genuinely anonymous function', () => {
    assert.strictEqual(
      getFunctionName(function (): void {
        /* no-op */
      }),
      ''
    );
  });

  it('should return an empty string for non-functions', () => {
    assert.strictEqual(getFunctionName('not a function' as any), '');
  });
});
