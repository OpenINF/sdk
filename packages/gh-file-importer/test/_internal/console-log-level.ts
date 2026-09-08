// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { afterEach, describe, it, mock } from 'node:test';

import { createLogger } from '../../src/_internal/console-log-level';

/** Records which console method fired, and with what, instead of printing. */
function capture(fn: () => void): Array<[string, ...unknown[]]> {
  const calls: Array<[string, ...unknown[]]> = [];
  for (const method of ['info', 'warn', 'error'] as const) {
    mock.method(console, method, (...args: unknown[]) => {
      calls.push([method, ...args]);
    });
  }
  fn();
  return calls;
}

describe('createLogger', () => {
  afterEach(() => {
    mock.restoreAll();
  });

  it('should discard levels below the configured threshold', () => {
    const log = createLogger({ level: 'warn' });
    assert.deepStrictEqual(
      capture(() => {
        log.trace('a');
        log.debug('b');
        log.info('c');
      }),
      []
    );
  });

  it('should emit levels at or above the configured threshold', () => {
    const log = createLogger({ level: 'warn' });
    assert.deepStrictEqual(
      capture(() => {
        log.warn('w');
        log.error('e');
        log.fatal('f');
      }),
      [
        ['warn', 'w'],
        ['error', 'e'],
        ['error', 'f'],
      ]
    );
  });

  it('should default to the info level', () => {
    const log = createLogger();
    assert.deepStrictEqual(
      capture(() => {
        log.debug('skipped');
        log.info('kept');
      }),
      [['info', 'kept']]
    );
  });

  // trace/debug route to console.info and fatal to console.error, rather than
  // to same-named console methods. This matches console-log-level.
  it('should route each level to the expected console method', () => {
    const log = createLogger({ level: 'trace' });
    assert.deepStrictEqual(
      capture(() => {
        log.trace('t');
        log.debug('d');
        log.info('i');
        log.warn('w');
        log.error('e');
        log.fatal('f');
      }),
      [
        ['info', 't'],
        ['info', 'd'],
        ['info', 'i'],
        ['warn', 'w'],
        ['error', 'e'],
        ['error', 'f'],
      ]
    );
  });

  it('should apply util.format to its arguments', () => {
    const log = createLogger({ level: 'info' });
    assert.deepStrictEqual(
      capture(() => {
        log.info('%s and %s', 'a', 'b');
      }),
      [['info', 'a and b']]
    );
    assert.deepStrictEqual(
      capture(() => {
        log.info('count: %d', 42);
      }),
      [['info', 'count: 42']]
    );
  });
});
