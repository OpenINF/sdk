// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { isNullish, isString } from '@openinf/util-core';
import { hasOwn } from '@openinf/util-object';

/**
 * Returns a human-readable string representation of `token`.
 * @param token The value to stringify.
 * @returns The string representation.
 */
export function stringify(token: unknown): string {
  if (isString(token)) {
    return token;
  }

  if (isNullish(token)) {
    return String(token);
  }

  const record = token as Record<string, unknown>;

  if (hasOwn(record, 'overriddenName')) {
    return String(record['overriddenName']);
  }

  if (hasOwn(record, 'name') && typeof record['name'] === 'string') {
    return record['name'];
  }

  // The named-property checks above have already failed, so defer to whatever
  // the value stringifies to. That is useful for anything with a custom
  // toString (Date, RegExp, Error, class instances) and degrades to
  // '[object Object]' only for plain objects, which is the intended fallback.
  // oxlint-disable-next-line typescript/no-base-to-string -- deliberate last-resort fallback, see above.
  const res = String(token);
  const newLineIndex = res.indexOf('\n');
  return newLineIndex === -1 ? res : res.substring(0, newLineIndex);
}
