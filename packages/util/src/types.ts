// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

///////////////////////////////
// Imported Types

import type { AnyFunction } from '@openinf/util-core';

import { _toString } from './_internal/_to-string';
import type { Primitive } from './guards/is-primitive';

////////////////////////////////////////////////////////////////////////////////
// Adapted from is
////////////////////////////////////////////////////////////////////////////////

export const typedArrayTypeNames = [
  'Int8Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'Int16Array',
  'Uint16Array',
  'Int32Array',
  'Uint32Array',
  'Float32Array',
  'Float64Array',
  'BigInt64Array',
  'BigUint64Array',
] as const;

export type TypedArrayTypeName = (typeof typedArrayTypeNames)[number];

export function isTypedArrayName(name: unknown): name is TypedArrayTypeName {
  return typedArrayTypeNames.includes(name as TypedArrayTypeName);
}

export const objectTypeNames = [
  'Function',
  'Generator',
  'AsyncGenerator',
  'GeneratorFunction',
  'AsyncGeneratorFunction',
  'AsyncFunction',
  'Observable',
  'Array',
  'Buffer',
  'Object',
  'RegExp',
  'Date',
  'Error',
  'Map',
  'Set',
  'WeakMap',
  'WeakSet',
  'ArrayBuffer',
  'SharedArrayBuffer',
  'DataView',
  'Promise',
  'URL',
  'HTMLElement',
  ...typedArrayTypeNames,
] as const;

export type ObjectTypeName = (typeof objectTypeNames)[number];

export function isObjectTypeName(name: unknown): name is ObjectTypeName {
  return objectTypeNames.includes(name as ObjectTypeName);
}

export const primitiveTypeNames = [
  'null',
  'undefined',
  'string',
  'number',
  'bigint',
  'boolean',
  'symbol',
] as const;

export type PrimitiveTypeName = (typeof primitiveTypeNames)[number];

export function isPrimitiveTypeName(name: unknown): name is PrimitiveTypeName {
  return primitiveTypeNames.includes(name as PrimitiveTypeName);
}

export type TypeName = ObjectTypeName | PrimitiveTypeName;

export function isOfType<T extends Primitive | AnyFunction>(
  type: PrimitiveTypeName | 'function'
) {
  return (value: unknown): value is T => typeof value === type;
}

export const getObjectType = (value: unknown): ObjectTypeName | undefined => {
  const objectTypeName = String(_toString(value)).slice(8, -1);

  // if (/HTML\w+Element/.test(objectTypeName) && is.domElement(value)) {
  //   return 'HTMLElement';
  // }

  if (isObjectTypeName(objectTypeName)) {
    return objectTypeName;
  }

  return undefined;
};

export const isObjectOfType =
  <T>(type: ObjectTypeName) =>
  (value: unknown): value is T =>
    getObjectType(value) === type;
