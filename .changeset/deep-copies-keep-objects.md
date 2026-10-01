---
'@openinf/util-object': patch
---

Kept functions, dates, maps and class instances intact in a deep copy.
`deepAssign` and `deepMixin` used to copy any object property by property, so a
function, a `Date`, a `Map`, a `RegExp` or a class instance came out as an empty
`{}`. They now copy only plain objects that way and assign everything else by
reference. `deepMerge`, and both of the others where the target already holds an
object, no longer merge a `Date` or a `Map` into the one the target holds, which
left the target's old value in place.
