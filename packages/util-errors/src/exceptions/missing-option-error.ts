// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js. Copyright Joyent, Inc. and other Node contributors.

import { assert } from '@openinf/assert';
import { curlyQuote } from '@openinf/util-text';

import { NodeTypeError } from '../abstractions/node-type-error';

/**
 * For APIs that accept options objects, some options might be mandatory. This
 * error is thrown if a required option is missing.
 * @see https://nodejs.org/api/errors.html#ERR_MISSING_OPTION
 */
export class MissingOptionError extends NodeTypeError {
  /** @param optName The name of the missing option. */
  public constructor(optName: string) {
    assert(
      typeof optName === 'string',
      `The ${curlyQuote('optName')} argument must be of type ` +
        curlyQuote('string')
    );
    super(
      'ERR_MISSING_OPTION',
      `${curlyQuote(optName)} is a missing option that is required`
    );
    this.name = 'MissingOptionError';
  }
}
