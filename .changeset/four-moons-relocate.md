---
'@openinf/util-types': major
---

**BREAKING:** relocated several functions out of this package to keep its scope
to genuinely type-related checks:

- `isArray(value)` has moved to `@openinf/util`.
- `isObject(value)` has moved to `@openinf/util`.
- `toArray(value)` has moved to `@openinf/util-array`.
- `toString(value)` is now internal/private (it was never a type check, and its
  behavior didn't warrant a public export).

Update imports to pull these from their new package instead.
