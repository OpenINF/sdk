// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { inspect as utilInspect } from 'node:util';

import { hasOwn } from '@openinf/util-object';
import { curlyQuote } from '@openinf/util-text';

import { getInspectedMaybeCapped as _getInspectedMaybeCapped } from './_get-inspected-maybe-capped';

/**
 * Renders the ". Received ..." clause appended to a type/value error message.
 * @param value The value that was actually received.
 * @returns The clause, beginning with ". Received".
 */
export function _getReceivedSubMsg(value: unknown): string {
  let msg = '';
  if (value == null) {
    msg += `. Received ${curlyQuote(String(value))}`;
  } else if (typeof value === 'function' && hasOwn(value, 'name')) {
    msg += `. Received function ${curlyQuote(value.name)}`;
  } else if (typeof value === 'object') {
    // At `depth: -1`, a nested object or array inspects as the placeholder
    // `[Object]` / `[Array]`, and the brackets read badly inside a message
    // that already quotes the value. Unwrap only that placeholder form:
    // slicing unconditionally would empty out `{}` and `[]`, and chop the
    // first and last character off a Date, RegExp, or Error.
    const inspected = utilInspect(value, { depth: -1, colors: false });
    const unwrapped = /^\[[^[\]]+\]$/.test(inspected)
      ? inspected.slice(1, -1)
      : inspected;
    // An Error inspects to its full stack trace; keep the message to one line.
    const newLineIndex = unwrapped.indexOf('\n');
    msg += `. Received ${curlyQuote(
      newLineIndex === -1 ? unwrapped : unwrapped.slice(0, newLineIndex)
    )}`;
  } else {
    msg +=
      `. Received type ${curlyQuote(typeof value)} ` +
      `(${_getInspectedMaybeCapped(value, 25)})`;
  }
  return msg;
}
