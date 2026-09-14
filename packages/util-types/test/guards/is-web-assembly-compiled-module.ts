// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isWebAssemblyCompiledModule } from '../../src/guards/is-web-assembly-compiled-module';

describe(isWebAssemblyCompiledModule.name, () => {
  it('should reject an object merely tagged as a WebAssembly.Module', () => {
    const fakeModule: unknown = {
      [Symbol.toStringTag]: 'WebAssembly.Module',
    };
    assert.strictEqual(isWebAssemblyCompiledModule(fakeModule), false);
  });

  it('should detect an actual WebAssembly.Module', () => {
    const WebAssemblyModule = (
      globalThis as unknown as {
        WebAssembly: { Module: new (bytes: Uint8Array) => unknown };
      }
    ).WebAssembly.Module;
    const bytes = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0]);
    assert.strictEqual(
      isWebAssemblyCompiledModule(new WebAssemblyModule(bytes)),
      true
    );
  });

  it('should reject a plain object', () => {
    assert.strictEqual(isWebAssemblyCompiledModule({}), false);
  });

  it('should reject non-object-like values', () => {
    assert.strictEqual(isWebAssemblyCompiledModule(null), false);
  });
});
