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
});
