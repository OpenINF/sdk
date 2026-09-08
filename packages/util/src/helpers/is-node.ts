// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

/**
 * Whether the current runtime is Node.js, determined once at import time.
 *
 * Guarded rather than reading `process.versions.node` directly, so that
 * bundling this package for a non-Node target yields `false` instead of a
 * `ReferenceError` for the missing `process` global.
 */
export const isNode: boolean =
  typeof process !== 'undefined' && Boolean(process.versions?.node);
