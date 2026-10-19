// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Keeps the util.types.isWebAssemblyCompiledModule that Node.js no longer has.

import { _tagTester, isObjectLike } from '@openinf/util-core';

/**
 * Detects whether `value` is a compiled
 * [`WebAssembly.Module`](https://mdn.io/WebAssembly/Module) instance.
 * @since 3.0.0
 * @category Hosts and Implementations
 * @param value The value to identify.
 * @returns `true` if `value` is a `WebAssembly.Module`; else, `false`.
 */
export function isWebAssemblyCompiledModule(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('WebAssembly.Module')(value);
}
