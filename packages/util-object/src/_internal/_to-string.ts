// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

export function _toString(value: unknown): string {
  return Object.prototype.toString.call(value);
}
