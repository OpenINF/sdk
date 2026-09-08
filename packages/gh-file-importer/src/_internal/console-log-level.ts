// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
//
// Ported to TypeScript from the `console-log-level` package (MIT), by
// Thomas Watson Steen <https://github.com/watson/console-log-level>, to drop
// an unmaintained runtime dependency whose `require('util')` call prevented
// @openinf/gh-file-importer from being bundled as ESM.
//
// The original's `prefix` and `stderr` options are intentionally not carried
// over: nothing in this package used them, and a consumer wanting different
// behavior supplies their own `Logger` via `GhFileImporterOptions.log`
// rather than configuring this factory. Level gating and the level-to-console
// method routing are reproduced exactly.

import { format } from 'node:util';

/** The log levels, ordered from most to least verbose. */
export type LogLevelName =
  'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

/** A minimal leveled logger. */
export type Logger = Record<LogLevelName, (...args: unknown[]) => void>;

/** Level order, used to decide whether a given level is enabled. */
const LEVELS: readonly LogLevelName[] = [
  'trace',
  'debug',
  'info',
  'warn',
  'error',
  'fatal',
];

/**
 * The `console` method each level writes through. `trace` and `debug` are
 * routed to `console.info` (rather than `console.trace`/`console.debug`) and
 * `fatal` to `console.error`, matching `console-log-level`.
 */
const CONSOLE_METHOD: Readonly<
  Record<LogLevelName, 'info' | 'warn' | 'error'>
> = {
  trace: 'info',
  debug: 'info',
  info: 'info',
  warn: 'warn',
  error: 'error',
  fatal: 'error',
};

/** Options accepted by {@link createLogger}. */
export interface CreateLoggerOptions {
  /** The minimum level to emit. Defaults to `'info'`. */
  level?: LogLevelName;
}

/**
 * Detects whether `value` names a log level.
 * @param value The value to identify.
 * @returns `true` if `value` is a {@link LogLevelName}; else, `false`.
 */
export function isLogLevelName(value: unknown): value is LogLevelName {
  return (
    typeof value === 'string' && (LEVELS as readonly string[]).includes(value)
  );
}

/**
 * Creates a logger that writes to the console, discarding anything below the
 * configured level.
 * @param options The options object.
 * @returns A logger exposing one method per level.
 */
export function createLogger(options: CreateLoggerOptions = {}): Logger {
  // Guard the level rather than trusting `indexOf`: an unrecognized name
  // yields -1, which would make *every* level pass the threshold and turn a
  // typo into unexpectedly verbose output. `console-log-level` had this
  // behavior; callers reaching here from JS get 'info' instead.
  const level = isLogLevelName(options.level) ? options.level : 'info';
  const threshold = LEVELS.indexOf(level);
  const noop = (): void => undefined;

  const logger = {} as Record<LogLevelName, (...args: unknown[]) => void>;
  for (const level of LEVELS) {
    logger[level] =
      LEVELS.indexOf(level) >= threshold
        ? (...args: unknown[]): void => {
            console[CONSOLE_METHOD[level]](format(...args));
          }
        : noop;
  }
  return logger;
}
