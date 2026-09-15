// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

///////////////////////////////
// Imported Types

import type { AnyFunction, Guard } from '@openinf/util-core';

import { _toString } from './_internal/_to-string';
import type { Primitive } from './guards/is-primitive';

////////////////////////////////////////////////////////////////////////////////
// Adapted from is
////////////////////////////////////////////////////////////////////////////////

/**
 * The names of the typed array constructors.
 * @category Data Types and Values
 */
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

/**
 * The name of a typed array constructor, such as `'Uint8Array'`.
 * @category Data Types and Values
 */
export type TypedArrayTypeName = (typeof typedArrayTypeNames)[number];

/**
 * Detects whether `name` is the name of a typed array constructor.
 * @category Data Types and Values
 * @param name The value to identify.
 * @returns `true` if `name` is a typed array constructor name; else, `false`.
 */
export function isTypedArrayName(name: unknown): name is TypedArrayTypeName {
  return typedArrayTypeNames.includes(name as TypedArrayTypeName);
}
(isTypedArrayName as Guard).expectation = 'be a typed array type name';

/**
 * The built-in type names `getObjectType` can report for an object.
 * @category Data Types and Values
 */
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

/**
 * A built-in type name `getObjectType` can report, such as `'Date'`.
 * @category Data Types and Values
 */
export type ObjectTypeName = (typeof objectTypeNames)[number];

/**
 * Detects whether `name` is one of the `objectTypeNames`.
 * @category Data Types and Values
 * @param name The value to identify.
 * @returns `true` if `name` is an object type name; else, `false`.
 */
export function isObjectTypeName(name: unknown): name is ObjectTypeName {
  return objectTypeNames.includes(name as ObjectTypeName);
}
(isObjectTypeName as Guard).expectation = 'be an object type name';

/**
 * The names of the primitive types.
 * @category Data Types and Values
 */
export const primitiveTypeNames = [
  'null',
  'undefined',
  'string',
  'number',
  'bigint',
  'boolean',
  'symbol',
] as const;

/**
 * The name of a primitive type, such as `'string'`.
 * @category Data Types and Values
 */
export type PrimitiveTypeName = (typeof primitiveTypeNames)[number];

/**
 * Detects whether `name` is one of the `primitiveTypeNames`.
 * @category Data Types and Values
 * @param name The value to identify.
 * @returns `true` if `name` is a primitive type name; else, `false`.
 */
export function isPrimitiveTypeName(name: unknown): name is PrimitiveTypeName {
  return primitiveTypeNames.includes(name as PrimitiveTypeName);
}
(isPrimitiveTypeName as Guard).expectation = 'be a primitive type name';

/**
 * The name of a built-in object type or of a primitive type.
 * @category Data Types and Values
 */
export type TypeName = ObjectTypeName | PrimitiveTypeName;

/**
 * Creates a guard that tests whether `typeof value` is `type`.
 * @category Data Types and Values
 * @param type The `typeof` result to test for.
 * @returns A guard for values of that type.
 */
export function isOfType<T extends Primitive | AnyFunction>(
  type: PrimitiveTypeName | 'function'
) {
  return (value: unknown): value is T => typeof value === type;
}

/**
 * Gets the built-in type name in `value`'s `Object.prototype.toString` tag,
 * or `undefined` when it is not one of the `objectTypeNames`.
 * @category Data Types and Values
 * @param value The value to inspect.
 * @returns The type name, or `undefined`.
 */
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

/**
 * Creates a guard that tests whether `getObjectType` reports `type` for a
 * value.
 * @category Data Types and Values
 * @param type The type name to test for.
 * @returns A guard for values of that type.
 */
export const isObjectOfType =
  <T>(type: ObjectTypeName) =>
  (value: unknown): value is T =>
    getObjectType(value) === type;
