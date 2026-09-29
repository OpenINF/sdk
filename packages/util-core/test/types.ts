// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { AnyConstructor } from '../src/types';

describe('AnyConstructor', () => {
  it('should accept constructors with required arguments', () => {
    class NeedsArgument {
      constructor(readonly value: string) {}
    }

    const constructor: AnyConstructor = NeedsArgument;
    assert.strictEqual(constructor, NeedsArgument);
  });
});
