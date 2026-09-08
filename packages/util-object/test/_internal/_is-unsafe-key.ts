// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  clone,
  deepAssign,
  deepMerge,
  deepMixin,
  mixin,
  omit,
} from '../../src/index';

/** Fresh each time: `JSON.parse` makes `__proto__` a genuine own property. */
const payload = (): Record<string, unknown> =>
  JSON.parse('{"__proto__":{"POLLUTED":"yes"},"safe":"kept"}') as Record<
    string,
    unknown
  >;

const ctorPayload = (): Record<string, unknown> =>
  JSON.parse('{"constructor":{"prototype":{"POLLUTED":"yes"}}}') as Record<
    string,
    unknown
  >;

describe('prototype pollution', () => {
  const probe = () => (({}) as Record<string, unknown>)['POLLUTED'];

  it('should not let deepAssign reach Object.prototype', () => {
    deepAssign({}, payload());
    assert.strictEqual(probe(), undefined);
  });

  it('should not let deepMixin reach Object.prototype', () => {
    deepMixin({}, payload());
    assert.strictEqual(probe(), undefined);
  });

  it('should not let mixin reach Object.prototype', () => {
    mixin({}, payload());
    assert.strictEqual(probe(), undefined);
  });

  it('should not let deepMerge reach Object.prototype', () => {
    deepMerge({}, payload());
    assert.strictEqual(probe(), undefined);
  });

  it('should not let clone or omit reach Object.prototype', () => {
    clone(payload());
    omit(payload(), []);
    assert.strictEqual(probe(), undefined);
  });

  it('should not reach Object.prototype through the constructor gadget', () => {
    deepAssign({}, ctorPayload());
    assert.strictEqual(probe(), undefined);
  });

  it('should leave the target’s own prototype intact', () => {
    for (const result of [
      deepAssign({}, payload()),
      mixin({}, payload()),
      deepMerge({}, payload()),
      clone(payload()),
    ]) {
      assert.strictEqual(Object.getPrototypeOf(result), Object.prototype);
    }
  });

  it('should still copy the safe properties alongside the skipped ones', () => {
    assert.deepStrictEqual(deepAssign({}, payload()), { safe: 'kept' });
    assert.deepStrictEqual(clone(payload()), { safe: 'kept' });
  });

  it('should not disturb ordinary deep merging', () => {
    assert.deepStrictEqual(
      deepAssign({ a: { b: 1 } }, { a: { c: 2 } }, { d: 3 }),
      {
        a: { b: 1, c: 2 },
        d: 3,
      }
    );
  });
});
