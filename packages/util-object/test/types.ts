// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  getObjectType,
  isObjectOfType,
  isObjectTypeName,
  isOfType,
  isPrimitiveTypeName,
  isTypedArrayName,
} from '../src/types';

describe('isTypedArrayName', () => {
  it('should detect typed array type names', () => {
    assert.strictEqual(isTypedArrayName('Uint8Array'), true);
    assert.strictEqual(isTypedArrayName('Float64Array'), true);
  });

  it('should reject non typed array type names', () => {
    assert.strictEqual(isTypedArrayName('Array'), false);
    assert.strictEqual(isTypedArrayName('foo'), false);
  });
});

describe('isObjectTypeName', () => {
  it('should detect object type names', () => {
    assert.strictEqual(isObjectTypeName('Array'), true);
    assert.strictEqual(isObjectTypeName('Date'), true);
  });

  it('should reject non object type names', () => {
    assert.strictEqual(isObjectTypeName('string'), false);
  });
});

describe('isPrimitiveTypeName', () => {
  it('should detect primitive type names', () => {
    assert.strictEqual(isPrimitiveTypeName('string'), true);
    assert.strictEqual(isPrimitiveTypeName('undefined'), true);
  });

  it('should reject non primitive type names', () => {
    assert.strictEqual(isPrimitiveTypeName('Array'), false);
  });
});

describe('isOfType', () => {
  it('should create a guard for a typeof type', () => {
    const isStringPrimitive = isOfType<any>('string');
    assert.strictEqual(isStringPrimitive('foo'), true);
    assert.strictEqual(isStringPrimitive(1), false);
  });
});

describe('getObjectType', () => {
  it('should return the object type name for known types', () => {
    assert.strictEqual(getObjectType([]), 'Array');
    assert.strictEqual(getObjectType(new Date()), 'Date');
    assert.strictEqual(getObjectType(/foo/), 'RegExp');
  });

  it('should return undefined for unrecognized types', () => {
    assert.strictEqual(getObjectType(42), undefined);
  });
});

describe('isObjectOfType', () => {
  it('should create a guard for a specific object type', () => {
    const isArrayType = isObjectOfType<unknown[]>('Array');
    assert.strictEqual(isArrayType([]), true);
    assert.strictEqual(isArrayType({}), false);
  });
});
