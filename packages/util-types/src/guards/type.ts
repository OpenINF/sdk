// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from jQuery

import { isObject } from '@openinf/util-core';

import { _tagTester } from '../_internal/_tag-tester';

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
  try {
    if (Array.isArray(obj)) return 'array';
  } catch {
    return 'object';
  }
  if (_tagTester('Boolean')(obj)) return 'boolean';
  if (_tagTester('Number')(obj)) return 'number';
  if (_tagTester('String')(obj)) return 'string';
  if (_tagTester('Symbol')(obj)) return 'symbol';
  if (_tagTester('Date')(obj)) return 'date';
  if (_tagTester('RegExp')(obj)) return 'regexp';
  if (_tagTester('Error')(obj)) return 'error';
  return 'object';
}
