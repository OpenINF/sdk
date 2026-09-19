// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Missing from Node.js

import { _accessorValue } from '../_internal/_accessor-value';

const growable = _accessorValue(
  (globalThis as { SharedArrayBuffer?: { prototype: object } })
    .SharedArrayBuffer,
  'growable'
);

/**
 * Detects whether `value` is a
 * [`SharedArrayBuffer`](https://mdn.io/Global_Objects/SharedArrayBuffer) that
 * can grow, which is one constructed with a `maxByteLength`, section 25.2 of
 * the specification.
 *
 * A shared buffer grows and never shrinks, which is why the specification
 * calls this growable rather than resizable. The check reads the captured
 * `growable` getter, which needs the internal slot only a `SharedArrayBuffer`
 * has, so an `ArrayBuffer` says `false` even when it is resizable. In a
 * runtime without `SharedArrayBuffer`, which a page without cross-origin
 * isolation is, nothing passes.
 * @since 3.0.0
 * @category Structured Data
 * @param value The value to identify.
 * @returns `true` if `value` is a growable `SharedArrayBuffer`; else, `false`.
 * @example
 * ```ts
 * isGrowableSharedArrayBuffer(
 *   new SharedArrayBuffer(8, { maxByteLength: 16 })
 * ); // ↪ true
 *
 * isGrowableSharedArrayBuffer(new SharedArrayBuffer(8)); // ↪ false
 * ```
 */
export function isGrowableSharedArrayBuffer(value: unknown): boolean {
  return growable(value);
}
