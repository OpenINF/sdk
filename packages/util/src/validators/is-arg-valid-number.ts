// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isNumber, isString } from '@openinf/util-core';
import { InvalidArgTypeError } from '@openinf/util-errors';

import { assertValue } from '../helpers/assert-value';

export function isArgValidNumber(value: unknown, argName: string): void {
  assertValue(isString, argName);
  if (!isNumber(value)) throw new InvalidArgTypeError(argName, 'number', value);
}
