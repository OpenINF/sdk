---
'@openinf/util-core': patch
---

An `arguments` object given its own `Symbol.toStringTag` is no longer taken for
a plain object, and `isTemporalZonedDateTime` reads a getter that every
implementation of `Temporal.ZonedDateTime` has, so it recognizes one in runtimes
that ship Temporal before `timeZoneId`.
