// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isRawJSON } from '../../src/guards/is-raw-json';

const json = JSON as {
  rawJSON?: (text: string) => object;
  isRawJSON?: (value: unknown) => boolean;
};
const has = typeof json.rawJSON === 'function';

describe(isRawJSON.name, () => {
  it('should detect what JSON.rawJSON returns', { skip: !has }, () => {
    assert.strictEqual(isRawJSON(json.rawJSON!('12345678901234567890')), true);
  });

  it('should reject an object that merely carries a rawJSON property', () => {
    assert.strictEqual(isRawJSON({ rawJSON: '1' }), false);
    assert.strictEqual(
      isRawJSON(
        Object.freeze(Object.assign(Object.create(null), { rawJSON: '1' }))
      ),
      false
    );
  });

  it('should reject the parsed and stringified forms it sits between', () => {
    assert.strictEqual(isRawJSON('12345678901234567890'), false, 'a string');
    assert.strictEqual(isRawJSON(JSON.parse('1')), false, 'a parsed number');
    assert.strictEqual(isRawJSON({}), false);
    assert.strictEqual(isRawJSON(null), false);
  });
});
