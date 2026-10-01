// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { deepMixin } from '../../src/helpers/deep-mixin';

describe(deepMixin.name, () => {
  it('should copy inherited enumerable properties from sources', () => {
    const proto = { inherited: 'yes' };
    const src = Object.create(proto) as Record<string, unknown>;
    src['own'] = 'own';
    assert.deepStrictEqual(deepMixin({}, src), {
      own: 'own',
      inherited: 'yes',
    });
  });

  it('should recursively merge nested objects', () => {
    const result = deepMixin({ a: { x: 1 } }, { a: { y: 2 } });
    assert.deepStrictEqual(result, { a: { x: 1, y: 2 } });
  });

  it('should copy every path to a shared object', () => {
    const shared = { child: { value: 1 } };
    const result = deepMixin({}, { first: shared, second: shared });

    assert.deepStrictEqual(result, {
      first: { child: { value: 1 } },
      second: { child: { value: 1 } },
    });
    assert.strictEqual(result.first, result.second);
  });

  it('should preserve a circular object', () => {
    const source: Record<string, unknown> = {};
    source['self'] = source;

    const result = deepMixin({}, source);

    assert.strictEqual(result['self'], result);
  });

  it('should merge a shared source into each object the target holds', () => {
    const shared = { added: 1 };
    const result = deepMixin(
      { first: { keepFirst: 1 }, second: { keepSecond: 2 } },
      { first: shared, second: shared }
    );

    assert.deepStrictEqual(result, {
      first: { keepFirst: 1, added: 1 },
      second: { keepSecond: 2, added: 1 },
    });
    assert.notStrictEqual(result.first, result.second);
  });

  it('should assign a function, a Date, a Map and a class instance by reference', () => {
    class Point {
      x = 1;
    }
    const source = {
      fn: (): number => 1,
      when: new Date(0),
      map: new Map([[1, 2]]),
      pattern: /x/g,
      point: new Point(),
    };

    const result = deepMixin({}, source);

    assert.strictEqual(result.fn, source.fn);
    assert.strictEqual(result.when, source.when);
    assert.strictEqual(result.map, source.map);
    assert.strictEqual(result.pattern, source.pattern);
    assert.strictEqual(result.point, source.point);
  });

  it('should replace a Date the target holds rather than merge into it', () => {
    const when = new Date(5);
    const result = deepMixin({ when: new Date(0) }, { when });

    assert.strictEqual(result.when, when);
  });
});
