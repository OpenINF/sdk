// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isBoolean, isString } from '@openinf/util-core';
import { InvalidArgTypeError } from '@openinf/util-errors';

import { assertValue } from '../helpers/assert-value';

/**
 * Detects whether an argument is classified as a Boolean primitive or object.
 * @param value The actual argument value.
 * @param argName The name of the argument in question.
 */
export function isArgValidBoolean(value: unknown, argName: string): void {
  assertValue(isString, argName);
  if (!isBoolean(value))
    throw new InvalidArgTypeError(argName, 'boolean', value);
}
