// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Re-exported rather than reimplemented: @openinf/assert owns this, and its
// version is a superset (lazy guards, a caller-supplied expectation, and
// truncation of long values). Keeping one implementation means util's
// internal assertions report failures identically to assert's.
import { assertValue } from '@openinf/assert';

export { assertValue };
