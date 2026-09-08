---
'@openinf/util': minor
'@openinf/assert': minor
'@openinf/util-types': minor
---

Exported functionality that already existed and was tested but was unreachable,
because it was missing from the package's barrel module. No behavior changed;
these are additions to the public API.

**`@openinf/util`** (+15) — `assertIsDefined`; the guards `isFalsy` and
`isIterator` (plus the `Falsy` and `Iterator` types); the helpers
`generateArgumentErrorMessage` and `isNode`; and the argument validators
`isArgCountValid`, `isArgValidArray`, `isArgValidBoolean`, `isArgValidBuffer`,
`isArgValidFunction`, `isArgValidInt32`, `isArgValidNumber`, `isArgValidObject`,
`isArgValidString`, and `isArgValidUint32`. Most of these were sitting commented
out in `src/index.ts`.

**`@openinf/assert`** (+2) — `copyError` and `generateStackTrace`.

**`@openinf/util-types`** (+7) — `type` (returns a lowercase type name for any
value, including primitives, where `getObjectType` returns `undefined` for
those); `getExpectation`; `maybeUnboxNumber`; and the validators
`validateCallback`, `validateInteger`, `validateIntegerRange`, and
`validateOneOf`.

`isNode` also now guards its `process` access, so importing `@openinf/util` in a
non-Node environment yields `false` rather than throwing a `ReferenceError` for
the missing global.
