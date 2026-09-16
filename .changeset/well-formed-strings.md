---
'@openinf/util-string': minor
'@openinf/util': minor
---

Added `isWellFormedString`, for section 22 of the specification's distinction
between a string and one that can be encoded.

A JavaScript string is a sequence of 16-bit code units, not of characters, so it
can hold a surrogate with no partner. Such a string has no valid UTF-8 encoding,
and whatever has to encode it, `encodeURI` and `TextEncoder` among them, either
throws or quietly substitutes the replacement character. The guard is the
question asked before that happens, and it is `String.prototype.isWellFormed`
captured once, so a later change to the prototype cannot redirect it.

A `String` object is refused, as the other guards in this package refuse one;
only a primitive passes.
