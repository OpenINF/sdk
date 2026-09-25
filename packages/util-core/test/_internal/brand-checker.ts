// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { createContext, runInContext } from 'node:vm';

type Predicate = (value: unknown) => boolean;

describe('host-independent brand checker', () => {
  it('loads without Node globals, host imports, WebAssembly, or SharedArrayBuffer', () => {
    // Evaluate the compiled modules in a fresh realm. The only allowed imports
    // are these local files; there is no process, Buffer, or host loader.
    const sources = new Map([
      [
        './_get-property-descriptor',
        readFileSync(
          require.resolve('../../src/_internal/_get-property-descriptor'),
          'utf8'
        ),
      ],
      [
        './_matches-brand-shape',
        readFileSync(
          require.resolve('../../src/_internal/_matches-brand-shape'),
          'utf8'
        ),
      ],
      [
        './_typed-array-name',
        readFileSync(
          require.resolve('../../src/_internal/_typed-array-name'),
          'utf8'
        ),
      ],
      [
        './_brand-checks',
        readFileSync(
          require.resolve('../../src/_internal/_brand-checks'),
          'utf8'
        ),
      ],
      [
        './_tag-tester',
        readFileSync(
          require.resolve('../../src/_internal/_tag-tester'),
          'utf8'
        ),
      ],
    ]);
    const context = createContext({});
    runInContext(
      'globalThis.WebAssembly = undefined; globalThis.SharedArrayBuffer = undefined; Error.isError = undefined;',
      context
    );
    const load = (name: string): Record<string, unknown> => {
      const source = sources.get(name);
      assert.notStrictEqual(
        source,
        undefined,
        'unexpected dependency: ' + name
      );
      const exports: Record<string, unknown> = {};
      const evaluate = runInContext(
        '(function(exports, require) {\n' + source + '\n})',
        context
      ) as (exports: Record<string, unknown>, require: typeof load) => void;
      evaluate(exports, load);
      return exports;
    };
    const tagTester = load('./_tag-tester')['_tagTester'] as (
      name: string
    ) => Predicate;
    const localError = runInContext('new Error()', context);
    const moduleLike = runInContext(
      `(() => {
        const value = Object.create(null);
        Object.defineProperties(value, {
          [Symbol.toStringTag]: { value: 'Module' },
          answer: { enumerable: true, value: 42, writable: true }
        });
        return Object.preventExtensions(value);
      })()`,
      context
    );
    runInContext(
      'Function.prototype.call = function() { throw new Error("replacement"); };' +
        'Reflect.apply = function() { throw new Error("replacement"); };' +
        'Reflect.ownKeys = function() { throw new Error("replacement"); };' +
        'Object.hasOwn = function() { throw new Error("replacement"); };' +
        'Object.getOwnPropertyDescriptor = function() { throw new Error("replacement"); };' +
        'Object.getPrototypeOf = function() { throw new Error("replacement"); };' +
        'Object.isExtensible = function() { throw new Error("replacement"); };' +
        'Number.isSafeInteger = function() { throw new Error("replacement"); };' +
        'Map.prototype.get = function() { throw new Error("replacement"); };' +
        'Map.prototype.has = function() { throw new Error("replacement"); };' +
        'Date.prototype.getTime = function() { throw new Error("replacement"); };' +
        'Function.prototype.toString = function() { throw new Error("replacement"); };' +
        'RegExp.prototype.exec = function() { throw new Error("replacement"); };' +
        'String.prototype.startsWith = function() { throw new Error("replacement"); };',
      context
    );
    assert.strictEqual(tagTester('Map')(new Map()), true);
    assert.strictEqual(tagTester('Date')(new Date()), true);
    assert.strictEqual(
      tagTester('Map')({ [Symbol.toStringTag]: 'Map' }),
      false
    );
    assert.strictEqual(tagTester('Uint8Array')(new Uint8Array()), true);
    assert.strictEqual(tagTester('ArrayBuffer')(new ArrayBuffer(0)), true);
    assert.strictEqual(tagTester('Promise')(Promise.resolve()), true);
    assert.strictEqual(tagTester('Module')(moduleLike), true);
    assert.strictEqual(
      tagTester('AsyncFunction')(async () => {}),
      true
    );
    assert.strictEqual(
      tagTester('SharedArrayBuffer')({
        [Symbol.toStringTag]: 'SharedArrayBuffer',
      }),
      false
    );
    assert.strictEqual(
      tagTester('WebAssembly.Module')({
        [Symbol.toStringTag]: 'WebAssembly.Module',
      }),
      false
    );
    assert.strictEqual(tagTester('Error')(localError), true);
    assert.strictEqual(tagTester('Error')(new TypeError()), true);
    assert.strictEqual(
      tagTester('Error')(
        runInContext('Object.create(Error.prototype)', context)
      ),
      false
    );
    assert.strictEqual(tagTester('Error')(new Proxy(localError, {})), false);
    assert.strictEqual(
      tagTester('Error')({ [Symbol.toStringTag]: 'Error' }),
      false
    );
    const taggedError = new Error();
    Object.defineProperty(taggedError, Symbol.toStringTag, { value: 'Error' });
    assert.strictEqual(tagTester('Error')(taggedError), false);
    const { proxy, revoke } = Proxy.revocable({}, {});
    revoke();
    assert.strictEqual(tagTester('Error')(proxy), false);
  });
});
