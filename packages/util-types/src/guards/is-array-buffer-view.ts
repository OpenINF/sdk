// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

/**
 * Detects whether `value` is classified as an
 * [`ArrayBufferView`](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView),
 * which is a helper type representing any of the following JavaScript
 * [**TypedArray**](https://mdn.io/Global_Objects/TypedArray) types:
 *
 * - [`Int8Array`](https://mdn.io/Global_Objects/Int8Array)
 * - [`Uint8Array`](https://mdn.io/Global_Objects/Uint8Array)
 * - [`Uint8ClampedArray`](https://mdn.io/Global_Objects/Uint8ClampedArray)
 * - [`Int16Array`](https://mdn.io/Global_Objects/Int16Array)
 * - [`Uint16Array`](https://mdn.io/Global_Objects/Uint16Array)
 * - [`Int32Array`](https://mdn.io/Global_Objects/Int32Array)
 * - [`Uint32Array`](https://mdn.io/Global_Objects/Uint32Array)
 * - [`Float32Array`](https://mdn.io/Global_Objects/Float32Array)
 * - [`Float64Array`](https://mdn.io/Global_Objects/Float64Array)
 * - [`DataView`](https://mdn.io/Global_Objects/DataView)
 * @since 3.0.0
 * @category Index Collections
 * @param value The value to identify.
 * @returns `true` if `value` is an `ArrayBufferView`; else, `false`.
 * @example
 * ```ts
 * isArrayBufferView(new DataView(new ArrayBuffer(16))); // ↪ true
 *
 * isArrayBufferView(new BigUint64Array()); // ↪ false
 * ```
 */
export function isArrayBufferView(value: unknown): boolean {
  return ArrayBuffer.isView(value);
}
