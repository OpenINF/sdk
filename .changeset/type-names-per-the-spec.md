---
'@openinf/util-object': major
'@openinf/util': major
---

The type-name helpers now follow the current ECMAScript specification.

**BREAKING:** `objectTypeNames` lists the tags `Object.prototype.toString`
reports for the objects the specification defines, and nothing else.
`Observable`, `Buffer`, `HTMLElement` and `URL` are gone; no genuine value
reported the first three, and none of the four is part of ECMAScript. Added are
`Arguments`, `Boolean`, `Number`, `String`, `Symbol`, `BigInt`, `Math`, `JSON`,
`Atomics`, `Reflect`, `Module`, the iterator tags such as `Array Iterator`,
`WeakRef`, `FinalizationRegistry`, `Iterator`, `Iterator Helper`,
`DisposableStack`, `AsyncDisposableStack`, and the Temporal tags such as
`Temporal.PlainDate`. `typedArrayTypeNames` gains `Float16Array` and takes the
specification's order.

**BREAKING:** `isOfType` no longer accepts `'null'`. No value has `'null'` as
its `typeof`, so the guard it made could never pass; use `isNull`.

`getObjectType` returns `undefined` for a value that is not an object, and its
documentation now says what it always did: the tag is a claim an object can
forge, so a guard that checks the internal slot is the way to know.

`isPlainObject` no longer depends on the tag. An object is plain when its
prototype is `Object.prototype` or `null` and `Object.prototype.toString`
classifies it as `Object` by its internal slots, the classification in section
20.1.3.6. So an object literal that sets `Symbol.toStringTag` is plain, as are
namespace objects such as `Math`, while an arguments object, an Error, a boxed
Boolean, Number or String, a Date, a RegExp or a module namespace object is not,
even with its prototype replaced. The exceptions are an arguments object, and an
Error in a runtime without `Error.isError`, that has also been given a tag of
its own: no probe can see through both.

The commented-out `ObservableLike` interface, its export line, and an
`HTMLElement` branch that called a function this package never had are removed.
