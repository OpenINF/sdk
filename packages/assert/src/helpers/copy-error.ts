// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

/**
 * Creates a copy of `source`, preserving its prototype and every own
 * property descriptor.
 * @param source The error to copy.
 * @returns The copy.
 */
export function copyError(source: Error): Error {
  return Object.create(
    Object.getPrototypeOf(source),
    Object.getOwnPropertyDescriptors(source)
  ) as Error;
}
