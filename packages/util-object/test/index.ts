// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import * as utilObject from '../src/index';

describe('index', () => {
  it('should export every public assertion, guard, and helper as a function', () => {
    const names = [
      'assertIsNamed',
      'clone',
      'create',
      'createClassWrapper',
      'deepAssign',
      'deepMerge',
      'deepMixin',
      'getAllKeys',
      'getConstructorOf',
      'getEntries',
      'getFunctionName',
      'getOwnKeys',
      'getOwnValues',
      'getProperty',
      'getPropertyDescriptor',
      'memo',
      'mixin',
      'omit',
      'ownProperty',
      'equalOwnProperties',
      'hasOwn',
      'has',
      'hasProperties',
      'isAccessorDescriptor',
      'isConstructor',
      'isDataDescriptor',
      'isEmptyObject',
      'isNamed',
      'isObjectCoercible',
      'isObjectLike',
      'isPlainObject',
      'objectsEqualShallow',
      'propertyIsEnumerable',
    ] as const;

    for (const name of names) {
      assert.strictEqual(typeof utilObject[name], 'function');
    }
  });

  it('should agree with its exports on a representative value', () => {
    assert.strictEqual(utilObject.isPlainObject({}), true);
    assert.strictEqual(utilObject.hasOwn({ a: 1 }, 'a'), true);
    assert.deepStrictEqual(utilObject.omit({ a: 1, b: 2 }, ['b']), { a: 1 });
  });
});
