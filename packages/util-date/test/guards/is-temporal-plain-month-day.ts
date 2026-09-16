// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isTemporalPlainMonthDay } from '../../src/guards/is-temporal-plain-month-day';

// Temporal is finished for ES2027, and a runtime that has it is what the
// positive cases need. Node 26 has it; on an older one they are skipped, and
// the guard is checked for saying false to everything instead.
const hasTemporal = typeof Temporal !== 'undefined';

describe(isTemporalPlainMonthDay.name, () => {
  it('should detect a Temporal.PlainMonthDay', { skip: !hasTemporal }, () => {
    assert.strictEqual(
      isTemporalPlainMonthDay(Temporal.PlainMonthDay.from('09-16')),
      true
    );
  });

  it('should reject the other Temporal types', { skip: !hasTemporal }, () => {
    assert.strictEqual(
      isTemporalPlainMonthDay(Temporal.Now.instant()),
      false,
      'Instant'
    );
    assert.strictEqual(
      isTemporalPlainMonthDay(Temporal.Now.zonedDateTimeISO()),
      false,
      'ZonedDateTime'
    );
  });

  it('should reject a Date, and an object that only claims the tag', () => {
    assert.strictEqual(isTemporalPlainMonthDay(new Date()), false);
    assert.strictEqual(
      isTemporalPlainMonthDay({
        [Symbol.toStringTag]: 'Temporal.PlainMonthDay',
      }),
      false
    );
    assert.strictEqual(isTemporalPlainMonthDay(null), false);
  });
});
