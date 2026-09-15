// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  getObjectType,
  isObjectOfType,
  isObjectTypeName,
  isOfType,
  isPrimitiveTypeName,
  isTypedArrayName,
  objectTypeNames,
  typedArrayTypeNames,
} from '../src/types';

describe('isTypedArrayName', () => {
  it('should detect typed array type names', () => {
    assert.strictEqual(isTypedArrayName('Uint8Array'), true);
    assert.strictEqual(isTypedArrayName('Float64Array'), true);
  });

  it('should reject non typed array type names', () => {
    assert.strictEqual(isTypedArrayName('Array'), false);
    assert.strictEqual(isTypedArrayName('foo'), false);
  });

  it('should name every typed array constructor, Float16Array included', () => {
    assert.strictEqual(isTypedArrayName('Float16Array'), true);
    const constructors = typedArrayTypeNames.filter(
      (name) =>
        typeof (globalThis as Record<string, unknown>)[name] === 'function'
    );
    for (const name of constructors) {
      const TypedArray = (globalThis as Record<string, unknown>)[name] as new (
        length: number
      ) => object;
      assert.strictEqual(getObjectType(new TypedArray(1)), name);
    }
  });
});

describe('isObjectTypeName', () => {
  it('should detect object type names', () => {
    assert.strictEqual(isObjectTypeName('Array'), true);
    assert.strictEqual(isObjectTypeName('Date'), true);
  });

  it('should reject non object type names', () => {
    assert.strictEqual(isObjectTypeName('string'), false);
  });

  it('should not name objects the specification does not define', () => {
    for (const name of ['Observable', 'Buffer', 'HTMLElement', 'URL']) {
      assert.strictEqual(isObjectTypeName(name), false, name);
    }
  });
});

describe('isPrimitiveTypeName', () => {
  it('should detect primitive type names', () => {
    assert.strictEqual(isPrimitiveTypeName('string'), true);
    assert.strictEqual(isPrimitiveTypeName('undefined'), true);
  });

  it('should reject non primitive type names', () => {
    assert.strictEqual(isPrimitiveTypeName('Array'), false);
  });
});

describe('isOfType', () => {
  it('should create a guard for a typeof type', () => {
    const isStringPrimitive = isOfType<any>('string');
    assert.strictEqual(isStringPrimitive('foo'), true);
    assert.strictEqual(isStringPrimitive(1), false);
  });

  it('should not accept null, which no value has as its typeof', () => {
    // @ts-expect-error -- typeof null is 'object', so this guard could never pass.
    const isNullType = isOfType<any>('null');
    assert.strictEqual(isNullType(null), false);
  });
});

describe('getObjectType', () => {
  it('should return the object type name for known types', () => {
    assert.strictEqual(getObjectType([]), 'Array');
    assert.strictEqual(getObjectType(new Date()), 'Date');
    assert.strictEqual(getObjectType(/foo/), 'RegExp');
  });

  it('should return undefined for values that are not objects', () => {
    assert.strictEqual(getObjectType(42), undefined);
    assert.strictEqual(getObjectType('foo'), undefined);
    assert.strictEqual(getObjectType(null), undefined);
  });

  it('should report the tag of every object the specification defines here', () => {
    const cases: ReadonlyArray<readonly [unknown, string]> = [
      [
        (function () {
          // oxlint-disable-next-line prefer-rest-params -- an arguments object is the point.
          return arguments;
        })(),
        'Arguments',
      ],
      [() => {}, 'Function'],
      [new TypeError(), 'Error'],
      [new Boolean(false), 'Boolean'],
      [new Number(1), 'Number'],
      [new String(''), 'String'],
      [{}, 'Object'],
      [Object(Symbol()), 'Symbol'],
      [Object(1n), 'BigInt'],
      [Math, 'Math'],
      [''[Symbol.iterator](), 'String Iterator'],
      ['a'.matchAll(/a/g), 'RegExp String Iterator'],
      [[].values(), 'Array Iterator'],
      [new Map(), 'Map'],
      [new Map().keys(), 'Map Iterator'],
      [new Set(), 'Set'],
      [new Set().values(), 'Set Iterator'],
      [new WeakMap(), 'WeakMap'],
      [new WeakSet(), 'WeakSet'],
      [new ArrayBuffer(0), 'ArrayBuffer'],
      [new SharedArrayBuffer(0), 'SharedArrayBuffer'],
      [new DataView(new ArrayBuffer(0)), 'DataView'],
      [Atomics, 'Atomics'],
      [JSON, 'JSON'],
      [new WeakRef({}), 'WeakRef'],
      [new FinalizationRegistry(() => {}), 'FinalizationRegistry'],
      [Promise.resolve(), 'Promise'],
      [function* () {}, 'GeneratorFunction'],
      [async function* () {}, 'AsyncGeneratorFunction'],
      [(function* () {})(), 'Generator'],
      [(async function* () {})(), 'AsyncGenerator'],
      [async () => {}, 'AsyncFunction'],
      [Reflect, 'Reflect'],
    ];
    for (const [value, tag] of cases) {
      assert.strictEqual(getObjectType(value), tag, tag);
      assert.strictEqual(isObjectTypeName(tag), true, tag);
    }
  });

  it('should report the tags of objects added since ES2024 where they exist', () => {
    const optional: ReadonlyArray<readonly [string, () => unknown, string]> = [
      ['Iterator', () => [].values().map((x) => x), 'Iterator Helper'],
      ['DisposableStack', () => new DisposableStack(), 'DisposableStack'],
      [
        'AsyncDisposableStack',
        () => new AsyncDisposableStack(),
        'AsyncDisposableStack',
      ],
      ['Temporal', () => (globalThis as any).Temporal, 'Temporal'],
      ['Temporal', () => (globalThis as any).Temporal.Now, 'Temporal.Now'],
      [
        'Temporal',
        () => (globalThis as any).Temporal.Now.instant(),
        'Temporal.Instant',
      ],
      [
        'Temporal',
        () => (globalThis as any).Temporal.PlainDate.from('2026-09-15'),
        'Temporal.PlainDate',
      ],
    ];
    for (const [global, make, tag] of optional) {
      assert.strictEqual(isObjectTypeName(tag), true, tag);
      if (global in globalThis) {
        assert.strictEqual(getObjectType(make()), tag, tag);
      }
    }
  });

  it('should report a forged tag, since the tag is only a claim', () => {
    assert.strictEqual(getObjectType({ [Symbol.toStringTag]: 'Date' }), 'Date');
  });
});

describe('isObjectOfType', () => {
  it('should create a guard for a specific object type', () => {
    const isArrayType = isObjectOfType<unknown[]>('Array');
    assert.strictEqual(isArrayType([]), true);
    assert.strictEqual(isArrayType({}), false);
  });
});
