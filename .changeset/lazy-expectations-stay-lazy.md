---
'@openinf/util-types': patch
---

Stopped `getExpectation` from overwriting a lazy expectation with its first
result. It threw a `TypeError` for a frozen validator, and a validator whose
expectation describes a value that changes kept describing the old one. It now
calls the expectation each time and leaves the validator alone.
