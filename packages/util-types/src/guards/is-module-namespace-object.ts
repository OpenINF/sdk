// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isObjectLike } from '@openinf/util-object';

import { _tagTester } from '../_internal/_tag-tester';

/**
 * Detects whether `value` is classified as a `Module` namespace object.
 * @since 3.0.0
 * @category Other
 * @param value The value to identify.
 * @returns `true` if `value` is a `Module`; else, `false`.
 * @example
 * ```ts
 * import * as Module from './modules/module.js';
 * isModuleNamespaceObject(Module); // ↪ true
 * ```
 */
export function isModuleNamespaceObject(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('Module')(value);
}
