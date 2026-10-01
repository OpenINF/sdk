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

  it('should accept a function that takes parameters', () => {
    function add(a: number, b: number): number {
      return a + b;
    }
    assert.strictEqual(getFunctionName(add), 'add');
  });

  it('should read the name of an async or generator function from its source', () => {
    async function load(): Promise<void> {
      /* no-op */
    }
    function* count(): Generator<number> {
      yield 1;
    }
    for (const fn of [load, count]) {
      const name = fn.name;
      Object.defineProperty(fn, 'name', { value: '' });
      assert.strictEqual(getFunctionName(fn), name);
    }
  });
});
