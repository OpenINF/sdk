---
'@openinf/util': major
---

**BREAKING:** removed the branded type aliases for types that JavaScript and
TypeScript already distinguish: `Array`, `BigInt`, `Boolean`, `Buffer`, `Date`,
`Defined`, `Error`, `Function`, `Iterator`, `NonNullish`, `Null`, `Number`,
`Object`, `String`, `Symbol`, and `Undefined`. Use the built-in types directly —
`string` instead of `String`, `Date` instead of `Date`, `NonNullable<T>` instead
of `Defined<T>`/`NonNullish<T>`.

These wrapped their underlying type in a phantom tag
(`string & { __String__: void }`), which bought nothing: primitives are already
nominal — nothing else is assignable to `string` — and built-in object types are
impractical to impersonate, with the runtime guard rejecting impostors
regardless. What the brands did do is make ordinary values unusable.
`isArgValidBuffer` could not be called with a real `Buffer`, because
`Buffer.from('x')` lacked the phantom `__Buffer__` property. Guards now narrow
to the real types, so values flow through normally.

`Primitive`, `Falsy`, and `Nullish` are kept but no longer branded; they are
plain unions with no built-in equivalent.

The numeric refinement brands are unchanged and still branded, because they
express constraints `number` cannot: `Integer`, `Int32`, `Uint32`, `Positive`,
`Negative`, `PositiveInteger`, `NegativeInteger`, `FiniteNumber`, and `NaN`.
`isInt32` now narrows to `Int32` rather than `number`, matching the rest of that
family.

`Tag` and `Tagged` remain exported, and their documentation now explains when
branding is worth reaching for — values sharing a representation but not a
meaning (`UserId` vs `PostId`), values carrying a proof obligation
(`SanitizedHtml`, `AbsolutePath`) — and when it is not.

Also fixed: `isNullish`, `isObject`, and `isSymbol` declared a `boolean` return
type, so they never narrowed anything. They are now proper type predicates.
