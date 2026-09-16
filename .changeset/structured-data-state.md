---
'@openinf/util-types': minor
---

Added the guards for the parts of section 25, Structured Data, that had none.
`isArrayBuffer` already answers what a value is; these answer what state it is
in: `isDetachedArrayBuffer` for a buffer whose data `transfer` or a transferring
`structuredClone` has taken away, `isResizableArrayBuffer` for one constructed
with a `maxByteLength`, and `isGrowableSharedArrayBuffer` for the shared
buffer's version of that, which the specification calls growable because a
shared buffer grows and never shrinks.

`isRawJSON` detects what `JSON.rawJSON` returns, the value `JSON.stringify`
writes out verbatim rather than serializing, so a number too large for a double
can survive a round trip.

Each reads a captured accessor that needs the internal slot its own type has, so
an `ArrayBuffer` and a `SharedArrayBuffer` are never confused for one another
and an object carrying the tag or a same-named property does not pass. Reading
state changes none of it. In a runtime lacking any of these, its guard says
`false`.
