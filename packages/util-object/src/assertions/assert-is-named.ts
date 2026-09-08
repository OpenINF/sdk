// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { isNamed } from '../guards/is-named';
import type { Named } from '../guards/is-named';

/**
 * Asserts that `value` has a `name` property of type `string`.
 * @param value The value to check.
 * @param message An optional message to use in the thrown error.
 * @throws { TypeError } if `value` is not named.
 */
export function assertIsNamed(
  value: unknown,
  message?: string
): asserts value is Named {
  if (!isNamed(value)) {
    throw new TypeError(message ?? 'Expected value to be named');
  }
}
