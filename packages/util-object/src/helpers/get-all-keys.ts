// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from TypeScript Compiler. Copyright Microsoft. All right reserved.

/**
 * Returns the names of every string-keyed property of an object, its own and
 * those it inherits, enumerable or not, each named once. The walk goes up the
 * whole prototype chain, so for an ordinary object the names
 * `Object.prototype` defines, such as `constructor` and `toString`, are
 * included.
 * @category Fundamental Objects
 * @param obj An object from which to get keys.
 * @returns The names, own ones first, then each prototype's in turn.
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
