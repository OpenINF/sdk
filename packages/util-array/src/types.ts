// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

/* @internal */
/**
 * A function that decides whether two values are equal.
 * @category Testing and Comparison Operations
 */
export type EqualityComparer<T> = (a: T, b: T) => boolean;
