---
'@openinf/util-types': minor
'@openinf/util-core': patch
---

Added the guards for section 26 of the specification, Managing Memory, and for
the resource management of sections 27.3 and 27.4: `isWeakRef`,
`isFinalizationRegistry`, `isDisposableStack` and `isAsyncDisposableStack`.

Each asks for the internal slots of its own type through a probe that leaves the
value as it found it: `deref` reports a `WeakRef`'s target without clearing it,
`unregister` with a symbol nothing registered returns `false` and removes no
registration, and the `disposed` getters dispose of nothing. An object carrying
the matching `Symbol.toStringTag` is refused, and in a runtime without the type
every check says `false`.
