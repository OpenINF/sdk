// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { stringify } from '../../src/helpers/stringify';

describe(stringify.name, () => {
  it('should return a string unchanged', () => {
    assert.strictEqual(stringify('foo'), 'foo');
  });

  it('should stringify null and undefined', () => {
    assert.strictEqual(stringify(null), 'null');
    assert.strictEqual(stringify(undefined), 'undefined');
  });

  it('should return the name of a named token', () => {
    function Foo(): void {
      // empty
    }
    assert.strictEqual(stringify(Foo), 'Foo');
  });

  it('should prefer overriddenName over name', () => {
    function Foo(): void {
      // empty
    }
    (Foo as unknown as Record<string, unknown>)['overriddenName'] = 'Bar';
    assert.strictEqual(stringify(Foo), 'Bar');
  });

  it('should fall back to the string representation, truncated at the first newline', () => {
    const token = { toString: (): string => 'line one\nline two' };
    assert.strictEqual(stringify(token), 'line one');
  });

  it('should end the representation at any line ending', () => {
    assert.strictEqual(stringify({ toString: () => 'one\r\ntwo' }), 'one');
    assert.strictEqual(stringify({ toString: () => 'one\rtwo' }), 'one');
  });

  it('should describe a value that cannot be converted to a string', () => {
    assert.strictEqual(stringify(Object.create(null)), '[object Object]');
    assert.strictEqual(stringify(Object(Symbol('s'))), '[object Symbol]');
  });
});
