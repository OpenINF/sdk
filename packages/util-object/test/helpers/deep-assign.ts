// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { deepAssign } from '../../src/helpers/deep-assign';

describe(deepAssign.name, () => {
  it('should shallowly assign top-level properties', () => {
    assert.deepStrictEqual(deepAssign({ a: 1 }, { b: 2 }), { a: 1, b: 2 });
  });

  it('should recursively merge nested objects', () => {
    const target = { a: { x: 1 } };
    const result = deepAssign(target, { a: { y: 2 } });
    assert.deepStrictEqual(result, { a: { x: 1, y: 2 } });
  });

  it('should mutate and return the target object', () => {
    const target = { a: 1 };
    assert.strictEqual(deepAssign(target, { b: 2 }), target);
  });

  it('should not copy inherited properties from sources', () => {
    const proto = { inherited: 'nope' };
    const src = Object.create(proto) as Record<string, unknown>;
    src['own'] = 'yes';
    assert.deepStrictEqual(deepAssign({}, src), { own: 'yes' });
  });

  it('should copy every path to a shared object', () => {
    const shared = { child: { value: 1 } };
    const result = deepAssign({}, { first: shared, second: shared });

    assert.deepStrictEqual(result, {
      first: { child: { value: 1 } },
      second: { child: { value: 1 } },
    });
    assert.strictEqual(result.first, result.second);
  });

  it('should preserve a circular object', () => {
    const source: Record<string, unknown> = {};
    source['self'] = source;

    const result = deepAssign({}, source);

    assert.strictEqual(result['self'], result);
  });

  it('should preserve a shared array at sibling paths', () => {
    const shared = [{ value: 1 }];
    const result = deepAssign({}, { first: shared, second: shared });

    assert.strictEqual(result.first, result.second);
    assert.notStrictEqual(result.first, shared);
  });

  it('should merge a shared source into each object the target holds', () => {
    const shared = { added: 1 };
    const result = deepAssign(
      { first: { keepFirst: 1 }, second: { keepSecond: 2 } },
      { first: shared, second: shared }
    );

    assert.deepStrictEqual(result, {
      first: { keepFirst: 1, added: 1 },
      second: { keepSecond: 2, added: 1 },
    });
    assert.notStrictEqual(result.first, result.second);
  });

  it('should keep one identity for an object reached through an array', () => {
    const shared = { value: 1 };
    const result = deepAssign({}, { object: shared, list: [shared] });

    assert.strictEqual(result.list[0], result.object);
    assert.notStrictEqual(result.object, shared);
  });

  it('should close a cycle that runs through an array', () => {
    const source: Record<string, unknown> = {};
    source['list'] = [source];

    const result = deepAssign({}, source);

    assert.strictEqual((result['list'] as unknown[])[0], result);
  });

  it('should close a cycle on each object the target already holds', () => {
    const shared: Record<string, unknown> = {};
    shared['self'] = shared;

    const result = deepAssign(
      { second: { keep: true } } as Record<string, unknown>,
      { first: shared, second: shared }
    );
    const first = result['first'] as Record<string, unknown>;
    const second = result['second'] as Record<string, unknown>;

    // Two objects stand for one source here, because what the target already
    // held at `second` is merged into rather than replaced. Each one's cycle
    // closes on itself rather than on the other.
    assert.notStrictEqual(first, second);
    assert.strictEqual(first['self'], first);
    assert.strictEqual(second['self'], second);
    assert.strictEqual(second['keep'], true);
  });

  it('should reuse the first object where a later path keeps nothing', () => {
    const shared: Record<string, unknown> = {};
    shared['self'] = shared;

    const result = deepAssign(
      { first: { keep: true } } as Record<string, unknown>,
      { first: shared, second: shared }
    );
    const first = result['first'] as Record<string, unknown>;

    // `second` has nothing of its own to keep, so the source stays one object.
    assert.strictEqual(result['second'], first);
    assert.strictEqual(first['self'], first);
    assert.strictEqual(first['keep'], true);
  });

  it('should terminate when target and source are both circular', () => {
    const target: Record<string, unknown> = {};
    target['self'] = target;
    const source: Record<string, unknown> = { added: 1 };
    source['self'] = source;

    const result = deepAssign(target, source);

    assert.strictEqual(result, target);
    assert.strictEqual(result['self'], target);
    assert.strictEqual(result['added'], 1);
  });
});
