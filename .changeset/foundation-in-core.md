---
'@openinf/util-core': minor
'@openinf/util': major
'@openinf/util-object': major
'@openinf/util-types': major
---

`@openinf/util-core` now holds the language types and the testing operations of
ECMAScript sections 6 and 7.2, which every other package builds on. `and`, `or`,
`hasInterface`, `isAny`, `isUnknown`, `isDefined`, `isPrimitive` and
`isObjectLike` move into it. `@openinf/util` still re-exports all of them, so
importing from there is unchanged.

**BREAKING:** `@openinf/util-object` no longer exports `isObjectLike` or
`ObjectLike`; import them from `@openinf/util-core` or `@openinf/util`. It still
exports the `AnyFunction`, `AnyConstructor`, `AnyObject` and `Primitive` types,
now as re-exports of the one definition in `@openinf/util-core`.

**BREAKING:** `@openinf/util-types` no longer exports `hasInterface`, and no
longer depends on `@openinf/util-object`. Its `AnyFunction` and `AnyConstructor`
types are re-exports of the ones in `@openinf/util-core` rather than copies.

`hasInterface` accepts a function that has the required properties. The copy in
`@openinf/util` refused every function, and the copy in `@openinf/util-types`
accepted them; a function is an object, and a class with static members
implements an interface as well as any other object does, so the one that
remains accepts them.

`@openinf/util` re-exports the type-name helpers, `getObjectType`,
`isObjectOfType`, `isOfType` and the type-name lists, from
`@openinf/util-object` instead of keeping an identical copy of them.
