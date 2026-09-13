// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '@openinf/util-core';

import type { PropertyDescriptor } from '../types';

/**
 * Detects a valid data property descriptor.
 * @since 3.0.0
 * @category Fundamental Objects
 * @param value The value to identify.
 * @returns `true` if `value` describes a data property; else, `false`.
 */
export function isDataDescriptor(value: unknown): value is PropertyDescriptor {
  if (
    (typeof value !== 'object' || value === null) &&
    typeof value !== 'function'
  ) {
    return false;
  }

  const descriptor = value as Record<PropertyKey, unknown>;
  if (
    !('value' in descriptor || 'writable' in descriptor) ||
    'get' in descriptor ||
    'set' in descriptor
  ) {
    return false;
  }

  return (
    (!('writable' in descriptor) ||
      typeof descriptor['writable'] === 'boolean') &&
    (!('enumerable' in descriptor) ||
      typeof descriptor['enumerable'] === 'boolean') &&
    (!('configurable' in descriptor) ||
      typeof descriptor['configurable'] === 'boolean')
  );
}
(isDataDescriptor as Guard).expectation = 'be a valid data property descriptor';
