// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Only use this for integers! Decimal numbers do not work with this function.
export function _addNumericalSeparator(val: string): string {
  let res = '';
  let i = val.length;
  const start = val.startsWith('-') ? 1 : 0;
  for (; i >= start + 4; i -= 3) {
    res = `_${val.slice(i - 3, i)}${res}`;
  }
  return `${val.slice(0, i)}${res}`;
}
