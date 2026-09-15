// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Re-exported rather than redefined: these live in @openinf/util-core, the
// dependency-free foundation this package already depends on. Keeping one
// definition means the packages cannot drift apart.
export type {
  AnyConstructor,
  AnyFunction,
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

/**
 * An object indexed by string keys, with values of any type.
 * @category Fundamental Objects
 */
export interface Mapish {
  [k: string]: unknown;
}
// type M = keyof Mapish;
//   ^ = type M = string | number

// Adapted from TypeShield

/**
 * `T`, or `null`.
 * @category Data Types and Values
 */
export type MaybeNull<T> = T | null;

/**
 * `T`, or `undefined`.
 * @category Data Types and Values
 */
export type MaybeDefined<T> = T | undefined;

/**
 * `T`, `null`, or `undefined`.
 * @category Data Types and Values
 */
export type MaybeNullish<T> = T | null | undefined;

// A typed array is §23.2, and the type lives in @openinf/util-array with the
// guards that narrow to it.
export type { TypedArray } from '@openinf/util-array';
