// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ownProperty } from '../../src/helpers/own-property';

describe(ownProperty.name, () => {
  it('should return the value of an own property', () => {
    assert.strictEqual(ownProperty({ a: 1 }, 'a'), 1);
  });

  it('should return undefined for a missing property', () => {
    assert.strictEqual(ownProperty<string, number>({}, 'a'), undefined);
  });

  it('should return undefined for an inherited property', () => {
    const obj = Object.create({ a: 1 }) as Record<string, unknown>;
    assert.strictEqual(ownProperty(obj, 'a'), undefined);
  });
});
