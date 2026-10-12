---
'@openinf/util-core': patch
'@openinf/util': patch
---

`isNull` is now a type predicate, `value is null`, like every other elementary
guard in `@openinf/util-core`. It declared a plain `boolean`, so it narrowed
nothing, and it could not be passed to `and` or `or`, which take guards:
`or(isNull, isUndefined)` did not compile.
