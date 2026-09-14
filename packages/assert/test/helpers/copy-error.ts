// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { copyError } from '../../src/helpers/copy-error';

describe(copyError.name, () => {
  it('should create a distinct copy with the same message', () => {
    const original = new TypeError('boom');
    const copy = copyError(original);
    assert.notStrictEqual(copy, original);
    assert.strictEqual(copy.message, 'boom');
  });

  it('should preserve the prototype', () => {
    const original = new TypeError('boom');
    const copy = copyError(original);
    assert.ok(copy instanceof TypeError);
  });

  it('should copy own enumerable properties', () => {
    const original = new Error('boom') as Error & { extra: string };
    original.extra = 'x';
    const copy = copyError(original) as Error & { extra: string };
    assert.strictEqual(copy.extra, 'x');
  });

  it('should preserve the stack as a readable string', () => {
    // Descriptor equality is not enough here: `stack` is an accessor bound to
    // the error the trace came from, so a faithfully copied descriptor still
    // answers `undefined` on the copy.
    const original = new Error('boom');

    const copy = copyError(original);

    assert.strictEqual(typeof copy.stack, 'string');
    assert.strictEqual(copy.stack, original.stack);
  });

  it('should leave a stack accessor that is not V8 own alone', () => {
    // Materializing the string is a workaround for V8's accessor answering
    // for the error it was captured on. An accessor somebody wrote has no
    // such problem, and flattening it would throw its behavior away.
    const original = new Error('boom');
    let reads = 0;
    Object.defineProperty(original, 'stack', {
      configurable: true,
      get: () => `custom#${++reads}`,
    });

    const copy = copyError(original);

    assert.strictEqual(
      typeof Object.getOwnPropertyDescriptor(copy, 'stack')?.get,
      'function'
    );
    assert.notStrictEqual(copy.stack, copy.stack);
  });

  it('should copy an error whose stack getter throws', () => {
    const original = new Error('boom');
    Object.defineProperty(original, 'stack', {
      configurable: true,
      get: () => {
        throw new Error('getter exploded');
      },
    });

    assert.doesNotThrow(() => copyError(original));
  });

  it('should carry a non-string stack a prepareStackTrace hook produced', () => {
    // The hook exists to return something other than a string: structured
    // call sites are its documented use. Treating "not a string" as "nothing
    // to copy" loses exactly the diagnostic somebody installed it for.
    const saved = Error.prepareStackTrace;
    Error.prepareStackTrace = (_error, frames) => frames;

    try {
      const original = new Error('boom');

      const copy = copyError(original);

      assert.ok(Array.isArray(copy.stack));
      assert.strictEqual(copy.stack, original.stack);
    } finally {
      Error.prepareStackTrace = saved;
    }
  });

  it('should copy while a prepareStackTrace hook is throwing', () => {
    // A global hook, which any dependency may have replaced. Copying an error
    // is not the moment to surface somebody else's broken formatter.
    const saved = Error.prepareStackTrace;
    Error.prepareStackTrace = () => {
      throw new Error('hook exploded');
    };

    try {
      assert.doesNotThrow(() => copyError(new Error('boom')));
    } finally {
      Error.prepareStackTrace = saved;
    }
  });

  it('should copy a sealed or frozen error', () => {
    // Their descriptors arrive non-configurable, so rewriting `stack` on the
    // finished object throws rather than returning a copy. It has to be
    // rewritten in the descriptor map instead.
    for (const harden of [
      Object.seal,
      Object.freeze,
      Object.preventExtensions,
    ]) {
      const original = harden(new Error('boom'));

      const copy = copyError(original);

      assert.strictEqual(copy.stack, original.stack);
      assert.strictEqual(copy.message, 'boom');
    }
  });

  it('should copy an error whose stack was removed', () => {
    const original = new Error('boom');
    Reflect.deleteProperty(original, 'stack');

    const copy = copyError(original);

    assert.strictEqual(copy.stack, original.stack);
    assert.strictEqual(copy.message, 'boom');
  });

  it('should preserve every own property descriptor', () => {
    const marker = Symbol('marker');
    const cause = new Error('cause');
    const original = new Error('boom', { cause }) as Error & {
      [marker]?: string;
    };
    Object.defineProperty(original, 'hidden', {
      configurable: true,
      value: 42,
    });
    original[marker] = 'symbol value';

    const copy = copyError(original);
    assert.deepStrictEqual(Reflect.ownKeys(copy), Reflect.ownKeys(original));
    for (const key of Reflect.ownKeys(original)) {
      // `stack` is deliberately not copied as its descriptor: the accessor V8
      // installs answers for the error the trace came from, so the copy holds
      // the string instead. The test above asserts that value.
      if (key === 'stack') continue;

      assert.deepStrictEqual(
        Object.getOwnPropertyDescriptor(copy, key),
        Object.getOwnPropertyDescriptor(original, key)
      );
    }
  });
});
