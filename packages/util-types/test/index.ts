// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import * as utilTypes from '../src/index';

describe('index', () => {
  it('should export every public guard and helper as a function', () => {
    const names = [
      'isAnyArrayBuffer',
      'isArgumentsObject',
      'isArrayBuffer',
      'isArrayBufferView',
      'isArrayIterator',
      'isAsyncDisposableStack',
      'isAsyncFunction',
      'isAsyncGenerator',
      'isAsyncGeneratorFunction',
      'isAsyncIterable',
      'isBigInt64Array',
      'isBigIntObject',
      'isBigUint64Array',
      'isBooleanObject',
      'isBoxedPrimitive',
      'isDataView',
      'isDate',
      'isDisposableStack',
      'isExternal',
      'isFinalizationRegistry',
      'isFloat16Array',
      'isFloat32Array',
      'isFloat64Array',
      'isGeneratorFunction',
      'isGeneratorObject',
      'isInt16Array',
      'isInt32Array',
      'isInt8Array',
      'isIterable',
      'isIterator',
      'isIteratorHelper',
      'isMap',
      'isMapIterator',
      'isModuleNamespaceObject',
      'isNativeError',
      'isNumberObject',
      'isPromise',
      'isProxy',
      'isRegExp',
      'isRegExpStringIterator',
      'isSet',
      'isSetIterator',
      'isSharedArrayBuffer',
      'isStringIterator',
      'isStringObject',
      'isSymbolObject',
      'isTypedArray',
      'isUint16Array',
      'isUint32Array',
      'isUint8Array',
      'isUint8ClampedArray',
      'isWeakMap',
      'isWeakRef',
      'isWeakSet',
      'isWebAssemblyCompiledModule',
    ] as const;

    for (const name of names) {
      assert.strictEqual(typeof utilTypes[name], 'function');
    }
  });

  it('should agree with its exports on a representative value', () => {
    assert.strictEqual(utilTypes.isDate(new Date()), true);
    assert.strictEqual(utilTypes.isMap(new Map()), true);
    assert.strictEqual(utilTypes.isPromise(Promise.resolve()), true);
  });
});
