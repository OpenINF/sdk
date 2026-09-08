// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { getTag as _getTag } from './_get-tag';

// Adapted from Underscore

/**
 * Internal function for creating a `toString`-based type tester.
 * @private
 * @param name The name of the type.
 * @returns The `tagTester` function.
 * @template T
 */
export function _tagTester(name: string): (value: unknown) => boolean {
  return function (value: unknown): boolean {
    return _getTag(value) === '[object ' + name + ']';
  };
}
