// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isWebAssemblyCompiledModule } from '../../src/guards/is-web-assembly-compiled-module';

describe(isWebAssemblyCompiledModule.name, () => {
  it('should detect an object tagged as a WebAssembly.Module', () => {
    const fakeModule: unknown = {
      [Symbol.toStringTag]: 'WebAssembly.Module',
    };
    assert.strictEqual(isWebAssemblyCompiledModule(fakeModule), true);
  });

  it('should reject a plain object', () => {
    assert.strictEqual(isWebAssemblyCompiledModule({}), false);
  });

  it('should reject non-object-like values', () => {
    assert.strictEqual(isWebAssemblyCompiledModule(null), false);
  });
});
