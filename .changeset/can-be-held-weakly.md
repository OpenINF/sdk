---
'@openinf/util-types': minor
---

Added `canBeHeldWeakly`, the CanBeHeldWeakly operation of section 9.13 of the
specification. It answers whether `WeakRef`, `WeakMap`, `WeakSet` and
`FinalizationRegistry` will take a value rather than throw a `TypeError`, which
is the question to ask before handing one to them.

Every object qualifies, functions among them. So does a symbol, unless it is one
`Symbol.for` put in the global registry, which lives as long as the realm and so
could never be collected. A well-known symbol such as `Symbol.iterator` is not
registered, and does qualify. Nothing else does.

This completes the section 26 guards, which say what a weak collection _is_,
with the one that says what it will _hold_.
