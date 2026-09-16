// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isTemporalPlainTime } from '../../src/guards/is-temporal-plain-time';

// Temporal is finished for ES2027, and a runtime that has it is what the
// positive cases need. Node 26 has it; on an older one they are skipped, and
// the guard is checked for saying false to everything instead.
const hasTemporal = typeof Temporal !== 'undefined';

describe(isTemporalPlainTime.name, () => {
  it('should detect a Temporal.PlainTime', { skip: !hasTemporal }, () => {
    assert.strictEqual(
      isTemporalPlainTime(Temporal.PlainTime.from('12:30')),
      true
    );
  });

  it('should reject the other Temporal types', { skip: !hasTemporal }, () => {
    assert.strictEqual(
      isTemporalPlainTime(Temporal.Now.instant()),
      false,
      'Instant'
    );
    assert.strictEqual(
      isTemporalPlainTime(Temporal.Now.zonedDateTimeISO()),
      false,
      'ZonedDateTime'
    );
  });

  it('should reject a Date, and an object that only claims the tag', () => {
    assert.strictEqual(isTemporalPlainTime(new Date()), false);
    assert.strictEqual(
      isTemporalPlainTime({ [Symbol.toStringTag]: 'Temporal.PlainTime' }),
      false
    );
    assert.strictEqual(isTemporalPlainTime(null), false);
  });
});
