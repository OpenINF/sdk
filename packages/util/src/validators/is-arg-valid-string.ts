// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isString } from '@openinf/util-core';
import { InvalidArgTypeError } from '@openinf/util-errors';

import { assertValue } from '../helpers/assert-value';

export function isArgValidString(value: unknown, argName: string): void {
  assertValue(isString, argName);
  if (!isString(value)) throw new InvalidArgTypeError(argName, 'string', value);
}
