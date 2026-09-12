// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  isAnyArrayBuffer,
  isArgumentsObject,
  isArrayBuffer,
  isAsyncFunction,
  isBigInt64Array,
  isBigIntObject,
  isBigUint64Array,
  isBooleanObject,
  isDataView,
  isDate,
  isFloat32Array,
  isFloat64Array,
  isGeneratorFunction,
  isGeneratorObject,
  isInt8Array,
  isInt16Array,
  isInt32Array,
  isMapIterator,
  isModuleNamespaceObject,
  isNativeError,
  isNumberObject,
  isPromise,
  isRegExp,
  isSet,
  isSetIterator,
  isSharedArrayBuffer,
  isStringObject,
  isSymbolObject,
  isTypedArray,
  isUint8Array,
  isUint8ClampedArray,
  isUint16Array,
  isUint32Array,
  isWeakMap,
  isWebAssemblyCompiledModule,
} from '../../src';

type Predicate = (value: unknown) => boolean;

const cases: ReadonlyArray<readonly [string, Predicate]> = [
  ['Arguments', isArgumentsObject],
  ['ArrayBuffer', isArrayBuffer],
  ['ArrayBuffer', isAnyArrayBuffer],
  ['AsyncFunction', isAsyncFunction],
  ['BigInt', isBigIntObject],
  ['BigInt64Array', isBigInt64Array],
  ['BigUint64Array', isBigUint64Array],
  ['Boolean', isBooleanObject],
  ['DataView', isDataView],
  ['Date', isDate],
  ['Float32Array', isFloat32Array],
  ['Float64Array', isFloat64Array],
  ['GeneratorFunction', isGeneratorFunction],
  ['Generator', isGeneratorObject],
  ['Int8Array', isInt8Array],
  ['Int16Array', isInt16Array],
  ['Int32Array', isInt32Array],
  ['Map Iterator', isMapIterator],
  ['Module', isModuleNamespaceObject],
  ['Error', isNativeError],
  ['Number', isNumberObject],
  ['Promise', isPromise],
  ['RegExp', isRegExp],
  ['Set', isSet],
  ['Set Iterator', isSetIterator],
  ['SharedArrayBuffer', isSharedArrayBuffer],
  ['String', isStringObject],
  ['Symbol', isSymbolObject],
  ['Uint8Array', isUint8Array],
  ['Uint8Array', isTypedArray],
  ['Uint8ClampedArray', isUint8ClampedArray],
  ['Uint16Array', isUint16Array],
  ['Uint32Array', isUint32Array],
  ['WeakMap', isWeakMap],
  ['WebAssembly.Module', isWebAssemblyCompiledModule],
];

describe('built-in brand spoofing', () => {
  for (const [tag, predicate] of cases) {
    it(`should not let Symbol.toStringTag impersonate ${tag}`, () => {
      const fake = {
        next: () => ({ done: true }),
        throw: () => ({ done: true }),
        [Symbol.toStringTag]: tag,
      };
      assert.strictEqual(predicate(fake), false);
    });
  }

  it('should reject revoked proxies without throwing', () => {
    const { proxy, revoke } = Proxy.revocable({}, {});
    revoke();

    for (const [, predicate] of cases) {
      assert.doesNotThrow(() => predicate(proxy));
      assert.strictEqual(predicate(proxy), false);
    }
  });
});
