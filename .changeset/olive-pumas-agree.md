---
'@openinf/util': minor
'@openinf/util-types': major
---

**BREAKING (`@openinf/util-types`):** `isDate` now accepts an Invalid Date,
matching `@openinf/util`'s `isDate` and the wider ecosystem.

Previously the two packages disagreed: `isDate(new Date('nope'))` returned
`true` from `@openinf/util` but `false` from `@openinf/util-types`, which
additionally required the time value not be `NaN`. That is a validity check, not
a type check, and an Invalid Date is still a `Date`. It also contradicted the
API this package mirrors — 40 of its exports correspond to `node:util`'s
`types.*`, and `types.isDate` returns `true` for an Invalid Date, as do
`lodash.isDate` and `@sindresorhus/is`'s `is.date`.

If you relied on the old behavior, use the new `isValidDate` from
`@openinf/util`, which is exactly the previous semantics under an accurate name
— the same split `@sindresorhus/is` draws between `is.date` and `is.validDate`:

```ts
import { isDate, isValidDate } from '@openinf/util';

isDate(new Date('nope')); // ↪ true  (it is a Date)
isValidDate(new Date('nope')); // ↪ false (but not a usable one)
```

**Also breaking (`@openinf/util-types`):** `Arrayish` was an interface with a
numeric index signature and no `length`, unrelated to `@openinf/util`'s
`Arrayish` despite the shared name. Nothing in the package used it. It is now
re-exported from `@openinf/util`, so the name means one thing across the suite.
