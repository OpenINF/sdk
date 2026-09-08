// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from TypeScript Compiler

/**
 * Safer version of `Function` which should not be called.
 * Every function should be assignable to this, but this should not be
 * assignable to every function.
 */
export type AnyFunction = (...args: never[]) => void;
