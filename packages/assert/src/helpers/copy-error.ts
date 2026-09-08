// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

/**
 * Creates a copy of `source`, preserving its prototype and every own
 * property descriptor.
 * @param source The error to copy.
 * @returns The copy.
 */
export function copyError(source: Error): Error {
  const keys = Object.keys(source);
  const target = Object.create(Object.getPrototypeOf(source)) as Error;

  for (const key of keys) {
    const desc = Object.getOwnPropertyDescriptor(source, key);
    if (desc !== undefined) {
      Object.defineProperty(target, key, desc);
    }
  }

  Object.defineProperty(target, 'message', { value: source.message });

  return target;
}
