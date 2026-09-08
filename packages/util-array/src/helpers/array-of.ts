// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

export function arrayOf<T>(count: number, f: (index: number) => T): T[] {
  const result: T[] = Array.from<T>({ length: count });
  for (let i = 0; i < count; i++) {
    result[i] = f(i);
  }
  return result;
}
