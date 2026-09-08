// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from jQuery

import { isObject } from '@openinf/util-core';

import { getTag } from '../_internal/_get-tag';

const class2type: Record<string, string> = {};

// Populate the class2type map
'Boolean Number String Function Array Date RegExp Object Error Symbol'
  .split(' ')
  .forEach((name) => {
    class2type[`[object ${name}]`] = name.toLowerCase();
  });

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
  return isObject(obj) || typeof obj === 'function'
    ? class2type[getTag(obj)] || 'object'
    : typeof obj;
}
