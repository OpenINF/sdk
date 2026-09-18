// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { _getPropertyDescriptor } from './_get-property-descriptor';

const { getOwnPropertyDescriptor, getPrototypeOf, hasOwn, isExtensible } =
  Object;
const { apply } = Reflect;
const { ownKeys } = Reflect;
const { isSafeInteger } = Number;
const { iterator, asyncIterator, toStringTag } = Symbol;
// oxlint-disable-next-line typescript/unbound-method -- invoked with captured Reflect.apply.
const functionToString = Function.prototype.toString;
// oxlint-disable-next-line typescript/unbound-method -- invoked with captured Reflect.apply.
const regExpExec = RegExp.prototype.exec;
// oxlint-disable-next-line typescript/unbound-method -- invoked with captured Reflect.apply.
const stringStartsWith = String.prototype.startsWith;
const comment = String.raw`\/\*[\s\S]*?\*\/`;
const gap = String.raw`(?:\s|${comment})+`;
const optionalGap = String.raw`(?:\s|${comment})*`;
const asyncGeneratorFunctionSource = new RegExp(
  String.raw`^async(?:${gap}function${optionalGap}\*|${optionalGap}\*)`
);
const generatorFunctionSource = new RegExp(
  String.raw`^(?:function${optionalGap})?\*`
);

function matches(expression: RegExp, value: string): boolean {
  return apply(regExpExec, expression, [value]) !== null;
}

function hasMethod(value: object, key: PropertyKey): boolean {
  const descriptor = _getPropertyDescriptor(value, key);
  return (
    descriptor !== undefined &&
    hasOwn(descriptor, 'value') &&
    typeof descriptor.value === 'function'
  );
}

function hasFunctionPrototypeTag(value: object, tag: string): boolean {
  const prototype = getPrototypeOf(value) as object | null;
  if (prototype === null) return false;
  const descriptor = _getPropertyDescriptor(prototype, toStringTag);
  return (
    descriptor !== undefined &&
    hasOwn(descriptor, 'value') &&
    descriptor.value === tag &&
    !descriptor.enumerable &&
    !descriptor.writable
  );
}

function hasAsyncPrefix(source: string): boolean {
  return apply(stringStartsWith, source, ['async']);
}

function hasFunctionKind(
  value: object,
  kind: 'async' | 'generator' | 'async-generator'
): boolean {
  if (typeof value !== 'function') return false;
  const tag =
    kind === 'async'
      ? 'AsyncFunction'
      : kind === 'generator'
        ? 'GeneratorFunction'
        : 'AsyncGeneratorFunction';
  if (!hasFunctionPrototypeTag(value, tag)) return false;
  const source = apply(functionToString, value, []);
  switch (kind) {
    case 'async':
      return (
        hasAsyncPrefix(source) && !matches(asyncGeneratorFunctionSource, source)
      );
    case 'generator':
      return matches(generatorFunctionSource, source);
    case 'async-generator':
      return matches(asyncGeneratorFunctionSource, source);
  }
}

function hasModulePrototype(value: object): boolean {
  const prototype = getPrototypeOf(value) as object | null;
  if (prototype === null) return true;

  // Bun exposes module namespaces through a null-rooted prototype carrying a
  // non-enumerable __esModule accessor. Validate that complete visible shape
  // instead of relying on a Bun global or engine-specific import.
  const keys = ownKeys(prototype);
  if (
    getPrototypeOf(prototype) !== null ||
    keys.length !== 1 ||
    keys[0] !== '__esModule'
  ) {
    return false;
  }
  const descriptor = getOwnPropertyDescriptor(prototype, '__esModule');
  return (
    descriptor !== undefined &&
    !hasOwn(descriptor, 'value') &&
    typeof descriptor.get === 'function' &&
    typeof descriptor.set === 'function' &&
    !descriptor.enumerable &&
    !descriptor.configurable
  );
}

function hasModuleExports(value: object): boolean {
  const keys = ownKeys(value);
  let index = 0;
  while (index < keys.length) {
    const key = keys[index];
    index += 1;
    if (key === toStringTag) continue;
    if (typeof key !== 'string') return false;
    const descriptor = getOwnPropertyDescriptor(value, key);
    if (
      descriptor === undefined ||
      !hasOwn(descriptor, 'value') ||
      !descriptor.enumerable ||
      !descriptor.writable ||
      descriptor.configurable
    ) {
      return false;
    }
  }
  return true;
}

/**
 * Supplements tag classification with non-invoking shape checks.
 * Shapes can be forged; these are heuristics, not internal-slot tests.
 * @private
 * @param name The expected built-in name.
 * @param value The object to inspect.
 * @returns Whether its shape is consistent with that built-in.
 */
export function _matchesBrandShape(name: string, value: object): boolean {
  switch (name) {
    case 'AsyncFunction':
      return hasFunctionKind(value, 'async');
    case 'AsyncGeneratorFunction':
      return hasFunctionKind(value, 'async-generator');
    case 'GeneratorFunction':
      return hasFunctionKind(value, 'generator');
    case 'Promise':
      return (
        typeof value === 'object' &&
        hasMethod(value, 'then') &&
        hasMethod(value, 'catch') &&
        hasMethod(value, 'finally')
      );
    case 'Generator':
    case 'AsyncGenerator':
      return (
        typeof value === 'object' &&
        hasMethod(value, 'next') &&
        hasMethod(value, 'throw') &&
        hasMethod(value, 'return') &&
        hasMethod(value, name === 'Generator' ? iterator : asyncIterator)
      );
    case 'Array Iterator':
    case 'Iterator Helper':
    case 'Map Iterator':
    case 'RegExp String Iterator':
    case 'Set Iterator':
    case 'String Iterator':
      return (
        typeof value === 'object' &&
        hasMethod(value, 'next') &&
        hasMethod(value, iterator)
      );
    case 'Arguments': {
      const length = getOwnPropertyDescriptor(value, 'length');
      const callee = getOwnPropertyDescriptor(value, 'callee');
      return (
        typeof value === 'object' &&
        length !== undefined &&
        hasOwn(length, 'value') &&
        typeof length.value === 'number' &&
        isSafeInteger(length.value) &&
        length.value >= 0 &&
        !length.enumerable &&
        callee !== undefined &&
        !callee.enumerable &&
        (hasOwn(callee, 'value')
          ? typeof callee.value === 'function'
          : typeof callee.get === 'function' &&
            typeof callee.set === 'function')
      );
    }
    case 'Module': {
      const tag = getOwnPropertyDescriptor(value, toStringTag);
      return (
        hasModulePrototype(value) &&
        !isExtensible(value) &&
        tag !== undefined &&
        hasOwn(tag, 'value') &&
        tag.value === 'Module' &&
        !tag.enumerable &&
        !tag.writable &&
        !tag.configurable &&
        hasModuleExports(value)
      );
    }
    default:
      return false;
  }
}
