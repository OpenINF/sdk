// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { blue, italic, red, underline, yellow } from '../../src/_internal/ansi';

// Pins the exact byte sequences these helpers emit. The expectations were
// captured from `cli-color` before it was removed as a dependency, so a
// regression here means output visibly changed for consumers.
const ESC = '\u001B';

describe('ansi', () => {
  it('should wrap text in the expected SGR sequences', () => {
    assert.strictEqual(blue('TEXT'), `${ESC}[34mTEXT${ESC}[39m`);
    assert.strictEqual(red('TEXT'), `${ESC}[31mTEXT${ESC}[39m`);
    assert.strictEqual(yellow('TEXT'), `${ESC}[33mTEXT${ESC}[39m`);
    assert.strictEqual(italic('TEXT'), `${ESC}[3mTEXT${ESC}[23m`);
    assert.strictEqual(underline('TEXT'), `${ESC}[4mTEXT${ESC}[24m`);
  });

  it('should still emit both codes for an empty string', () => {
    assert.strictEqual(blue(''), `${ESC}[34m${ESC}[39m`);
    assert.strictEqual(underline(''), `${ESC}[4m${ESC}[24m`);
  });

  it('should re-open the outer color after a nested color of the same family', () => {
    // cli-color: blue(red('x')) === ESC[34m ESC[31m x ESC[34m ESC[39m
    assert.strictEqual(
      blue(red('x')),
      `${ESC}[34m${ESC}[31mx${ESC}[34m${ESC}[39m`
    );
  });

  it('should leave a nested style from a different family intact', () => {
    // underline's reset (ESC[24m) cannot terminate a color, so it is untouched.
    assert.strictEqual(
      blue(underline('x')),
      `${ESC}[34m${ESC}[4mx${ESC}[24m${ESC}[39m`
    );
  });

  it('should replace a bare closing code already present in the text', () => {
    assert.strictEqual(
      blue(`a${ESC}[39mb`),
      `${ESC}[34ma${ESC}[34mb${ESC}[39m`
    );
  });

  // cli-color reopens only its _fg/_bg modes; every other style strips the
  // nested close instead, because the outer format is still in effect.
  it('should strip rather than reopen a nested close for non-color formats', () => {
    assert.strictEqual(italic(`a${ESC}[23mb`), `${ESC}[3mab${ESC}[23m`);
    assert.strictEqual(underline(`${ESC}[24m`), `${ESC}[4m${ESC}[24m`);
  });

  it('should collapse a nested same-format pair', () => {
    assert.strictEqual(italic(italic('x')), `${ESC}[3m${ESC}[3mx${ESC}[23m`);
    assert.strictEqual(
      underline(underline('x')),
      `${ESC}[4m${ESC}[4mx${ESC}[24m`
    );
  });
});
