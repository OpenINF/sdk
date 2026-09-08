// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

// https://nodejs.org/dist/latest-v16.x/docs/api/util.html#util_util_types_iswebassemblycompiledmodule_value

import { isObjectLike } from '@openinf/util-object';

import { _tagTester } from '../_internal/_tag-tester';

/**
 * Detects whether `value` is a compiled
 * [`WebAssembly.Module`](https://mdn.io/WebAssembly/Module) instance.
 * @since 3.0.0
 * @category Structured Data
 * @param value The value to identify.
 * @returns `true` if `value` is a `WebAssembly.Module`; else, `false`.
 */
export function isWebAssemblyCompiledModule(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('WebAssembly.Module')(value);
}
