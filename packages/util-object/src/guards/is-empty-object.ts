// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from jQuery

/**
 * Check to see if an object is empty (contains no enumerable properties).
 * @param obj The object to check.
 * @returns `true` if no own property keys exist on the object; else, `false`.
 */
export function isEmptyObject<P extends PropertyKey>(
  obj: Record<P, unknown>
): boolean {
  for (const name in obj) {
    void name;
    return false;
  }
  return true;
}
