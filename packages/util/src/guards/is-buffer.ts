// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '@openinf/util-core';

/**
 * Alias for
 * [`Buffer.isBuffer()`](https://nodejs.org/dist/latest/docs/api/buffer.html#buffer_static_method_buffer_isbuffer_obj).
 * Detects whether `value` is classified as a
 * [`Buffer`](https://nodejs.org/dist/latest/docs/api/buffer.html) object.
 * @since 3.0.0
 * @category Typed Arrays
 * @param value The value to identify.
 * @returns `true` if `value` is a Buffer; else, `false`.
 * @example
 * ```ts
 * import util from '@openinf/util';
 *
 * util.isBuffer({ length: 0 }); // ↪ false
 *
 * util.isBuffer([]); // ↪ false
 
 * util.isBuffer(Buffer.from('foo')); // ↪ true
 *
 * util.isBuffer(new Uint8Array(1024)); // ↪ false
 *
 * util.isBuffer(Buffer.alloc(10)); // ↪ true
 * ```
 */
export function isBuffer(value: unknown): value is globalThis.Buffer {
  return Buffer.isBuffer(value);
}
(isBuffer as Guard).expectation = 'be a Buffer object';
