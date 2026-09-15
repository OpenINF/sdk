---
'@openinf/util-date': minor
'@openinf/util': major
'@openinf/util-types': major
---

Added `@openinf/util-date`, the guards for ECMAScript dates, following section
21.4 of the specification: `isDate` and `isValidDate`. It depends only on
`@openinf/util-core`. `@openinf/util` re-exports both, and `@openinf/util-types`
re-exports `isDate`, which Node's `util.types` includes.

**BREAKING:** `isDate` from `@openinf/util` checks for a real `Date`. It was a
second implementation that compared `Object.prototype.toString`, so any object
with `Symbol.toStringTag` set to `'Date'` passed. The one that remains is the
brand check `@openinf/util-types` already used, which refuses that object and
one that merely inherits from `Date.prototype`.

`isValidDate` reads a Date's time value through the `Date.prototype.getTime`
captured when the package loads, so an Invalid Date with its own `getTime`
returning a number no longer passes.
