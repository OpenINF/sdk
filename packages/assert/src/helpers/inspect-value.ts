// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { inspect } from 'node:util';

import { _exceedsDisplayBudget } from '../_internal/_exceeds-display-budget';

export function inspectValue(
  val: unknown,
  // `getters: true` below runs getters, so one counts as over the budget.
  tooBig: boolean = _exceedsDisplayBudget(val, undefined, true)
): string {
  // The util.inspect default values could be changed. This makes sure the
  // error messages contain the necessary information nevertheless.
  return inspect(val, {
    compact: false,
    customInspect: false,
    // A value too big to show in full shows its top level only. Shown in
    // full, a graph reaching one object along many paths prints it along every
    // one of them, which takes exponentially more time and memory than the
    // graph itself.
    depth: tooBig ? 0 : 1000,
    maxArrayLength: Infinity,
    // Assert compares only enumerable properties (with a few exceptions).
    showHidden: false,
    // Assert does not detect proxies currently.
    showProxy: false,
    sorted: true,
    // Inspect getters as we also check them when comparing entries.
    getters: true,
  });
}
