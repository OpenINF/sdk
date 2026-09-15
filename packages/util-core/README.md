# @openinf/util-core

The shared vocabulary the rest of the SDK is written in: the `Guard` and
`Validator` types, `Tagged`, `Comparable`, `Equatable`, and one predicate per
elementary type test.

It has no dependencies, so a package needing only that vocabulary does not have
to depend on all of
[`@openinf/util`](https://www.npmjs.com/package/@openinf/util). That is also
what lets the rest of the workspace layer cleanly on top of it.

## Installation

```bash
npm install @openinf/util-core
```

## Usage

```ts
import { isString, type Guard } from '@openinf/util-core';

isString('hi'); // ↪ true
```

## What belongs here

The parts of the ECMAScript specification that every other package is built on,
and nothing else:

1. **The language types, section 6.** One guard per type: `isUndefined`,
   `isNull`, `isBoolean`, `isString`, `isSymbol`, `isNumber`, `isBigInt` and
   `isObject`. Also the unions over them, `isNullish`, `isNonNullish`,
   `isDefined`, `isPrimitive` and `isObjectLike`, and the types that name them,
   such as `Primitive` and `Nullish`.
2. **Testing and comparison, section 7.2.** `isArray` for IsArray and
   `isFunction` for IsCallable, with what every guard is made from: `Guard`,
   `Validator`, `HasExpectation`, `and`, `or`, `hasInterface`, `isAny` and
   `isUnknown`.
3. **The shared vocabulary types.** `Tag`, `Tagged`, `Comparable`, `Equatable`,
   `ComparisonResult`, `Narrowable`, `AnyFunction`, `AnyConstructor`,
   `AnyObject` and `Arrayish`.

A guard about a particular kind of built-in object belongs with that object
instead. An integer range, a `Date` and a `Map` each have a chapter of the
specification, and a package that follows it. That is what keeps this package
free of dependencies: nothing here needs anything more specific than itself.

Most consumers should reach for
[`@openinf/util`](https://www.npmjs.com/package/@openinf/util), which re-exports
everything here alongside its full set of type guards.
