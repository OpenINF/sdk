// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

/**
 * Type guard that ensures that the value can be coerced to Object
 * to weed out host objects that do not derive from Object.
 * @param  value The value to check
 * @returns       If the value is coercible into an Object
 */
export function isObjectCoercible(value: unknown): boolean {
  return value === Object(value);
}
