// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

// Invokes the decorator factory's returned PropertyDecorator function
// directly on plain objects, exactly as TypeScript's own `__decorate` helper
// (or a native decorator) would -- this sidesteps a compiler-emission
// footgun where, with useDefineForClassFields + target: esnext, a decorated
// instance field's own initializer shadows the decorator's prototype
// accessor on every `new` call.

import { Assert } from '../../src/assertions/assert-decorator';

/** Defined locally so these tests do not reach into another package. */
const isNumber = (value: unknown): value is number => typeof value === 'number';
// assertValue reads `.expectation` to build its message, as real guards carry.
(isNumber as unknown as { expectation: string }).expectation = 'be a number';

type AnyRecord = Record<PropertyKey, any>;

describe(Assert.name, () => {
  it('should install a getter/setter that validates on assignment', () => {
    const target: AnyRecord = {};
    Assert(isNumber)(target, 'value');

    assert.doesNotThrow(() => (target['value'] = 5));
    assert.strictEqual(target['value'], 5);
  });

  it('should throw when the assigned value fails the validator', () => {
    const target: AnyRecord = {};
    Assert(isNumber)(target, 'value');

    assert.throws(() => (target['value'] = 'nope'));
  });

  it("should derive the name from the target's constructor and property key by default", () => {
    class Foo {}
    Assert(isNumber)(Foo.prototype as AnyRecord, 'value');
    const instance = new Foo() as AnyRecord;

    assert.throws(() => (instance['value'] = 'nope'), /.Foo#value./);
  });

  it('should use a custom name when provided', () => {
    const target: AnyRecord = {};
    Assert(isNumber, 'custom name')(target, 'value');

    assert.throws(() => (target['value'] = 'nope'), /.custom name./);
  });

  it('should derive the name from a function target for static properties', () => {
    function Foo(): void {
      /* no-op */
    }
    Assert(isNumber)(Foo as unknown as AnyRecord, 'staticValue');

    assert.throws(
      () => ((Foo as unknown as AnyRecord)['staticValue'] = 'nope'),
      /.Foo\.staticValue./
    );
  });

  it('should stack multiple validators on the same property', () => {
    const target: AnyRecord = {};
    const isPositive = (value: unknown): boolean => (value as number) > 0;
    Assert(isNumber)(target, 'value');
    Assert(isPositive)(target, 'value');

    assert.throws(() => (target['value'] = -1));
    assert.doesNotThrow(() => (target['value'] = 5));
    assert.strictEqual(target['value'], 5);
  });

  it('should isolate a subclass validator from its base class', () => {
    const isPositive = (value: unknown): boolean => (value as number) > 0;
    class Base {}
    class Child extends Base {}
    Assert(isNumber)(Base.prototype, 'value');
    Assert(isPositive)(Child.prototype, 'value');

    const base = new Base() as AnyRecord;
    const child = new Child() as AnyRecord;
    assert.doesNotThrow(() => (base['value'] = -1));
    assert.throws(() => (child['value'] = -1));
    assert.throws(() => (child['value'] = 'not a number'));
    assert.doesNotThrow(() => (child['value'] = 1));
  });

  it('should distinguish symbols with the same description', () => {
    const first = Symbol('value');
    const second = Symbol('value');
    const target: AnyRecord = {};
    Assert(isNumber)(target, first);
    Assert((value) => typeof value === 'string')(target, second);

    assert.doesNotThrow(() => (target[first] = 1));
    assert.doesNotThrow(() => (target[second] = 'two'));
    assert.strictEqual(target[first], 1);
    assert.strictEqual(target[second], 'two');
  });

  it('should not overwrite a string-derived backing property', () => {
    const target: AnyRecord = { _value: 'untouched' };
    Assert(isNumber)(target, 'value');
    target['value'] = 5;

    assert.strictEqual(target['value'], 5);
    assert.strictEqual(target['_value'], 'untouched');
  });
});
