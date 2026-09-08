// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js. Copyright Joyent, Inc. and other Node contributors.

import { assert } from '@openinf/assert';
import { curlyQuote } from '@openinf/util-text';

import { NodeTypeError } from '../abstractions/node-type-error';

/**
 * Thrown in case a required argument of an API was not passed.
 *
 * This is only used for strict compliance with the API specification (which in
 * some cases may accept `func(undefined)` but not `func()`). In most native
 * Node.js APIs, `func(undefined)` and `func()` are treated identically, and the
 * `InvalidArgTypeError` error code may be used instead.
 * @see https://nodejs.org/api/errors.html#ERR_MISSING_ARGS
 */
export class MissingArgsError extends NodeTypeError {
  /** @param args The names of the missing arguments. */
  public constructor(...args: string[]) {
    assert(args.length > 0, 'At least one argument needs to be specified');
    let msg = 'The ';
    const len = args.length;
    const wrap = (a: string): string => curlyQuote(a);

    args = args.map((value: string | string[]): string =>
      Array.isArray(value)
        ? [...value].map(wrap).join(' or ')
        : wrap(String(value))
    );

    switch (len) {
      case 1:
        msg += `${args[0]} argument`;
        break;
      case 2:
        msg += `${args[0]} and ${args[1]} arguments`;
        break;
      default:
        msg += args.slice(0, len - 1).join(', ');
        msg += `, and ${args[len - 1]} arguments`;
        break;
    }

    super('ERR_MISSING_ARGS', `${msg} must be specified`);
    this.name = 'MissingArgsError';
  }
}
