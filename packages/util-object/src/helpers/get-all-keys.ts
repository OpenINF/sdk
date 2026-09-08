// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from TypeScript Compiler. Copyright Microsoft. All right reserved.

/**
 * Returns a list containing the names of all of the object's own property keys.
 * @param obj An object from which to get keys from.
 * @returns A list of the names of all of the object's own property keys.
 */
export function getAllKeys(obj: Record<string, unknown>): string[] {
  const result: string[] = [];
  // Membership is tracked in a Set while order comes from `result`. Testing
  // the array itself, as `pushIfUnique` does, scans it again for every name
  // and made this quadratic in the number of keys.
  const seen = new Set<string>();
  let current: Record<string, unknown> | null = obj;

  while (current !== null) {
    const names = Object.getOwnPropertyNames(current);
    for (const name of names) {
      if (!seen.has(name)) {
        seen.add(name);
        result.push(name);
      }
    }
    current = Object.getPrototypeOf(current) as Record<string, unknown> | null;
  }

  return result;
}
