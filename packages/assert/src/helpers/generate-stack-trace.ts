// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// https://github.com/sindresorhus/ow/blob/main/source/utils/generate-stack.ts

/**
 * Generates a useful stacktrace that points to the user's code where the error
 * happened on platforms without the `Error.captureStackTrace()` method.
 * @private
 * @returns The generated stacktrace.
 */
export const generateStackTrace = (): string => {
  const stack = new RangeError('ERR_INTERNAL').stack!;

  return stack;
};
