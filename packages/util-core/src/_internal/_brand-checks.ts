// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { _typedArrayName } from './_typed-array-name';

type Predicate = (value: unknown) => boolean;

const { apply } = Reflect;
const { getOwnPropertyDescriptor } = Object;

// Capture trusted intrinsics once. Never call methods obtained from the input:
// a subclass can override them, and a getter can execute arbitrary code.
function receiverCheck(
  prototype: object,
  key: PropertyKey,
  kind: 'value' | 'get' = 'value'
): Predicate {
  const method = getOwnPropertyDescriptor(prototype, key)?.[kind] as (
    this: unknown
  ) => unknown;
  return (value) => {
    if (
      value === null ||
      (typeof value !== 'object' && typeof value !== 'function')
    ) {
      return false;
    }
    try {
      apply(method, value, []);
      return true;
    } catch {
      return false;
    }
  };
}

const regExpSource = receiverCheck(RegExp.prototype, 'source', 'get');
const regExpPrototype = RegExp.prototype;
const errorPrototype = Error.prototype;
const { toStringTag } = Symbol;
// oxlint-disable-next-line typescript/unbound-method -- invoked with captured Reflect.apply.
const objectToString = Object.prototype.toString;
// oxlint-disable-next-line typescript/unbound-method -- invoked with captured Reflect.apply.
const isPrototypeOf = Object.prototype.isPrototypeOf;
const errorIsError = (Error as ErrorConstructor & { isError?: Predicate })
  .isError;
const moduleExports = (
  globalThis as unknown as {
    WebAssembly?: { Module: { exports(this: void, value: unknown): unknown } };
  }
).WebAssembly?.Module.exports;

/**
 * Non-mutating brand checks available through standard JavaScript intrinsics.
 * Missing entries deliberately use the tag fallback, not a pretend slot test.
 * @private
 */
export const _brandChecks: ReadonlyMap<string, Predicate> = new Map([
  ['ArrayBuffer', receiverCheck(ArrayBuffer.prototype, 'byteLength', 'get')],
  ['BigInt', receiverCheck(BigInt.prototype, 'valueOf')],
  ['Boolean', receiverCheck(Boolean.prototype, 'valueOf')],
  // The buffer getter still succeeds when the view is detached or out of bounds.
  ['DataView', receiverCheck(DataView.prototype, 'buffer', 'get')],
  ['Date', receiverCheck(Date.prototype, 'getTime')],
  ['Map', receiverCheck(Map.prototype, 'has')],
  ['Number', receiverCheck(Number.prototype, 'valueOf')],
  // The source getter specially accepts its own prototype, which has no slots.
  ['RegExp', (value) => value !== regExpPrototype && regExpSource(value)],
  ['Set', receiverCheck(Set.prototype, 'has')],
  [
    'SharedArrayBuffer',
    typeof SharedArrayBuffer === 'undefined'
      ? () => false
      : receiverCheck(SharedArrayBuffer.prototype, 'byteLength', 'get'),
  ],
  ['String', receiverCheck(String.prototype, 'valueOf')],
  ['Symbol', receiverCheck(Symbol.prototype, 'valueOf')],
  ['WeakMap', receiverCheck(WeakMap.prototype, 'has')],
  ['WeakSet', receiverCheck(WeakSet.prototype, 'has')],
  [
    'Error',
    errorIsError ??
      ((value) => {
        try {
          // Like SES's error-like check, recognize local error ancestry even
          // with a custom tag. The legacy tag covers other realms. Neither
          // branch is proof against forged prototypes or proxy traps.
          return (
            value !== null &&
            typeof value === 'object' &&
            (apply(isPrototypeOf, errorPrototype, [value]) ||
              (!(toStringTag in value) &&
                apply(objectToString, value, []) === '[object Error]'))
          );
        } catch {
          return false;
        }
      }),
  ],
  [
    'WebAssembly.Module',
    (value) => {
      if (moduleExports === undefined) return false;
      try {
        moduleExports(value);
        return true;
      } catch {
        return false;
      }
    },
  ],
  ...[
    'BigInt64Array',
    'BigUint64Array',
    'Float16Array',
    'Float32Array',
    'Float64Array',
    'Int8Array',
    'Int16Array',
    'Int32Array',
    'Uint8Array',
    'Uint8ClampedArray',
    'Uint16Array',
    'Uint32Array',
  ].map((name): [string, Predicate] => [
    name,
    (value) => _typedArrayName(value) === name,
  ]),
]);
