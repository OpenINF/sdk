// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Validator } from '@openinf/util-core';

import { assertValue } from './assert-value';

function decoratedName<This, Value>(
  receiver: This,
  context: ClassAccessorDecoratorContext<This, Value>
): string {
  const propertyName = context.name.toString();
  const owner = context.static
    ? (receiver as { name?: unknown }).name
    : (receiver as { constructor?: { name?: unknown } }).constructor?.name;

  return typeof owner === 'string' && owner.length > 0
    ? `${owner}${context.static ? '.' : '#'}${propertyName}`
    : propertyName;
}

/**
 * Creates a standard decorator for an auto-accessor. Its initializer and every
 * later assignment must satisfy the provided validator.
 *
 * TypeScript consumers use standard decorators (`experimentalDecorators` is
 * `false`) and apply this to an `accessor` declaration. A field decorator
 * cannot intercept later assignments, while a legacy property decorator is
 * shadowed by class fields emitted with define semantics. Compile with a
 * `target` of `es2022` or lower, or to a runtime that can parse an `accessor`
 * field, which no released Node.js can.
 *
 * The initializer is validated along with every assignment, and an accessor
 * with no initializer is initialized to `undefined`, which is a value like any
 * other here. Either give it one the validator accepts, or let the validator
 * accept `undefined` and assert elsewhere that it was set -- a constructor
 * that assigns the accessor does not run early enough to stand in for an
 * initializer.
 * @param validator The guard or validator to assert.
 * @param name The name to use for the value. Defaults to the class and accessor
 * name.
 * @param expectation An expectation message to override the one attached to
 * the guard or validator.
 * @returns An auto-accessor decorator.
 * @example
 * ```ts
 * class Counter {
 *   @Assert((value) => typeof value === 'number')
 *   accessor value: unknown = 0;
 * }
 * ```
 */
export function Assert(
  validator: Validator | (() => Validator),
  name?: string,
  expectation?: string
): <This, Value>(
  target: ClassAccessorDecoratorTarget<This, Value>,
  context: ClassAccessorDecoratorContext<This, Value>
) => ClassAccessorDecoratorResult<This, Value> {
  return <This, Value>(
    target: ClassAccessorDecoratorTarget<This, Value>,
    context: ClassAccessorDecoratorContext<This, Value>
  ): ClassAccessorDecoratorResult<This, Value> => {
    const validate = (receiver: This, value: Value): void => {
      assertValue(
        validator,
        value,
        name ?? decoratedName(receiver, context),
        expectation
      );
    };

    return {
      init(this: This, value: Value): Value {
        validate(this, value);
        return value;
      },
      set(this: This, value: Value): void {
        validate(this, value);
        target.set.call(this, value);
      },
    };
  };
}
