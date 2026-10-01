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
