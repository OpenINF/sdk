// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { deepAssign } from './deep-assign';

/**
 * Creates an object that inherits from the `prototype` object. If a
 * `properties` object is given, its own enumerable string keyed properties
 * are assigned to the created object.
 * @since 3.0
 * @category Object
 * @param prototype The object to inherit from.
 * @param [properties] The properties to assign to the object.
 * @returns Returns the new object.
 */
export function create(
  prototype: null | undefined | Record<string, unknown>,
  properties: null | undefined | Record<string, unknown>
): Record<string, unknown> {
  const result = Object.create(prototype ?? null) as Record<string, unknown>;
  return properties ? deepAssign(result, properties) : result;
}
