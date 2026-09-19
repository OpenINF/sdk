// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { canBeHeldWeakly } from '../../src/guards/can-be-held-weakly';

describe(canBeHeldWeakly.name, () => {
  it('should accept every kind of object', () => {
    assert.strictEqual(canBeHeldWeakly({}), true, 'a plain object');
    assert.strictEqual(canBeHeldWeakly([]), true, 'an array');
    assert.strictEqual(
      canBeHeldWeakly(() => {}),
      true,
      'a function'
    );
    assert.strictEqual(
      canBeHeldWeakly(Object.create(null)),
      true,
      'a null-prototype object'
    );
  });

  it('should accept a symbol the global registry does not hold', () => {
    assert.strictEqual(canBeHeldWeakly(Symbol('unregistered')), true, 'unique');
    assert.strictEqual(
      canBeHeldWeakly(Symbol()),
      true,
      'without a description'
    );
    assert.strictEqual(
      canBeHeldWeakly(Symbol.iterator),
      true,
      'a well-known symbol, which is not registered'
    );
  });

  it('should reject a registered symbol, which outlives collection', () => {
    assert.strictEqual(canBeHeldWeakly(Symbol.for('registered')), false);
  });

  it('should reject every other primitive', () => {
    assert.strictEqual(canBeHeldWeakly('a string'), false, 'string');
    assert.strictEqual(canBeHeldWeakly(42), false, 'number');
    assert.strictEqual(canBeHeldWeakly(42n), false, 'bigint');
    assert.strictEqual(canBeHeldWeakly(true), false, 'boolean');
    assert.strictEqual(canBeHeldWeakly(null), false, 'null');
    assert.strictEqual(canBeHeldWeakly(undefined), false, 'undefined');
  });

  it('should agree with what the weak collections actually accept', () => {
    const values: unknown[] = [
      {},
      [],
      () => {},
      Symbol('unregistered'),
      Symbol.iterator,
      Symbol.for('registered'),
      'a string',
      42,
      null,
      undefined,
    ];

    for (const value of values) {
      let accepted: boolean;
      try {
        new WeakRef(value as object);
        accepted = true;
      } catch {
        accepted = false;
      }
      assert.strictEqual(
        canBeHeldWeakly(value),
        accepted,
        `WeakRef and the guard disagree about ${String(value)}`
      );
    }
  });
});
