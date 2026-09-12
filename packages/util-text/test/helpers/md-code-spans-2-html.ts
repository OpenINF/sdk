// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { mdCodeSpans2html } from '../../src/helpers/md-code-spans-2-html';

describe(mdCodeSpans2html.name, () => {
  it('should transform a single backtick code span into an HTML code element', () => {
    assert.strictEqual(
      mdCodeSpans2html('Run `npm test` now'),
      'Run <code>npm test</code> now'
    );
  });

  it('should transform multiple code spans independently', () => {
    assert.strictEqual(
      mdCodeSpans2html('`foo` and `bar`'),
      '<code>foo</code> and <code>bar</code>'
    );
  });

  it('should remove one surrounding space when content is not all spaces', () => {
    assert.strictEqual(mdCodeSpans2html('` foo `'), '<code>foo</code>');
    assert.strictEqual(mdCodeSpans2html('`  foo  `'), '<code> foo </code>');
    assert.strictEqual(mdCodeSpans2html('`   `'), '<code>   </code>');
    assert.strictEqual(mdCodeSpans2html('` foo`'), '<code> foo</code>');
  });

  it('should normalize line endings to spaces', () => {
    assert.strictEqual(
      mdCodeSpans2html('`one\r\ntwo\rthree\nfour`'),
      '<code>one two three four</code>'
    );
  });

  it('should escape HTML-significant code contents', () => {
    assert.strictEqual(
      mdCodeSpans2html('`<img src="x"> & &quot;`'),
      '<code>&lt;img src=&quot;x&quot;&gt; &amp; &amp;quot;</code>'
    );
  });

  it('should leave text without code spans unchanged', () => {
    assert.strictEqual(
      mdCodeSpans2html('no code spans here'),
      'no code spans here'
    );
  });
});

describe('mdCodeSpans2html performance', () => {
  it('should stay linear on adversarial backtick input', () => {
    // The previous regex backtracked quadratically here: 80 KB took ~20s.
    const adversarial = '`'.repeat(200_000) + 'x'.repeat(200_000);
    const start = Date.now();
    mdCodeSpans2html(adversarial);
    const elapsed = Date.now() - start;
    assert.ok(
      elapsed < 2000,
      `expected under 2s for 400k chars, took ${elapsed}ms`
    );
  });

  it('should stay linear across unmatched runs of different lengths', () => {
    const adversarial = Array.from(
      { length: 1000 },
      (_, i) => `${'`'.repeat(i + 1)}x`
    ).join('');
    const start = Date.now();
    mdCodeSpans2html(adversarial);
    const elapsed = Date.now() - start;
    assert.ok(
      elapsed < 2000,
      `expected under 2s for unmatched runs, took ${elapsed}ms`
    );
  });

  it('should require the opening and closing backtick runs to be equal', () => {
    // CommonMark: a backtick string is maximal, so a run of 3 cannot be closed
    // by a run of 1. The old regex matched here by starting mid-run.
    assert.strictEqual(mdCodeSpans2html('```a`'), '```a`');
    assert.strictEqual(mdCodeSpans2html('``a```'), '``a```');
  });

  it('should handle a span containing backticks via a longer fence', () => {
    assert.strictEqual(
      mdCodeSpans2html('``code with ` backtick``'),
      '<code>code with ` backtick</code>'
    );
  });
});
