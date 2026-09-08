// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

////////////////////////////////////////////////////////////////////////////////
// Adapted from TypeShield
////////////////////////////////////////////////////////////////////////////////

///////////////////////////////
// Exported Types

/**
 * Safer version of `Function` which should not be called.
 * Every function should be assignable to this, but this should not be assignable to every function.
 */
export type AnyFunction = (...args: never[]) => void;

export type AnyConstructor = new (...args: unknown[]) => unknown;

export type AnyObject = Record<string, any>;

export type Arrayish = string | ArrayLike<number>;

////////////////////////////////////////////////////////////////////////////////
// Adapted from TypeShield
////////////////////////////////////////////////////////////////////////////////

/**
 * An object that has an optional expectation string.
 */
export interface HasExpectation {
  /**
   * An expectation string to use for error messages in assertions.
   */
  expectation?: string | (() => string);
}

/**
 * A function that performs a validation on an unknown value and returns a
 * boolean.
 */
export type Validator = ((value: unknown) => boolean) & HasExpectation;

/**
 * A function that performs a validation on an unknown value and returns a
 * boolean indicating the type of the value.
 */
export type Guard<T = unknown> = ((value: unknown) => value is T) &
  HasExpectation;

/**
 * Interface for defining a type-specific method for determining equality.
 */
export interface Equatable {
  /**
   * Check if this object is equal to another unknown value.
   * @param other Another value to compare to.
   * @returns True if equal; else false if not equal.
   */
  equals(other: unknown): boolean;
}

/**
 * Interface for defining a type-specific method for relation.
 */
export interface Comparable {
  /**
   * Compare this object to another unknown value.
   * @param other Another value to compare to.
   * @returns The result of the comparison.
   */
  compareTo(other: unknown): ComparisonResult;
}

/**
 * The result of an object comparison.
 * * `0` if the objects are equal.
 * * `-1` if the current instance is less than the other.
 * * `1` if the current instance is greater than the other.
 * * `undefined` if the objects are not comparable to each other.
 */
export type ComparisonResult = -1 | 0 | 1 | undefined;

/**
 * Union of types that TypeScript can narrow to literal types.
 */
export type Narrowable =
  string | number | boolean | undefined | null | void | {};

/**
 * The phantom property a {@link Tagged} type carries.
 *
 * Exists only in the type system; there is no such property at runtime.
 * @template T The tag's unique string name.
 */
export type Tag<T extends string> = {
  [K in T]: void;
};

/**
 * Brands `TValue` with a unique tag, making it *nominally* distinct from
 * other types with the same shape.
 *
 * TypeScript is structurally typed, so two aliases of the same underlying
 * type are freely interchangeable. That silently permits a whole class of
 * bug:
 * ```ts
 * type UserId = string;
 * type PostId = string;
 *
 * declare const userId: UserId;
 * const postId: PostId = userId; // compiles, but is a bug
 * ```
 *
 * Branding gives each one a distinct identity, so the compiler catches it:
 * ```ts
 * import type { Tagged } from '@openinf/util';
 *
 * type UserId = Tagged<string, '__UserId__'>;
 * type PostId = Tagged<string, '__PostId__'>;
 *
 * declare const userId: UserId;
 * const postId: PostId = userId; // error: '__PostId__' is missing
 * ```
 *
 * ### When to reach for this
 *
 * Brand a type when the underlying type **cannot express the constraint you
 * care about**, and something must be checked or validated to establish it:
 *
 * - Values that share a representation but not a meaning: `UserId` vs
 *   `PostId`, `Celsius` vs `Fahrenheit`, `Meters` vs `Feet`.
 * - Values carrying a proof obligation: `SanitizedHtml` vs a raw `string`,
 *   `AbsolutePath` vs any `string`, `ValidatedConfig` vs parsed input.
 * - Numeric refinements, which is how this package uses it internally:
 *   `number` cannot say "integer" or "positive", so `@openinf/util`'s
 *   `Integer` and friends brand it.
 *
 * Because a branded value can only be produced by something that asserts the
 * tag, pair each brand with a guard or validator that mints it. Consumers
 * then cannot fabricate one by accident, which is the entire point.
 *
 * ### When not to
 *
 * Do **not** brand a type that already describes exactly the set you mean.
 * A brand adds no information there, and actively gets in the way: a value
 * of the underlying type is no longer assignable to the branded one, so
 * ordinary values can't be passed to functions expecting it.
 *
 * `string`, `number`, `boolean`, `symbol`, and `bigint` are already nominal
 * — nothing else is assignable to them, and no structural impostor is
 * possible. `Date`, `Error`, and other built-in object types are structural
 * in principle, but impersonating one means implementing its entire
 * interface, and a runtime guard rejects impostors anyway. So
 * `Tagged<string, '__String__'>` and `Tagged<Date, '__Date__'>` buy nothing
 * that `string` and `Date` don't already provide.
 * @template TValue The underlying runtime type.
 * @template TTag A unique string identifying the brand, by convention
 *  written as `'__Name__'`.
 */
export type Tagged<TValue, TTag extends string> = TValue & Tag<TTag>;
