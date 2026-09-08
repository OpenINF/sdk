// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isModuleNamespaceObject } from '../../src/guards/is-module-namespace-object';

describe(isModuleNamespaceObject.name, () => {
  it('should detect an object tagged as a Module', () => {
    const fakeModule: unknown = { [Symbol.toStringTag]: 'Module' };
    assert.strictEqual(isModuleNamespaceObject(fakeModule), true);
  });

  it('should reject a plain object', () => {
    assert.strictEqual(isModuleNamespaceObject({}), false);
  });

  it('should reject non-object-like values', () => {
    assert.strictEqual(isModuleNamespaceObject(null), false);
  });
});
