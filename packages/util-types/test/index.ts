// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import * as utilTypes from '../src/index';

describe('index', () => {
  it('should export every public guard and helper as a function', () => {
    const names = [
      'isAnyArrayBuffer',
      'isArrayBufferView',
      'isArgumentsObject',
      'isArrayBuffer',
      'isAsyncFunction',
      'isAsyncGeneratorFunction',
      'isAsyncGenerator',
      'isBigIntObject',
      'isBigInt64Array',
      'isBigUint64Array',
      'isBooleanObject',
      'isBoxedPrimitive',
      'isDataView',
      'isDate',
      'isExternal',
      'isFloat32Array',
      'isFloat64Array',
      'isGeneratorFunction',
      'isGeneratorObject',
      'hasInterface',
      'isInt8Array',
      'isInt16Array',
      'isInt32Array',
      'isMapIterator',
      'isMapLike',
      'isMap',
      'isModuleNamespaceObject',
      'isNativeError',
      'isNumberObject',
      'isPromise',
      'isProxy',
      'isRegExp',
      'isSet',
      'isSetIterator',
      'isSharedArrayBuffer',
      'isStringObject',
      'isSymbolObject',
      'isTypedArray',
      'isUint8Array',
      'isUint8ClampedArray',
      'isUint16Array',
      'isUint32Array',
      'isWeakMap',
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
