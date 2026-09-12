// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from jQuery

import { types as nodeTypes } from 'node:util';

import { isObject } from '@openinf/util-core';

/**
 * Determines the internal JavaScript [[Class]] of `obj`.
 * @param obj The value to query.
 * @returns The lowercased type name of `obj`.
 */
export function type(obj: unknown): string {
  if (obj === null) {
    return 'null';
  }
  if (obj === undefined) {
    return 'undefined';
  }
  if (!isObject(obj) && typeof obj !== 'function') {
    return typeof obj;
  }
  if (typeof obj === 'function') return 'function';
  if (Array.isArray(obj)) return 'array';
  if (nodeTypes.isBooleanObject(obj)) return 'boolean';
  if (nodeTypes.isNumberObject(obj)) return 'number';
  if (nodeTypes.isStringObject(obj)) return 'string';
  if (nodeTypes.isSymbolObject(obj)) return 'symbol';
  if (nodeTypes.isDate(obj)) return 'date';
  if (nodeTypes.isRegExp(obj)) return 'regexp';
  if (nodeTypes.isNativeError(obj)) return 'error';
  return 'object';
}
