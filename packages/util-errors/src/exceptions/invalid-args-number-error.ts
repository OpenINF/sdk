// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js. Copyright Joyent, Inc. and other Node contributors.

import { assert } from '@openinf/assert';
import { curlyQuote } from '@openinf/util-text';

import { NodeTypeError } from '../abstractions/node-type-error';

/**
 * Thrown in case the number of arguments passed to a function is invalid.
 */
export class InvalidArgsNumberError extends NodeTypeError {
  /**
   * Creates an `InvalidArgsNumberError`.
   * @param funcName The name of the function in question.
   * @param expected The number of arguments expected to be passed.
   * @param value The actual number of arguments passed.
   */
  public constructor(funcName: string, expected: number, value: number) {
    assert(
      typeof funcName === 'string',
      `The ${curlyQuote('funcName')} argument must be of type ` +
        `${curlyQuote('string')}`
    );
    assert(
      typeof expected === 'number',
      `The ${curlyQuote('expected')} argument must be of type ` +
        `${curlyQuote('number')}`
    );
    assert(
      typeof value === 'number',
      `The ${curlyQuote('value')} argument must be of type ` +
        `${curlyQuote('number')}`
    );
    super(
      'ERR_INVALID_ARGS_NUMBER',
      `The number of arguments expected by the ${curlyQuote(funcName)} ` +
        `function is ${expected}, but ${value} were passed`
    );
    this.name = 'InvalidArgsNumberError';
  }
}
