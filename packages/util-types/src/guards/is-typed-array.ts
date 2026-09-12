// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { types as nodeTypes } from 'node:util';

import type { TypedArray } from '../types';

/**
 * Determines if value is one of the
 * [**TypedArray** element types](https://mdn.io/Global_Objects/TypedArray#typedarray_objects):
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
 * - [`BigInt64Array`](https://mdn.io/Global_Objects/BigInt64Array)
 * - [`BigUint64Array`](https://mdn.io/Global_Objects/BigUint64Array)
 * @since 3.0.0
 * @category Index Collections
 * @param value The value to identify.
 * @returns `true` if `value` is a typed array; else, `false`.
 * @example
 * ```ts
 * isTypedArray(new Uint8Array()); // ↪ true
 *
 * isTypedArray([]); // ↪ false
 * ```
 */
export function isTypedArray(value: unknown): value is TypedArray {
  return nodeTypes.isTypedArray(value);
}
