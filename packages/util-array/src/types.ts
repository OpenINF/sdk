// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

/* @internal */
/**
 * A function that decides whether two values are equal.
 * @category Testing and Comparison Operations
 */
export type EqualityComparer<T> = (a: T, b: T) => boolean;

/**
 * Matches any [typed array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), like `Uint8Array` or `Float64Array`.
 * @category Indexed Collections
 */
export type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;
