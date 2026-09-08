// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js.

import { isFunction, isString } from '@openinf/util-core';
import { InvalidArgTypeError } from '@openinf/util-errors';

import { assertValue } from '../helpers/assert-value';

export interface ConformanceDescriptor {
  nullable: boolean;
  allowArray: boolean;
  allowFunction: boolean;
}

export function isArgValidObject(
  value: unknown,
  argName: string,
  { nullable, allowArray, allowFunction }: ConformanceDescriptor
): void {
  assertValue(isString, argName);

  if (
    (!nullable && value === null) ||
    (!allowArray && Array.isArray(value)) ||
    (typeof value !== 'object' && (!allowFunction || !isFunction(value)))
  ) {
    throw new InvalidArgTypeError(argName, 'Object', value);
  }
}
