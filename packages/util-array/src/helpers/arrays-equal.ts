// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { EqualityComparer } from '../types';

function equateValues<T>(a: T, b: T): boolean {
  return a === b;
}

export function arraysEqual<T>(
  a: readonly T[],
  b: readonly T[],
  equalityComparer: EqualityComparer<T> = equateValues
): boolean {
  return (
    a.length === b.length &&
    // a.length === b.length guarantees index i is present in b.
    // oxlint-disable-next-line typescript/no-unnecessary-type-assertion -- oxlint-tsgolint doesn't currently honor noUncheckedIndexedAccess; tsc does require this.
    a.every((x, i) => equalityComparer(x, b[i]!))
  );
}
