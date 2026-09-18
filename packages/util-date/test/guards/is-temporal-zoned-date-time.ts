// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isTemporalZonedDateTime } from '../../src/guards/is-temporal-zoned-date-time';

// Temporal is finished for ES2027, and a runtime that has it is what the
// positive cases need. Node 26 has it; on an older one they are skipped, and
// the guard is checked for saying false to everything instead.
const hasTemporal = typeof Temporal !== 'undefined';

describe(isTemporalZonedDateTime.name, () => {
  it('should detect a Temporal.ZonedDateTime', { skip: !hasTemporal }, () => {
    assert.strictEqual(
      isTemporalZonedDateTime(Temporal.Now.zonedDateTimeISO()),
      true
    );
  });

  it('should reject the other Temporal types', { skip: !hasTemporal }, () => {
    assert.strictEqual(
      isTemporalZonedDateTime(Temporal.Now.instant()),
      false,
      'Instant'
    );
    assert.strictEqual(
      isTemporalZonedDateTime(Temporal.PlainDate.from('2026-09-16')),
      false,
      'PlainDate'
    );
  });

  it('should reject a Date, and an object that only claims the tag', () => {
    assert.strictEqual(isTemporalZonedDateTime(new Date()), false);
    assert.strictEqual(
      isTemporalZonedDateTime({
        [Symbol.toStringTag]: 'Temporal.ZonedDateTime',
      }),
      false
    );
    assert.strictEqual(isTemporalZonedDateTime(null), false);
  });
});
