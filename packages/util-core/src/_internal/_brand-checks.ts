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

// The Node.js 22 line has no Error.isError, but its util.types.isNativeError
// asks V8 the same question about [[ErrorData]], so a supported Node.js answers
// alike on every line. process.getBuiltinModule reaches it without importing a
// host module, and anywhere else, this is undefined.
const hostIsNativeError = ((): Predicate | undefined => {
  try {
    const host = globalThis as unknown as {
      process?: {
        getBuiltinModule?(
          id: string
        ): { types?: { isNativeError?: Predicate } } | undefined;
      };
    };
    return host.process?.getBuiltinModule?.('node:util')?.types?.isNativeError;
  } catch {
    return undefined;
  }
})();
const moduleExports = (
  globalThis as unknown as {
    WebAssembly?: { Module: { exports(this: void, value: unknown): unknown } };
  }
).WebAssembly?.Module.exports;

// Temporal, finished for ES2027. Every one of its classes keeps its own
// internal slots, and every one has a getter on its prototype that throws
// without them, so one captured getter tells each class from the others and
// from an impostor. Where the host has no Temporal, each check says false: a
// value of a type the runtime does not have cannot be one.
const temporalObject = (
  globalThis as unknown as {
    Temporal?: Record<string, { prototype: object } | undefined>;
  }
).Temporal;

function temporalCheck(name: string, key: string): [string, Predicate] {
  const constructor = temporalObject?.[name];
  return [
    `Temporal.${name}`,
    constructor === undefined
      ? () => false
      : receiverCheck(constructor.prototype, key, 'get'),
  ];
}

// Section 26, Managing Memory, and the resource management of 27.3 and 27.4.
// Each probe is chosen for leaving the value alone: deref reports a WeakRef's
// target without clearing it, unregister with a symbol nothing registered
// returns false and removes nothing, and the disposed getters dispose nothing.
const unregister = (
  globalThis as { FinalizationRegistry?: { prototype: object } }
).FinalizationRegistry
  ? (getOwnPropertyDescriptor(FinalizationRegistry.prototype, 'unregister')
      ?.value as (this: unknown, token: symbol) => boolean)
  : undefined;

const isFinalizationRegistry: Predicate = (value) => {
  if (unregister === undefined) return false;
  try {
    apply(unregister, value, [Symbol('unregistered')]);
    return true;
  } catch {
    return false;
  }
};

function optionalCheck(
  constructor: { prototype: object } | undefined,
  key: PropertyKey,
  kind: 'value' | 'get' = 'value'
): Predicate {
  return constructor === undefined
    ? () => false
    : receiverCheck(constructor.prototype, key, kind);
}

const globals = globalThis as unknown as Record<
  string,
  { prototype: object } | undefined
>;

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
      hostIsNativeError ??
      ((value) => {
        try {
          if (value === null || typeof value !== 'object') return false;
          // With no tag in the way, section 20.1.3.6 reports Error only for an
          // object with [[ErrorData]], across realms, which is Error.isError's
          // question. Only a proxy trap can forge it.
          if (!(toStringTag in value)) {
            return apply(objectToString, value, []) === '[object Error]';
          }
          // A tag hides that classification. Like SES's error-like check, fall
          // back to local error ancestry, which a forged prototype can fool.
          return apply(isPrototypeOf, errorPrototype, [value]);
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
  temporalCheck('Instant', 'epochNanoseconds'),
  temporalCheck('ZonedDateTime', 'timeZoneId'),
  temporalCheck('PlainDate', 'day'),
  temporalCheck('PlainTime', 'hour'),
  temporalCheck('PlainDateTime', 'day'),
  temporalCheck('PlainYearMonth', 'monthCode'),
  temporalCheck('PlainMonthDay', 'monthCode'),
  temporalCheck('Duration', 'sign'),
  ['FinalizationRegistry', isFinalizationRegistry],
  ['WeakRef', optionalCheck(globals['WeakRef'], 'deref')],
  [
    'DisposableStack',
    optionalCheck(globals['DisposableStack'], 'disposed', 'get'),
  ],
  [
    'AsyncDisposableStack',
    optionalCheck(globals['AsyncDisposableStack'], 'disposed', 'get'),
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
