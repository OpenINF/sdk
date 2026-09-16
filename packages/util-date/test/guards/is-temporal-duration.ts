// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isTemporalDuration } from '../../src/guards/is-temporal-duration';

// Temporal is finished for ES2027, and a runtime that has it is what the
// positive cases need. Node 26 has it; on an older one they are skipped, and
// the guard is checked for saying false to everything instead.
const hasTemporal = typeof Temporal !== 'undefined';

describe(isTemporalDuration.name, () => {
  it('should detect a Temporal.Duration', { skip: !hasTemporal }, () => {
    assert.strictEqual(
      isTemporalDuration(Temporal.Duration.from({ days: 1 })),
      true
    );
  });

  it('should reject the other Temporal types', { skip: !hasTemporal }, () => {
    assert.strictEqual(
      isTemporalDuration(Temporal.Now.instant()),
      false,
      'Instant'
    );
    assert.strictEqual(
      isTemporalDuration(Temporal.Now.zonedDateTimeISO()),
      false,
      'ZonedDateTime'
    );
  });

  it('should reject a Date, and an object that only claims the tag', () => {
    assert.strictEqual(isTemporalDuration(new Date()), false);
    assert.strictEqual(
      isTemporalDuration({ [Symbol.toStringTag]: 'Temporal.Duration' }),
      false
    );
    assert.strictEqual(isTemporalDuration(null), false);
  });
});
