// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Missing from Node.js

import { _accessorValue } from '../_internal/_accessor-value';

const resizable = _accessorValue(ArrayBuffer, 'resizable');

/**
 * Detects whether `value` is an
 * [`ArrayBuffer`](https://mdn.io/Global_Objects/ArrayBuffer) that can be
 * resized, which is one constructed with a `maxByteLength`, section 25.1 of
 * the specification.
 *
 * The check reads the captured `resizable` getter, which needs the internal
 * slot only an `ArrayBuffer` has, so a `SharedArrayBuffer` says `false` even
 * when it is growable; `isGrowableSharedArrayBuffer` is that question. In a
 * runtime without the getter, nothing passes.
 * @since 3.0.0
 * @category Structured Data
 * @param value The value to identify.
 * @returns `true` if `value` is a resizable `ArrayBuffer`; else, `false`.
 * @example
 * ```ts
 * isResizableArrayBuffer(new ArrayBuffer(8, { maxByteLength: 16 })); // ↪ true
 *
 * isResizableArrayBuffer(new ArrayBuffer(8)); // ↪ false
 * ```
 */
export function isResizableArrayBuffer(value: unknown): boolean {
  return resizable(value);
}
