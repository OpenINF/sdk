// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

// `assertValue` reads a guard's `expectation` to say what was wanted, and falls
// back to "be valid" when there is none -- which tells the reader nothing.
// Attaching one is a line that is easy to forget, and three guards here had
// forgotten it. The directory is listed rather than the guards named, so a new
// guard is held to this without anyone remembering to add it.
//
// Compiled next to the sources it reads, so the directory is found relative to
// this file rather than to wherever the test runner was started.
const guardsDirectory = join(__dirname, '..', '..', 'src', 'guards');

const guardModules = readdirSync(guardsDirectory).filter((file) =>
  /^is-[\w-]+\.js$/.test(file)
);

describe('guard expectations', () => {
  it('finds the guards it is meant to check', () => {
    assert.ok(guardModules.length > 0, `no guards found in ${guardsDirectory}`);
  });

  for (const file of guardModules) {
    it(`gives the guard in ${file} an expectation`, () => {
      // oxlint-disable-next-line typescript/no-require-imports -- the module is only known once the directory has been read.
      const exported = require(join(guardsDirectory, file)) as Record<
        string,
        unknown
      >;
      const guards = Object.entries(exported).filter(
        (entry): entry is [string, { expectation?: unknown }] =>
          typeof entry[1] === 'function'
      );

      assert.ok(guards.length > 0, `${file} exports no function`);

      for (const [name, guard] of guards) {
        const { expectation } = guard;
        const text =
          typeof expectation === 'function' ? expectation() : expectation;

        assert.ok(
          typeof text === 'string' && text.trim() !== '',
          `${name} has no expectation, so a failed assertion would read "be valid"`
        );
      }
    });
  }
});
