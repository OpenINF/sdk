---
'@openinf/util-types': major
'@openinf/util-core': patch
---

Added the guards for iteration, section 27.1 of the specification, beyond the
Map and Set iterators that were already here: `isIterable` and `isAsyncIterable`
for the protocols, and `isArrayIterator`, `isStringIterator`,
`isRegExpStringIterator` and `isIteratorHelper` for the iterator objects the
language creates. The last four read a tag and a shape, as the Map and Set
iterator guards do, because the language exposes no probe for them and the only
other way to ask would be to call `next`, which advances the iterator.

**BREAKING:** `isIterator` no longer accepts an object carrying a truthy
`__shouldIterator__` property. Nothing in the language gives that name a
meaning, so an object that merely has it is not an iterator, whatever else it
is.
