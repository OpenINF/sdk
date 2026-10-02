---
'@openinf/assert': major
'@openinf/util-array': major
'@openinf/util-core': major
'@openinf/util-date': major
'@openinf/util-string': major
'@openinf/util-types': major
---

Keep validation results from promising types the checks do not establish.
`isArray` now narrows to `unknown[]`; check elements before using a more
specific array type. `isArrayLike` likewise leaves its elements unknown, and
`map` now describes its one-level-flattened result. `isIterator` and the
`isEqualTo`, `isIdenticalTo`, and `isDeepEqualTo` validators return booleans
without narrowing because their checks do not establish the iterator's method
types or an equal value's type. `isValidDate` and `isWellFormedString` narrow to
the new `ValidDate` and `WellFormedString` brands, preserving invalid dates and
strings in false branches.

`hasInterface` accepts finite property interfaces, requires each property's
exact guard, and rejects call signatures, constructors, index signatures, and
unions. Its result requires every listed property even when it is optional in
the input interface, matching the existing runtime presence check.
