---
'@openinf/util-date': minor
'@openinf/util-core': patch
'@openinf/util': patch
---

Added a guard for each Temporal type, finished for ES2027: `isTemporalInstant`,
`isTemporalZonedDateTime`, `isTemporalPlainDate`, `isTemporalPlainTime`,
`isTemporalPlainDateTime`, `isTemporalPlainYearMonth`, `isTemporalPlainMonthDay`
and `isTemporalDuration`. `@openinf/util` re-exports them with the rest of
`@openinf/util-date`.

Each asks for the internal slots of its own type, through a getter captured from
that type's prototype, which throws without them. So no other Temporal type
passes, and neither does an object carrying the matching `Symbol.toStringTag`.
In a runtime without `Temporal`, every one says `false`.
