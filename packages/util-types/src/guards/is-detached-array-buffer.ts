// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Missing from Node.js

import { _accessorValue } from '../_internal/_accessor-value';

const detached = _accessorValue(ArrayBuffer, 'detached');

/**
 * Detects whether `value` is an
 * [`ArrayBuffer`](https://mdn.io/Global_Objects/ArrayBuffer) whose data has
 * been detached, which `transfer` and a transferring `structuredClone` do,
 * section 25.1 of the specification.
 *
 * A detached buffer is still an `ArrayBuffer`, so `isArrayBuffer` says `true`
 * for one; this says whether its data is gone. The check reads the captured
 * `detached` getter, which needs the internal slot only an `ArrayBuffer` has,
 * so a `SharedArrayBuffer` and an object carrying the tag both say `false`.
 * In a runtime without the getter, nothing passes.
 * @since 3.0.0
 * @category Structured Data
 * @param value The value to identify.
 * @returns `true` if `value` is a detached `ArrayBuffer`; else, `false`.
 * @example
 * ```ts
 * const buffer = new ArrayBuffer(8);
 *
 * isDetachedArrayBuffer(buffer); // ↪ false
 *
 * buffer.transfer();
 *
 * isDetachedArrayBuffer(buffer); // ↪ true
 * ```
 */
export function isDetachedArrayBuffer(value: unknown): boolean {
  return detached(value);
}
