// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { deepMerge } from '../../src/helpers/deep-merge';

describe(deepMerge.name, () => {
  it('should deep-merge nested objects, keeping unshared keys', () => {
    const result = deepMerge({ a: { x: 1 }, b: 3 }, { a: { y: 2 } });
    assert.deepStrictEqual(result, { a: { x: 1, y: 2 }, b: 3 });
  });

  it('should mutate and return the target object', () => {
    const target = { a: 1 };
    assert.strictEqual(deepMerge(target, { b: 2 }), target);
  });

  it('should replace arrays rather than merging their indexes', () => {
    const sourceArray = [9];
    const result = deepMerge({ values: [1, 2, 3] }, { values: sourceArray });

    assert.strictEqual(result['values'], sourceArray);
    assert.deepStrictEqual(result, { values: [9] });
  });

  it('should replace an array with an object rather than merging it', () => {
    const sourceObject = { value: 'source' };
    const result = deepMerge({ item: ['target'] }, { item: sourceObject });

    assert.strictEqual(result['item'], sourceObject);
  });

  it('should shallowly assign beyond the max depth', () => {
    const result = deepMerge(
      { a: { b: { c: 1 } } },
      { a: { b: { c: 2, d: 3 } } },
      0
    );
    assert.deepStrictEqual(result, { a: { b: { c: 2, d: 3 } } });
  });

  it('should filter unsafe keys beyond the max depth', () => {
    const nested = JSON.parse(
      '{"__proto__":{"polluted":true},"safe":"kept"}'
    ) as Record<string, unknown>;
    const result = deepMerge({ a: {} }, { a: nested }, 0);

    assert.deepStrictEqual(result, { a: { safe: 'kept' } });
    assert.strictEqual(Object.getPrototypeOf(result.a), Object.prototype);
  });

  it('should merge shared acyclic objects at each target path', () => {
    const shared = { value: 'kept' };
    const result = deepMerge({ a: {}, b: {} }, { a: shared, b: shared });

    assert.deepStrictEqual(result, {
      a: { value: 'kept' },
      b: { value: 'kept' },
    });
  });

  it('should throw when the source has a circular reference reachable via a shared key path', () => {
    const source: any = { a: {} };
    source.a.self = source;
    const target: any = { a: { self: {} } };

    assert.throws(
      () => deepMerge(target, source),
      /Source object has a circular reference\./
    );
  });

  it('should replace a Date or a Map the target holds rather than merge into it', () => {
    const when = new Date(5);
    const map = new Map([[2, 2]]);
    const result = deepMerge(
      { when: new Date(0), map: new Map([[1, 1]]) },
      { when, map }
    );

    assert.strictEqual(result['when'], when);
    assert.strictEqual(result['map'], map);
  });

  it('should merge each shared pair once while nothing has changed', () => {
    // Eight paths to one object at each of ten levels: queued along every
    // path, that is 8 ** 10 merges, all within the default depth.
    function ladder(leaf: Record<string, unknown>): Record<string, unknown> {
      let node = leaf;
      for (let level = 0; level < 10; level += 1) {
        const next: Record<string, unknown> = { level };
        for (let key = 0; key < 8; key += 1) next[`k${key}`] = node;
        node = next;
      }
      return node;
    }
    const target = ladder({ leaf: 'target', kept: true });
    const started = performance.now();
    deepMerge(target, ladder({ leaf: 'source' }));
    assert.ok(performance.now() - started < 1000);
    let node = target;
    for (let level = 9; level >= 0; level -= 1) {
      assert.strictEqual(node['level'], level);
      assert.strictEqual(node['k0'], node['k7']);
      node = node['k0'] as Record<string, unknown>;
    }
    assert.deepStrictEqual(node, { leaf: 'source', kept: true });
  });

  it('should merge a pair again when it is reached at another depth', () => {
    // At depth 1 the pair only queues its child, which changes nothing at
    // depth 2. Reached again at depth 2, the pair's child is past the limit
    // and is assigned over, which has to happen too.
    const source = { child: { deep: { x: 1 } } };
    const shared = { child: { deep: { x: 1, only: 'target' } } };
    deepMerge(
      { a: shared, b: { c: shared } },
      { a: source, b: { c: source } },
      2
    );
    assert.strictEqual(shared.child.deep, source.child.deep);
  });

  it('should read a getter again on a pair it has merged before', () => {
    let reads = 0;
    const source = {
      get value() {
        reads += 1;
        return reads;
      },
    };
    const shared = { value: 0 };
    deepMerge({ a: shared, b: shared }, { a: source, b: source });
    assert.strictEqual(reads, 2);
    assert.deepStrictEqual(shared, { value: 2 });
  });

  it('should read a getter below a pair it has merged before', () => {
    let reads = 0;
    const inner = {
      get value() {
        reads += 1;
        return reads;
      },
    };
    const source = { inner };
    const shared = { inner: { value: 0 } };
    deepMerge({ a: shared, b: shared }, { a: source, b: source });
    assert.strictEqual(reads, 2);
    assert.deepStrictEqual(shared.inner, { value: 2 });
  });

  it('should merge a pair again after a getter above it changed it', () => {
    const inner = { value: 0 };
    const source = {
      get inner() {
        inner.value += 1;
        return inner;
      },
    };
    const shared = { inner: { value: 0 } };
    deepMerge({ a: shared, b: shared }, { a: source, b: source });
    assert.deepStrictEqual(shared.inner, { value: 2 });
  });

  it('should merge a pair again when the target reads through a getter', () => {
    const children: Record<string, unknown>[] = [];
    const shared = {};
    Object.defineProperty(shared, 'child', {
      enumerable: true,
      get() {
        const child = {};
        children.push(child);
        return child;
      },
    });
    const source = { child: { x: 1 } };
    deepMerge({ a: shared, b: shared }, { a: source, b: source });
    assert.strictEqual(children.length, 2);
    for (const child of children) assert.deepStrictEqual(child, { x: 1 });
  });

  it('should merge a pair again when a target below it reads through a getter', () => {
    const children: Record<string, unknown>[] = [];
    const below = {};
    Object.defineProperty(below, 'child', {
      enumerable: true,
      get() {
        const child = {};
        children.push(child);
        return child;
      },
    });
    const shared = { below };
    const source = { below: { child: { x: 1 } } };
    deepMerge({ a: shared, b: shared }, { a: source, b: source });
    assert.strictEqual(children.length, 2);
    for (const child of children) assert.deepStrictEqual(child, { x: 1 });
  });

  it('should merge a pair again once something has changed since', () => {
    // `first` is merged into `shared`, then `second` overwrites it there,
    // then `first` comes round again and has to win, as the last write.
    const shared = { value: 0 };
    const first = { value: 1 };
    const result = deepMerge(
      { a: shared, b: shared, c: shared },
      { a: first, b: { value: 2 }, c: first }
    );
    assert.strictEqual(result['c'], shared);
    assert.deepStrictEqual(shared, { value: 1 });
  });

  it('should let a pair reached again win over one queued between', () => {
    const t = { child: { v: 0 } };
    const s1 = { child: { v: 1 } };
    const s2 = { child: { v: 2 } };

    deepMerge({ a: t, b: t, c: t }, { a: s1, b: s2, c: s1 });

    assert.strictEqual(t.child.v, 1);
  });

  it('should rerun a pair after the merge gives its target a getter', () => {
    let reads = 0;
    const withGetter = {
      get w(): Record<string, unknown> {
        reads += 1;
        return {};
      },
    };
    const t = {};
    const s0 = { z: 1 };
    const sA = { child: withGetter };
    const s1 = { child: { w: { x: 1 } } };

    deepMerge(
      { a: t, b: t, c: t, d: t, e: t },
      { a: s0, b: s0, c: sA, d: s1, e: s1 }
    );

    assert.strictEqual(reads, 2);
  });
});
