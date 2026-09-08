// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { _getReceivedSubMsg } from '../../src/_internal/_get-received-sub-msg';

// Assertions match on the rendered value only, never the surrounding quote
// characters, which are curly or straight depending on the locale.
describe('_getReceivedSubMsg', () => {
  it('should render primitives without mangling them', () => {
    // Regression: an unconditional .slice(1, -1) stripped the first and last
    // character of every inspected value, rendering 42 as '' and true as 'ru'.
    assert.match(_getReceivedSubMsg(42), /42/);
    assert.match(_getReceivedSubMsg(true), /true/);
    assert.match(_getReceivedSubMsg(0), /0/);
    assert.match(_getReceivedSubMsg(-1.5), /-1\.5/);
  });

  it('should strip the surrounding quotes from a string', () => {
    assert.match(_getReceivedSubMsg('hi'), /hi/);
    assert.doesNotMatch(_getReceivedSubMsg('hi'), /'hi'/);
  });

  it('should render empty objects and arrays rather than emptying them', () => {
    // Regression: both used to render as an empty string.
    assert.match(_getReceivedSubMsg({}), /\{\}/);
    assert.match(_getReceivedSubMsg([]), /\[\]/);
  });

  it('should unwrap the [Object] / [Array] depth placeholders', () => {
    assert.match(_getReceivedSubMsg({ a: 1 }), /Object/);
    assert.doesNotMatch(_getReceivedSubMsg({ a: 1 }), /\[Object\]/);
    assert.match(_getReceivedSubMsg([1, 2]), /Array/);
    assert.doesNotMatch(_getReceivedSubMsg([1, 2]), /\[Array\]/);
  });

  it('should not chop characters off Dates and RegExps', () => {
    assert.match(_getReceivedSubMsg(new Date(0)), /1970-01-01T00:00:00\.000Z/);
    assert.match(_getReceivedSubMsg(/re/), /\/re\//);
  });

  it('should keep an Error to a single line instead of its whole stack', () => {
    const msg = _getReceivedSubMsg(new Error('boom'));
    assert.match(msg, /Error: boom/);
    assert.doesNotMatch(msg, /\n/);
  });

  it('should name nullish values and functions directly', () => {
    assert.match(_getReceivedSubMsg(null), /null/);
    assert.match(_getReceivedSubMsg(undefined), /undefined/);
    assert.match(
      _getReceivedSubMsg(function namedFn() {
        /* no-op */
      }),
      /namedFn/
    );
  });
});
