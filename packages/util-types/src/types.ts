// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Re-exported rather than redefined: these live in @openinf/util-core, the
// dependency-free foundation this package already depends on. Keeping one
// definition means the packages cannot drift apart.
export type {
  HasExpectation,
  Validator,
  Guard,
  Equatable,
  Comparable,
  ComparisonResult,
  Narrowable,
  Tag,
  Tagged,
  Arrayish,
} from '@openinf/util-core';

export interface Mapish {
  [k: string]: unknown;
}
// type M = keyof Mapish;
//   ^ = type M = string | number

// Adapted from TypeShield

export type MaybeNull<T> = T | null;
export type MaybeDefined<T> = T | undefined;
export type MaybeNullish<T> = T | null | undefined;

/**
 * Matches any [typed array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), like `Uint8Array` or `Float64Array`.
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
