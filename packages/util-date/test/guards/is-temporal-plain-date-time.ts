// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isTemporalPlainDateTime } from '../../src/guards/is-temporal-plain-date-time';

// Temporal is finished for ES2027, and a runtime that has it is what the
// positive cases need. Node 26 has it; on an older one they are skipped, and
// the guard is checked for saying false to everything instead.
const hasTemporal = typeof Temporal !== 'undefined';

describe(isTemporalPlainDateTime.name, () => {
  it('should detect a Temporal.PlainDateTime', { skip: !hasTemporal }, () => {
    assert.strictEqual(
      isTemporalPlainDateTime(Temporal.PlainDateTime.from('2026-09-16T12:30')),
      true
    );
  });

  it('should reject the other Temporal types', { skip: !hasTemporal }, () => {
    assert.strictEqual(
      isTemporalPlainDateTime(Temporal.Now.instant()),
      false,
      'Instant'
    );
    assert.strictEqual(
      isTemporalPlainDateTime(Temporal.Now.zonedDateTimeISO()),
      false,
      'ZonedDateTime'
    );
  });

  it('should reject a Date, and an object that only claims the tag', () => {
    assert.strictEqual(isTemporalPlainDateTime(new Date()), false);
    assert.strictEqual(
      isTemporalPlainDateTime({
        [Symbol.toStringTag]: 'Temporal.PlainDateTime',
      }),
      false
    );
    assert.strictEqual(isTemporalPlainDateTime(null), false);
  });
});
