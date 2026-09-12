// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { types as nodeTypes } from 'node:util';

// Adapted from Underscore

type NativeTester = (value: unknown) => boolean;

const asyncGeneratorFactory = async function* (): AsyncGenerator<
  undefined,
  void,
  unknown
> {
  yield undefined;
};
const asyncGeneratorFunctionPrototype = Object.getPrototypeOf(
  asyncGeneratorFactory
) as object;
const asyncGeneratorPrototype = Object.getPrototypeOf(
  Object.getPrototypeOf(asyncGeneratorFactory()) as object
) as object;

const isAsyncGeneratorFunction: NativeTester = (value) => {
  try {
    return (
      typeof value === 'function' &&
      asyncGeneratorFunctionPrototype.isPrototypeOf(value)
    );
  } catch {
    return false;
  }
};

const isAsyncGenerator: NativeTester = (value) => {
  if (typeof value !== 'object' || value === null) return false;
  try {
    const directPrototype = Object.getPrototypeOf(value) as object | null;
    return (
      directPrototype !== null &&
      Object.getPrototypeOf(directPrototype) === asyncGeneratorPrototype
    );
  } catch {
    return false;
  }
};

const isWebAssemblyModule: NativeTester = (value) => {
  try {
    const webAssembly = (
      globalThis as unknown as {
        WebAssembly?: { Module: { exports(value: unknown): unknown } };
      }
    ).WebAssembly;
    if (webAssembly === undefined) return false;
    webAssembly.Module.exports(value);
    return true;
  } catch {
    return false;
  }
};

const nativeTesters: Readonly<Record<string, NativeTester>> = {
  Arguments: nodeTypes.isArgumentsObject,
  ArrayBuffer: nodeTypes.isArrayBuffer,
  AsyncFunction: nodeTypes.isAsyncFunction,
  AsyncGenerator: isAsyncGenerator,
  AsyncGeneratorFunction: isAsyncGeneratorFunction,
  BigInt: nodeTypes.isBigIntObject,
  BigInt64Array: nodeTypes.isBigInt64Array,
  BigUint64Array: nodeTypes.isBigUint64Array,
  Boolean: nodeTypes.isBooleanObject,
  DataView: nodeTypes.isDataView,
  Date: nodeTypes.isDate,
  Float32Array: nodeTypes.isFloat32Array,
  Float64Array: nodeTypes.isFloat64Array,
  Generator: nodeTypes.isGeneratorObject,
  GeneratorFunction: nodeTypes.isGeneratorFunction,
  Int8Array: nodeTypes.isInt8Array,
  Int16Array: nodeTypes.isInt16Array,
  Int32Array: nodeTypes.isInt32Array,
  Map: nodeTypes.isMap,
  'Map Iterator': nodeTypes.isMapIterator,
  Module: nodeTypes.isModuleNamespaceObject,
  Error: nodeTypes.isNativeError,
  Number: nodeTypes.isNumberObject,
  Promise: nodeTypes.isPromise,
  RegExp: nodeTypes.isRegExp,
  Set: nodeTypes.isSet,
  'Set Iterator': nodeTypes.isSetIterator,
  SharedArrayBuffer: nodeTypes.isSharedArrayBuffer,
  String: nodeTypes.isStringObject,
  Symbol: nodeTypes.isSymbolObject,
  Uint8Array: nodeTypes.isUint8Array,
  Uint8ClampedArray: nodeTypes.isUint8ClampedArray,
  Uint16Array: nodeTypes.isUint16Array,
  Uint32Array: nodeTypes.isUint32Array,
  WeakMap: nodeTypes.isWeakMap,
  WeakSet: nodeTypes.isWeakSet,
  'WebAssembly.Module': isWebAssemblyModule,
};

/**
 * Internal function for creating an internal-brand type tester.
 * @private
 * @param name The name of the type.
 * @returns The `tagTester` function.
 * @template T
 */
export function _tagTester(name: string): (value: unknown) => boolean {
  return nativeTesters[name] ?? (() => false);
}
