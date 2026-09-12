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

interface DecoratedProperty {
  validators: ValidatorInfo[];
  values: WeakMap<object, unknown>;
}

const decoratedProperties = new WeakMap<
  object,
  Map<PropertyKey, DecoratedProperty>
>();

function inheritedValidators(
  target: object,
  propertyKey: PropertyKey
): readonly ValidatorInfo[] {
  let ancestor = Object.getPrototypeOf(target) as object | null;
  while (ancestor !== null) {
    const property = decoratedProperties.get(ancestor)?.get(propertyKey);
    if (property !== undefined) {
      return property.validators;
    }
    ancestor = Object.getPrototypeOf(ancestor) as object | null;
  }
  return [];
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
    const objectTarget = target as object;

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

    let properties = decoratedProperties.get(objectTarget);
    if (properties === undefined) {
      properties = new Map<PropertyKey, DecoratedProperty>();
      decoratedProperties.set(objectTarget, properties);
    }

    let property = properties.get(propertyKey);

    // If this is the first decorator for the property, we need to create the
    // validators array and the new getter/setter.
    if (property === undefined) {
      const newProperty: DecoratedProperty = {
        validators: [...inheritedValidators(objectTarget, propertyKey)],
        values: new WeakMap<object, unknown>(),
      };
      property = newProperty;
      properties.set(propertyKey, newProperty);
      Object.defineProperty(target, propertyKey, {
        get(this: object) {
          return newProperty.values.get(this);
        },
        set(this: object, value: unknown) {
          for (const info of newProperty.validators) {
            assertValue(info.validator, value, info.name, info.expectation);
          }
          newProperty.values.set(this, value);
        },
      });
    }

    // Push the validator defined.
    property.validators.push({
      validator,
      name: resolvedName,
      expectation,
    });
  };
}
