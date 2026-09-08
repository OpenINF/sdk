// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Deno.
// https://github.com/denoland/deno_std/blob/main/node/_errors.ts

import { inspect } from 'node:util';

import { assert } from '@openinf/assert';
import { curlyQuote } from '@openinf/util-text';

import { _addNumericalSeparator } from '../_internal/_add-numerical-separator';
import { NodeRangeError } from '../abstractions/node-range-error';

/**
 * Thrown in case a given value is out of the accepted range.
 * @see https://nodejs.org/api/errors.html#ERR_OUT_OF_RANGE
 */
export class OutOfRangeError extends NodeRangeError {
  public constructor(
    str: string,
    range: string,
    input: unknown,
    replaceDefaultBoolean: boolean = false
  ) {
    assert(!!range, `Missing ${curlyQuote('range')} argument`);
    let msg = replaceDefaultBoolean
      ? str
      : `The value of ${curlyQuote(str)} is out of range.`;
    let received;
    if (
      typeof input === 'number' &&
      Number.isInteger(input) &&
      Math.abs(input) > 2 ** 32
    ) {
      received = _addNumericalSeparator(String(input));
    } else if (typeof input === 'bigint') {
      received = String(input);
      if (input > 2n ** 32n || input < -(2n ** 32n)) {
        received = _addNumericalSeparator(received);
      }
      received += 'n';
    } else {
      received = inspect(input);
    }
    msg += ` It must be ${range}. Received ${received}`;

    super('ERR_OUT_OF_RANGE', msg);
    // NodeRangeError's constructor sets `this.name` to the generic
    // 'RangeError'; override it here to match every other exception in this
    // package, which reports its own specific class name.
    this.name = 'OutOfRangeError';
  }
}
