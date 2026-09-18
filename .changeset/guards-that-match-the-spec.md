---
'@openinf/util': patch
'@openinf/util-object': patch
'@openinf/util-string': patch
---

`isFalsy` performs ToBoolean, section 7.1.2 of the specification, rather than
comparing against a list of the falsy values. The list left one out: an object
with an `[[IsHTMLDDA]]` internal slot, which Annex B.3.6 gives to
`document.all`, is falsy, and nothing about it is observable except this.

`isError` says what it accepts: an object the language, a host, or another realm
treats as an error, including one made by `Object.create(Error.prototype)`. For
the narrower question, whether a value has the `[[ErrorData]]` internal slot,
`isNativeError` is the guard, and its documentation now points there.

`isRegExp` says that it asks for the `[[RegExpMatcher]]` internal slot, as
`node:util`'s `types.isRegExp` does, and that this is not the specification's
IsRegExp operation, section 7.2.6, which the string methods use and which counts
any object carrying `Symbol.match`.

`type` no longer describes its answer as the internal `[[Class]]`, a slot the
language dropped in ES2015. It reports what the internal slots say, so an object
that only sets `Symbol.toStringTag` does not change its answer.
