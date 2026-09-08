// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from TypeScript Compiler

import { _isFunctionLike } from '../_internal/_is-function-like';

// https://github.com/sindresorhus/fn-name
// https://github.com/chaijs/get-func-name
// https://github.com/microsoft/TypeScript/blob/38da7c600c83e7b31193a62495239a0fe478cb67/src/compiler/debug.ts#L286-L298

export function getFunctionName(fn: () => unknown): string {
  if (!_isFunctionLike(fn)) {
    return '';
  }

  const fnRecord = fn as unknown as Record<string, unknown>;

  if (typeof fnRecord['displayName'] === 'string') {
    return fnRecord['displayName'];
  }
  if (typeof fnRecord['name'] === 'string' && fnRecord['name'] !== '') {
    return fnRecord['name'];
  }

  const text = Function.prototype.toString.call(fn);
  const match = /^function\s+([\w]+)\s*\(/.exec(text);
  // Group 1 is not optional in the pattern, so it is present whenever match is.
  // oxlint-disable-next-line typescript/no-unnecessary-type-assertion -- oxlint-tsgolint doesn't currently honor noUncheckedIndexedAccess; tsc does require this.
  return match ? match[1]! : '';
}
