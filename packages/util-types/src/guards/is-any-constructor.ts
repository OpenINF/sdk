// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from TypeScript Compiler

/**
 * Any constructor, whatever arguments it takes and whatever it constructs.
 * @category Data Types and Values
 */
export type AnyConstructor = new (...args: unknown[]) => unknown;
