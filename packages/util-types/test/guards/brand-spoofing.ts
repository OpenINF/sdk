// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { runInNewContext, runInThisContext } from 'node:vm';

import {
  isAnyArrayBuffer,
  isArrayBuffer,
  isBigInt64Array,
  isBigIntObject,
  isBigUint64Array,
  isBooleanObject,
  isDataView,
  isDate,
  isFloat32Array,
  isFloat64Array,
  isInt8Array,
  isInt16Array,
  isInt32Array,
  isMap,
  isNativeError,
  isNumberObject,
  isRegExp,
  isSet,
  isSharedArrayBuffer,
  isStringObject,
  isSymbolObject,
  isTypedArray,
  isUint8Array,
  isUint8ClampedArray,
  isUint16Array,
  isUint32Array,
  isWeakMap,
  isWeakSet,
  isWebAssemblyCompiledModule,
} from '../../src';

type Predicate = (value: unknown) => boolean;

// A real value is as important as a forgery: a guard that always returns false
// would pass a suite containing only spoofs.
const cases: ReadonlyArray<readonly [string, Predicate, string]> = [
  ['ArrayBuffer', isArrayBuffer, 'new ArrayBuffer(8)'],
  ['ArrayBuffer', isAnyArrayBuffer, 'new ArrayBuffer(8)'],
  ['BigInt', isBigIntObject, 'Object(1n)'],
  ['BigInt64Array', isBigInt64Array, 'new BigInt64Array(1)'],
  ['BigUint64Array', isBigUint64Array, 'new BigUint64Array(1)'],
  ['Boolean', isBooleanObject, 'Object(false)'],
  ['DataView', isDataView, 'new DataView(new ArrayBuffer(8))'],
  ['Date', isDate, 'new Date(NaN)'],
  ['Float32Array', isFloat32Array, 'new Float32Array(1)'],
  ['Float64Array', isFloat64Array, 'new Float64Array(1)'],
  ['Int8Array', isInt8Array, 'new Int8Array(1)'],
  ['Int16Array', isInt16Array, 'new Int16Array(1)'],
  ['Int32Array', isInt32Array, 'new Int32Array(1)'],
  ['Map', isMap, 'new Map([[1, 2]])'],
  ['Number', isNumberObject, 'Object(NaN)'],
  ['RegExp', isRegExp, '/abc/g'],
  ['Set', isSet, 'new Set([1])'],
  ['SharedArrayBuffer', isSharedArrayBuffer, 'new SharedArrayBuffer(8)'],
  ['String', isStringObject, "Object('hello')"],
  ['Symbol', isSymbolObject, "Object(Symbol('test'))"],
  ['Uint8Array', isUint8Array, 'new Uint8Array(1)'],
  ['Uint8Array', isTypedArray, 'new Uint8Array(1)'],
  ['Uint8ClampedArray', isUint8ClampedArray, 'new Uint8ClampedArray(1)'],
  ['Uint16Array', isUint16Array, 'new Uint16Array(1)'],
  ['Uint32Array', isUint32Array, 'new Uint32Array(1)'],
  ['WeakMap', isWeakMap, 'new WeakMap()'],
  ['WeakSet', isWeakSet, 'new WeakSet()'],
  [
    'WebAssembly.Module',
    isWebAssemblyCompiledModule,
    'new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0]))',
  ],
];

describe('portable internal-slot checks', () => {
  for (const [tag, predicate, expression] of cases) {
    describe(tag + ' / ' + predicate.name, () => {
      it('accepts real values in this realm and another realm', () => {
        assert.strictEqual(predicate(runInThisContext(expression)), true);
        assert.strictEqual(predicate(runInNewContext(expression)), true);
      });

      it('rejects own, inherited, and frozen forged tags', () => {
        const fake = { [Symbol.toStringTag]: tag };
        assert.strictEqual(predicate(fake), false);
        assert.strictEqual(predicate(Object.create(fake)), false);
        assert.strictEqual(predicate(Object.freeze(fake)), false);
      });

      it('accepts a genuine value even after its prototype is removed', () => {
        const real = runInNewContext(expression) as object;
        Object.setPrototypeOf(real, null);
        assert.strictEqual(predicate(real), true);
      });

      it('rejects forged prototypes and proxies without invoking traps', () => {
        const real = runInThisContext(expression) as object;
        const fake = Object.create(Object.getPrototypeOf(real)) as object;
        assert.strictEqual(predicate(fake), false);
        const fail = (): never => {
          throw new Error('must not inspect input');
        };
        let calls = 0;
        const trap = (): never => {
          calls++;
          return fail();
        };
        const proxy = new Proxy(real, {
          get: trap,
          getPrototypeOf: trap,
          has: trap,
          getOwnPropertyDescriptor: trap,
          ownKeys: trap,
        });
        assert.strictEqual(predicate(proxy), false);
        assert.strictEqual(calls, 0);
        const { proxy: revoked, revoke } = Proxy.revocable(real, {});
        revoke();
        assert.strictEqual(predicate(revoked), false);
      });

      it('ignores a real value’s tag and methods without changing it', () => {
        const real = runInThisContext(expression) as object;
        const fail = (): never => {
          throw new Error('must not read input properties');
        };
        for (const key of [
          Symbol.toStringTag,
          'valueOf',
          'has',
          'getTime',
          'source',
          'buffer',
          'byteLength',
          'constructor',
        ]) {
          Object.defineProperty(real, key, { get: fail, configurable: false });
        }
        Object.preventExtensions(real);
        const before = Object.getOwnPropertyDescriptors(real);
        assert.strictEqual(predicate(real), true);
        const after = Object.getOwnPropertyDescriptors(real);
        assert.deepStrictEqual(Reflect.ownKeys(after), Reflect.ownKeys(before));
        for (const key of Reflect.ownKeys(before)) {
          assert.deepStrictEqual(
            Reflect.get(after, key),
            Reflect.get(before, key)
          );
        }
      });

      it('rejects primitives and unrelated built-ins', () => {
        for (const primitive of [
          null,
          undefined,
          1,
          NaN,
          true,
          'x',
          1n,
          Symbol(),
        ]) {
          assert.strictEqual(predicate(primitive), false);
        }
        for (const [otherTag, , otherExpression] of cases) {
          if (
            otherTag === tag ||
            predicate === isTypedArray ||
            predicate === isAnyArrayBuffer
          )
            continue;
          assert.strictEqual(
            predicate(runInThisContext(otherExpression)),
            false,
            tag + ' must not match ' + otherTag
          );
        }
      });
    });
  }

  it('identifies detached buffers and views', () => {
    const buffer = new ArrayBuffer(16);
    const view = new DataView(buffer);
    const array = new Uint16Array(buffer);
    structuredClone(buffer, { transfer: [buffer] });
    assert.strictEqual(isArrayBuffer(buffer), true);
    assert.strictEqual(isDataView(view), true);
    assert.strictEqual(isTypedArray(array), true);
    assert.strictEqual(isUint16Array(array), true);
    assert.strictEqual(isUint8Array(array), false);
    assert.strictEqual(isTypedArray(view), false);
  });

  it('identifies out-of-bounds views after a buffer shrinks', () => {
    const buffer = Reflect.construct(ArrayBuffer, [
      16,
      { maxByteLength: 32 },
    ]) as ArrayBuffer;
    const view = new DataView(buffer, 8, 8);
    const array = new Uint16Array(buffer, 8, 4);
    buffer.resize(0);
    assert.strictEqual(isDataView(view), true);
    assert.strictEqual(isUint16Array(array), true);
    assert.strictEqual(isTypedArray(array), true);
  });

  it('does not advance a regular expression or accept its prototype', () => {
    const expression = /x/g;
    expression.lastIndex = 3;
    assert.strictEqual(isRegExp(expression), true);
    assert.strictEqual(expression.lastIndex, 3);
    assert.strictEqual(isRegExp(RegExp.prototype), false);
    assert.strictEqual(isRegExp(runInNewContext('RegExp.prototype')), false);
  });

  it('rejects forged Error tags and accepts cross-realm errors', () => {
    assert.strictEqual(isNativeError({ [Symbol.toStringTag]: 'Error' }), false);
    assert.strictEqual(isNativeError(runInNewContext('new TypeError()')), true);
    assert.strictEqual(isNativeError(Object.create(Error.prototype)), false);
    assert.strictEqual(isNativeError(new Proxy(new Error(), {})), false);
    assert.strictEqual(
      isNativeError(Object.setPrototypeOf(new Error(), Object.prototype)),
      true
    );
  });

  it('ignores custom error tags on every supported Node.js line', () => {
    const error = new Error('example');
    Object.defineProperty(error, Symbol.toStringTag, {
      get() {
        throw new Error('must not read the tag');
      },
    });
    assert.strictEqual(isNativeError(error), true);
    const foreign = runInNewContext('new RangeError()') as object;
    Object.defineProperty(foreign, Symbol.toStringTag, { value: 'Custom' });
    assert.strictEqual(isNativeError(foreign), true);
  });
});
