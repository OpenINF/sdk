// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from TypeShield

import { isFunction } from '@openinf/util-core';
import type { Validator } from '@openinf/util-core';

import { assertValue } from './assert-value';

/**
 * Validation info from the decorator
 * @ignore
 */
interface ValidatorInfo {
  /**
   * The validator
   */
  validator: Validator | (() => Validator);

  /**
   * The name to use in the error
   */
  name: string;

  /**
   * The expectation to use in the error
   */
  expectation?: string | undefined;
}

interface NamedTarget {
  name: string;
  constructor: { name: string };
}

/**
 * A decorator factory that returns a decorator that turns a property into a
 * getter/setter with a setter that asserts the value set matches the validator.
 * @param validator The guard/validator to assert
 * @param name The name to use for the value. Defaults to the class+method name
 * @param expectation An expectation message to override the guard/validator
 * expectation.
 * @returns The decorator.
 */
export function Assert(
  validator: Validator | (() => Validator),
  name?: string,
  expectation?: string
): PropertyDecorator {
  // oxlint-disable-next-line typescript/no-wrapper-object-types -- PropertyDecorator's ambient signature requires `Object` here.
  return (target: Object, propertyKey: string | symbol) => {
    const targetRecord = target as unknown as Record<PropertyKey, unknown>;

    // Create the key for the private backing field by prefixing an underscore.
    const key = `_${propertyKey.toString()}`;

    // Create the key where the validators will be stored.
    const validatorsKey = `${key}_validators`;

    // If no name is provided, use the class name combined with the property
    // key. If the target is a function, this is a static property; otherwise,
    // it is an instance property.
    // https://mathiasbynens.be/notes/javascript-prototype-notation
    const resolvedName =
      name ??
      (isFunction(target)
        ? `${(target as unknown as NamedTarget).name}.${propertyKey.toString()}`
        : `${
            (target as unknown as NamedTarget).constructor.name
          }#${propertyKey.toString()}`);

    let validatorInfos = targetRecord[validatorsKey] as
      ValidatorInfo[] | undefined;

    // If this is the first decorator for the property, we need to create the
    // validators array and the new getter/setter.
    if (!validatorInfos) {
      validatorInfos = [];
      targetRecord[validatorsKey] = validatorInfos;
      Object.defineProperty(target, propertyKey, {
        get(this: Record<PropertyKey, unknown>) {
          return this[key];
        },
        set(this: Record<PropertyKey, unknown>, value: unknown) {
          for (const info of validatorInfos ?? []) {
            assertValue(info.validator, value, info.name, info.expectation);
          }
          this[key] = value;
        },
      });
    }

    // Push the validator defined.
    validatorInfos.push({
      validator,
      name: resolvedName,
      expectation,
    });
  };
}
