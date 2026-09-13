// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '@openinf/util-core';

import type { PropertyDescriptor } from '../types';

/**
 * Detects a valid accessor property descriptor.
 * @since 3.0.0
 * @category Fundamental Objects
 * @param value The value to identify.
 * @returns `true` if `value` describes an accessor property; else, `false`.
 */
export function isAccessorDescriptor(
  value: unknown
): value is PropertyDescriptor {
  if (
    (typeof value !== 'object' || value === null) &&
    typeof value !== 'function'
  ) {
    return false;
  }

  const descriptor = value as Record<PropertyKey, unknown>;
  if (
    !('get' in descriptor || 'set' in descriptor) ||
    'value' in descriptor ||
    'writable' in descriptor
  ) {
    return false;
  }

  return (
    (!('get' in descriptor) ||
      descriptor['get'] === undefined ||
      typeof descriptor['get'] === 'function') &&
    (!('set' in descriptor) ||
      descriptor['set'] === undefined ||
      typeof descriptor['set'] === 'function') &&
    (!('enumerable' in descriptor) ||
      typeof descriptor['enumerable'] === 'boolean') &&
    (!('configurable' in descriptor) ||
      typeof descriptor['configurable'] === 'boolean')
  );
}
(isAccessorDescriptor as Guard).expectation =
  'be a valid accessor property descriptor';
