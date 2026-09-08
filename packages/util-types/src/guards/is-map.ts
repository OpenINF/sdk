// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { isObjectLike } from '@openinf/util-object';

import { _tagTester } from '../_internal/_tag-tester';

// oxlint-disable-next-line typescript/unbound-method -- intentionally unbound; rebound below via .call().
const mapHas: ((key: unknown) => boolean) | undefined = Map.prototype.has;

/**
 * Detects whether `value` is classified as a
 * [`Map`](https://mdn.io/Global_Objects/Map).
 * @since 3.0.0
 * @category Keyed Collections
 * @param value The value to identify.
 * @returns `true` if `value` is a `Map`; else, `false`.
 */
export function isMap(value: unknown): boolean {
  if (isObjectLike(value) && _tagTester('Map')(value)) {
    try {
      mapHas?.call(value, undefined);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}
