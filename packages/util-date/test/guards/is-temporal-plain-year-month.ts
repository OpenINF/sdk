// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isTemporalPlainYearMonth } from '../../src/guards/is-temporal-plain-year-month';

// Temporal is finished for ES2027, and a runtime that has it is what the
// positive cases need. Node 26 has it; on an older one they are skipped, and
// the guard is checked for saying false to everything instead.
const hasTemporal = typeof Temporal !== 'undefined';

describe(isTemporalPlainYearMonth.name, () => {
  it('should detect a Temporal.PlainYearMonth', { skip: !hasTemporal }, () => {
    assert.strictEqual(
      isTemporalPlainYearMonth(Temporal.PlainYearMonth.from('2026-09')),
      true
    );
  });

  it('should reject the other Temporal types', { skip: !hasTemporal }, () => {
    assert.strictEqual(
      isTemporalPlainYearMonth(Temporal.Now.instant()),
      false,
      'Instant'
    );
    assert.strictEqual(
      isTemporalPlainYearMonth(Temporal.Now.zonedDateTimeISO()),
      false,
      'ZonedDateTime'
    );
  });

  it('should reject a Date, and an object that only claims the tag', () => {
    assert.strictEqual(isTemporalPlainYearMonth(new Date()), false);
    assert.strictEqual(
      isTemporalPlainYearMonth({
        [Symbol.toStringTag]: 'Temporal.PlainYearMonth',
      }),
      false
    );
    assert.strictEqual(isTemporalPlainYearMonth(null), false);
  });
});
