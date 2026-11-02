// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { runInNewContext } from 'node:vm';

import { deepAssign } from '../../src/helpers/deep-assign';
import { deepMixin } from '../../src/helpers/deep-mixin';
import { mixin } from '../../src/helpers/mixin';

for (const merge of [mixin, deepAssign, deepMixin]) {
  describe(`${merge.name} source precedence`, () => {
    it('should apply a repeated source at its final position', () => {
      const source = { value: 1 };
      assert.deepStrictEqual(merge({}, source, { value: 2 }, source), {
        value: 1,
      });
    });
  });
}

for (const merge of [deepAssign, deepMixin]) {
  describe(`${merge.name} graph isolation`, () => {
    it('should not merge into objects inherited by the target', () => {
      const inherited = { options: { shared: true } };
      const target = Object.create(inherited) as Record<string, unknown>;

      const result = merge(target, { options: { own: true } });

      assert.deepStrictEqual(inherited, { options: { shared: true } });
      assert.deepStrictEqual(result.options, { own: true });
      assert.notStrictEqual(result.options, inherited.options);
      assert.strictEqual(Object.getPrototypeOf(result), inherited);
    });

    it('should not merge into inherited built-in functions', () => {
      // Capture the descriptor so even a failing regression leaves no change
      // to a shared built-in for the other tests in this process.
      const key = '__mergeGraphTest__';
      const descriptor = Object.getOwnPropertyDescriptor(
        Object.prototype.toString,
        key
      );
      try {
        const source = JSON.parse(
          '{"toString":{"__mergeGraphTest__":true}}'
        ) as Record<string, unknown>;
        const result = merge({}, source);

        assert.deepStrictEqual(
          Object.getOwnPropertyDescriptor(Object.prototype.toString, key),
          descriptor
        );
        assert.deepStrictEqual(result['toString'], {
          __mergeGraphTest__: true,
        });
      } finally {
        if (descriptor) {
          Object.defineProperty(Object.prototype.toString, key, descriptor);
        } else {
          Reflect.deleteProperty(Object.prototype.toString, key);
        }
      }
    });

    it('should close array cycles on each existing destination', () => {
      const shared: Record<string, unknown> = {};
      shared['list'] = [shared];
      const target: Record<string, unknown> = {
        first: { keepFirst: true },
        second: { keepSecond: true },
      };

      const result = merge(target, { first: shared, second: shared });
      const first = result.first;
      const second = result.second;

      assert.notStrictEqual(first, second);
      assert.strictEqual((first['list'] as unknown[])[0], first);
      assert.strictEqual((second['list'] as unknown[])[0], second);
      assert.strictEqual(first['keepFirst'], true);
      assert.strictEqual(second['keepSecond'], true);
    });

    it('should preserve ancestors when copying another destination', () => {
      const source: Record<string, unknown> = {};
      const shared = { list: [source] };
      source['first'] = shared;
      source['second'] = shared;
      const target: Record<string, unknown> = { first: {}, second: {} };

      const result = merge(target, source);

      for (const key of ['first', 'second']) {
        const branch = result[key] as { list: unknown[] };
        assert.strictEqual(branch.list[0], result);
      }
    });

    it('should copy foreign plain objects consistently through arrays', () => {
      const shared = runInNewContext('({ nested: { value: 1 } })') as {
        nested: { value: number };
      };
      // Test both traversal orders: an array can be the first place the
      // foreign object is encountered.
      for (const source of [
        { direct: shared, list: [shared] },
        { list: [shared], direct: shared },
      ]) {
        const result = merge({}, source);
        assert.strictEqual(result.direct, result.list[0]);
        assert.notStrictEqual(result.direct, shared);
        assert.notStrictEqual(result.direct.nested, shared.nested);
        result.direct.nested.value = 2;
        assert.strictEqual(shared.nested.value, 1);
      }
    });
  });
}

for (const merge of [deepAssign, deepMixin]) {
  describe(`${merge.name} shared branches`, () => {
    // A source and a target that both reach one object along two paths, at
    // every level: merged again along every path, that is 2 ** 40 merges.
    function ladder(depth: number, leaf: () => Record<string, unknown>) {
      let node: Record<string, unknown> = leaf();
      for (let level = 0; level < depth; level += 1) {
        node = { left: node, level, right: node };
      }
      return node;
    }

    it('should merge each shared pair once while nothing has changed', () => {
      const source = ladder(40, () => ({ leaf: 'source' }));
      const target = ladder(40, () => ({ leaf: 'target', kept: true }));
      const started = performance.now();
      const result = merge(target, source);
      assert.ok(performance.now() - started < 1000);
      let node = result as Record<string, unknown>;
      for (let level = 39; level >= 0; level -= 1) {
        assert.strictEqual(node['level'], level);
        assert.strictEqual(node['left'], node['right']);
        node = node['left'] as Record<string, unknown>;
      }
      assert.deepStrictEqual(node, { leaf: 'source', kept: true });
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
      merge({ a: shared, b: shared }, { a: source, b: source });
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
      merge({ a: shared, b: shared }, { a: source, b: source });
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
      merge({ a: shared, b: shared }, { a: source, b: source });
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
        set() {},
      });
      const source = { child: { x: 1 } };
      merge({ a: shared, b: shared }, { a: source, b: source });
      assert.strictEqual(children.length, 2);
      for (const child of children) assert.deepStrictEqual(child, { x: 1 });
    });

    it('should merge a pair again once something has changed since', () => {
      // `first` is merged into `shared`, then `second` overwrites it there,
      // then `first` comes round again and has to win, as the last write.
      const shared = { value: 0 };
      const first = { value: 1 };
      const second = { value: 2 };
      const result = merge(
        { a: shared, b: shared, c: shared },
        { a: first, b: second, c: first }
      );
      assert.strictEqual(result.c, shared);
      assert.deepStrictEqual(shared, { value: 1 });
    });
  });
}
