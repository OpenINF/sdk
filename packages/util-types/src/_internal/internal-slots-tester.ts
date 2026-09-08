// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { getClassName } from './get-class-name';
import { tryDetectInternalSlots } from './try-detect-internal-slots';

/**
 * Internal function for creating an internal slots-based type tester.
 * @private
 * @param name The name of the type.
 * @returns The `tagTester` function.
 */
export function internalSlotsTester(name: string): (value: unknown) => boolean {
  return function (value: unknown): boolean {
    return getClassName(value) === name && tryDetectInternalSlots(value);
  };
}
