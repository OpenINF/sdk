// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

export const _isFunctionLike = (value: unknown): boolean =>
  value !== null && typeof value === 'function';
