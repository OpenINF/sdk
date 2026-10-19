// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { isNullish, isString } from '@openinf/util-core';
import { hasOwn } from '@openinf/util-object';

const { apply } = Reflect;
// oxlint-disable-next-line typescript/unbound-method -- invoked with captured Reflect.apply.
const objectToString = Object.prototype.toString;

/** Any line ending: CRLF, LF, or a lone CR. */
const LINE_BREAK = /\r\n|\n|\r/;

/**
 * Returns a human-readable string representation of `token`.
 * @category Text Processing
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
  // A value with no usable conversion, such as an object with a null
  // prototype or a boxed Symbol, makes `String` throw, so it is described by
  // its class instead.
  let res: string;
  try {
    // oxlint-disable-next-line typescript/no-base-to-string -- deliberate last-resort fallback, see above.
    res = String(token);
  } catch {
    res = apply(objectToString, token, []);
  }
  return res.split(LINE_BREAK, 1)[0] ?? '';
}
