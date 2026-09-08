---
'@openinf/util-core': minor
'@openinf/util': major
'@openinf/assert': major
'@openinf/util-array': major
'@openinf/util-errors': major
'@openinf/util-object': major
'@openinf/util-text': major
'@openinf/util-types': major
---

Added `@openinf/util-core`, a dependency-free package holding the foundation the
rest of the SDK is built on: the `Guard`, `Validator`, `Tagged`, `Tag`,
`Comparable`, `Equatable`, `ComparisonResult`, `Narrowable`, `AnyFunction`,
`AnyConstructor`, `AnyObject`, `Arrayish`, and `HasExpectation` types, plus the
six most primitive predicates — `isArray`, `isFunction`, `isNonNullish`,
`isNullish`, `isObject`, and `isString`.

Previously every package depended on `@openinf/util` for that vocabulary.
`@openinf/util-object` imported _zero_ runtime code from it; the rest needed one
to three one-line predicates. Because `util` sat at the root of the graph,
nothing it needed could depend on it — so `util` carried private copies of four
error classes purely to have something to throw, and their messages diverged
from the real ones in `@openinf/util-errors`.

**BREAKING:** `@openinf/util` no longer defines those types and predicates; it
re-exports them from `@openinf/util-core`. Importing them from `@openinf/util`
continues to work unchanged. Packages that only need the vocabulary should now
depend on `@openinf/util-core` directly.

Consequences of the relayering:

- `@openinf/util`'s validators throw the real `@openinf/util-errors` classes, so
  `err instanceof InvalidArgTypeError` now works against errors thrown by
  `isArgValidString` and friends. It previously returned `false`, since the
  class was a private lookalike.
- `isArgCountValid` reports the canonical `InvalidArgsNumberError` message
  instead of a bespoke one.
- `assertValue` is now a single implementation, owned by `@openinf/assert` and
  re-exported by `@openinf/util`. It gains lazy-guard support, caller-supplied
  expectations, and truncation of long values.
- Error messages use the same curly-quote style everywhere, including
  `assertValue`, which previously used straight quotes.
