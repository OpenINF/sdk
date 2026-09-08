// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isDataView } from '../../src/guards/is-data-view';

describe(isDataView.name, () => {
  it('should detect a DataView', () => {
    assert.strictEqual(isDataView(new DataView(new ArrayBuffer(16))), true);
  });

  it('should reject non-DataView values', () => {
    assert.strictEqual(isDataView([]), false);
    assert.strictEqual(isDataView(new ArrayBuffer(16)), false);
  });
});
