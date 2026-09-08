// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from TypeScript Compiler

import { hasOwn } from '../guards/has-own';

/**
 * Gets the value of an owned property of an object.
 * @param obj An object.
 * @param key A property key name.
 * @returns The value of an owned property in an object.
 */
export function getProperty<P extends PropertyKey, T>(
  obj: Record<P, T>,
  key: P
): T | undefined {
  return hasOwn(obj, key) ? obj[key] : undefined;
}
