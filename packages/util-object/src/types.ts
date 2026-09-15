// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '@openinf/util-core';

import { _toString } from './_internal/_to-string';

// Properties of the Object Prototype Object as per ES5 spec
// https://github.com/microsoft/TypeScript/blob/38da7c600c83e7b31193a62495239a0fe478cb67/tests/cases/compiler/library_ObjectPrototypeProperties.ts

/**
 * Safer version of `Function` which should not be called.
 * Every function should be assignable to this, but this should not be assignable to every function.
 * @category Data Types and Values
 */
export type AnyFunction = (...args: never[]) => void;

/**
 * Any constructor, whatever arguments it takes and whatever it constructs.
 * @category Data Types and Values
 */
export type AnyConstructor = new (...args: unknown[]) => unknown;

/**
 * An object with string keys and values of any type.
 * @category Data Types and Values
 */
export type AnyObject = Record<string, any>;

/**
 * An object indexed by string keys, mapping to values of type `T`.
 * @category Fundamental Objects
 */
export interface MapLike<T> {
  [index: string]: T;
}

////////////////////////////////////////////////////////////////////////////////
// Adapted from is
////////////////////////////////////////////////////////////////////////////////

/**
 * Matches any [primitive value](https://developer.mozilla.org/en-US/docs/Glossary/Primitive).
 * @category Data Types and Values
 */
export type Primitive =
  null | undefined | string | number | boolean | symbol | bigint;

/**
 * The attributes of a property, as `Object.getOwnPropertyDescriptor`
 * returns them and `Object.defineProperty` accepts them.
 * @category Fundamental Objects
 */
export interface PropertyDescriptor {
  configurable?: boolean;
  enumerable?: boolean;
  value?: any;
  writable?: boolean;
  get?(): any;
  set?(v: any): void;
}

/**
 * Property descriptors keyed by property name, as `Object.defineProperties`
 * and `Object.create` accept them.
 * @category Fundamental Objects
 */
export interface PropertyDescriptorMap {
  [s: string]: PropertyDescriptor;
}

/**
 * The type of the global `Object` constructor and its static methods.
 * @category Fundamental Objects
 */
export interface ObjectConstructor {
  (): any;
  (value: any): any;

  /** A reference to the prototype for a class of objects. */
  readonly prototype: AnyObject;

  new (value?: any): AnyObject;

  /**
   * Returns the prototype of an object.
   * @param o The object that references the prototype.
   */
  getPrototypeOf(o: any): any;

  /**
   * Gets the own property descriptor of the specified object.
   * An own property descriptor is one that is defined directly on the object and is not inherited from the object's prototype.
   * @param o Object that contains the property.
   * @param p Name of the property.
   */
  getOwnPropertyDescriptor(
    o: any,
    p: PropertyKey
  ): PropertyDescriptor | undefined;

  /**
   * Returns the names of the own properties of an object. The own properties of an object are those that are defined directly
   * on that object, and are not inherited from the object's prototype. The properties of an object include both fields (objects) and functions.
   * @param o Object that contains the own properties.
   */
  getOwnPropertyNames(o: any): string[];

  /**
   * Creates an object that has the specified prototype or that has null prototype.
   * @param o Object to use as a prototype. May be null.
   */
  create(o: AnyObject | null): any;

  /**
   * Creates an object that has the specified prototype, and that optionally contains specified properties.
   * @param o Object to use as a prototype. May be null
   * @param properties JavaScript object that contains one or more property descriptors.
   */
  create(
    o: AnyObject | null,
    properties: PropertyDescriptorMap & ThisType<any>
  ): any;

  /**
   * Adds a property to an object, or modifies attributes of an existing property.
   * @param o Object on which to add or modify the property. This can be a native JavaScript object (that is, a user-defined object or a built in object) or a DOM object.
   * @param p The property name.
   * @param attributes Descriptor for the property. It can be for a data property or an accessor property.
   */
  defineProperty(
    o: any,
    p: PropertyKey,
    attributes: PropertyDescriptor & ThisType<any>
  ): any;

  /**
   * Adds one or more properties to an object, and/or modifies attributes of existing properties.
   * @param o Object on which to add or modify the properties. This can be a native JavaScript object or a DOM object.
   * @param properties JavaScript object that contains one or more descriptor objects. Each descriptor object describes a data property or an accessor property.
   */
  defineProperties(
    o: any,
    properties: PropertyDescriptorMap & ThisType<any>
  ): any;

  /**
   * Prevents the modification of attributes of existing properties, and prevents the addition of new properties.
   * @param o Object on which to lock the attributes.
   */
  seal<T>(o: T): T;

  /**
   * Prevents the modification of existing property attributes and values, and prevents the addition of new properties.
   * @param a Array on which to lock the attributes.
   */
  freeze<T>(a: T[]): readonly T[];

  /**
   * Prevents the modification of existing property attributes and values, and prevents the addition of new properties.
   * @param f Function on which to lock the attributes.
   */
  freeze<T extends AnyFunction>(f: T): T;

  /**
   * Prevents the modification of existing property attributes and values, and prevents the addition of new properties.
   * @param o Object on which to lock the attributes.
   */
  freeze<T>(o: T): Readonly<T>;

  /**
   * Prevents the addition of new properties to an object.
   * @param o Object to make non-extensible.
   */
  preventExtensions<T>(o: T): T;

  /**
   * Returns true if existing property attributes cannot be modified in an object and new properties cannot be added to the object.
   * @param o Object to test.
   */
  isSealed(o: any): boolean;

  /**
   * Returns true if existing property attributes and values cannot be modified in an object, and new properties cannot be added to the object.
   * @param o Object to test.
   */
  isFrozen(o: any): boolean;

  /**
   * Returns a value that indicates whether new properties can be added to an object.
   * @param o Object to test.
   */
  isExtensible(o: any): boolean;

  /**
   * Returns the names of the enumerable string properties and methods of an object.
   * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
   */
  keys(o: AnyObject): string[];
}

/**
 * Provides functionality common to all JavaScript objects.
 */
declare let Object: ObjectConstructor;

/**
 * The members every object inherits from `Object.prototype`.
 * @category Fundamental Objects
 */
export interface Object {
  /** The initial value of Object.prototype.constructor is the standard built-in Object constructor. */
  constructor: AnyFunction;

  /** Returns a string representation of an object. */
  toString(): string;

  /** Returns a date converted to a string using the current locale. */
  toLocaleString(): string;

  /** Returns the primitive value of the specified object. */
  valueOf(): AnyObject;

  // export interface Object {
  //   hasOwnProperty<T>(this: T, v: any): v is keyof T;
  // }

  /**
   * Determines whether an object has a property with the specified name.
   * @param v A property name.
   */
  hasOwnProperty(v: PropertyKey): boolean;

  /**
   * Determines whether an object exists in another object's prototype chain.
   * @param v Another object whose prototype chain is to be checked.
   */
  isPrototypeOf(v: AnyObject): boolean;

  /**
   * Determines whether a specified property is enumerable.
   * @param v A property name.
   */
  propertyIsEnumerable(v: PropertyKey): boolean;
}

/// <reference lib="es2018"/>
/// <reference lib="dom"/>
/// <reference types="node"/>

////////////////////////////////////////////////////////////////////////////////
// Adapted from is
////////////////////////////////////////////////////////////////////////////////

// export { Class, TypedArray, ObservableLike, Primitive };

// /**
//  * Matches a value that is like an [Observable](https://github.com/tc39/proposal-observable).
//  */
// export interface ObservableLike {
//   subscribe(observer: (value: unknown) => void): void;
//   [Symbol.observable](): ObservableLike;
// }

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
