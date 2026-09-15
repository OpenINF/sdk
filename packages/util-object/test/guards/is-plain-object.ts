// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isPlainObject } from '../../src/guards/is-plain-object';

describe(isPlainObject.name, () => {
  it('should detect object literals', () => {
    assert.strictEqual(isPlainObject({ x: 0, y: 0 }), true);
  });

  it('should detect objects with a null prototype', () => {
    assert.strictEqual(isPlainObject(Object.create(null)), true);
  });

  it('should reject arrays', () => {
    assert.strictEqual(isPlainObject([1, 2, 3]), false);
  });

  it('should reject class instances', () => {
    function Foo(this: { a: number }): void {
      this.a = 1;
    }
    assert.strictEqual(isPlainObject(new (Foo as any)()), false);
  });

  it('should accept an object literal that sets Symbol.toStringTag', () => {
    assert.strictEqual(isPlainObject({ [Symbol.toStringTag]: 'Date' }), true);
    assert.strictEqual(isPlainObject({ [Symbol.toStringTag]: 'X' }), true);
  });

  it('should accept namespace objects, which are ordinary objects', () => {
    assert.strictEqual(isPlainObject(Math), true);
    assert.strictEqual(isPlainObject(JSON), true);
  });

  it('should reject functions', () => {
    assert.strictEqual(
      isPlainObject(() => {}),
      false
    );
  });

  it('should reject built-in objects even when their prototype is replaced', () => {
    const builtIns: unknown[] = [
      (function () {
        // oxlint-disable-next-line prefer-rest-params -- an arguments object is the point.
        return arguments;
      })(),
      new Error(),
      new Boolean(false),
      new Number(1),
      new String(''),
      new Date(),
      /x/,
    ];
    for (const value of builtIns) {
      Object.setPrototypeOf(value, Object.prototype);
      assert.strictEqual(isPlainObject(value), false, String(value));
    }
  });

  it('should reject built-ins with a replaced prototype even when tagged', () => {
    const date = Object.setPrototypeOf(new Date(), Object.prototype) as object;
    Object.defineProperty(date, Symbol.toStringTag, { value: 'X' });
    assert.strictEqual(isPlainObject(date), false);
  });

  // The line section 20.1.3.6 draws: a Map is told apart only by its
  // prototype's Symbol.toStringTag, so without that prototype the language
  // classifies it as Object. Testing for every other slot would throw a probe
  // per kind of built-in on every call; see the doc comment.
  it('should treat a Map whose prototype was replaced as the language does', () => {
    const map = Object.setPrototypeOf(new Map(), Object.prototype) as object;
    assert.strictEqual(Object.prototype.toString.call(map), '[object Object]');
    assert.strictEqual(isPlainObject(map), true);
  });

  it('should reject a module namespace object', async () => {
    // Written as a string so the CommonJS build keeps a real dynamic import
    // rather than rewriting it into a require.
    const loadNamespace = new Function(
      'return import("data:text/javascript,export const answer = 42")'
    ) as () => Promise<unknown>;
    assert.strictEqual(isPlainObject(await loadNamespace()), false);
  });

  it('should reject non-object-like values', () => {
    assert.strictEqual(isPlainObject(null), false);
    assert.strictEqual(isPlainObject(42), false);
  });
});
