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

Two things, and nothing else:

1. **The shared vocabulary types** — `Guard`, `Validator`, `HasExpectation`,
   `Tag`, `Tagged`, `Comparable`, `Equatable`, `ComparisonResult`, `Narrowable`,
   `AnyFunction`, `AnyConstructor`, `AnyObject`, `Arrayish`.
2. **One predicate per elementary type test** — a guard whose implementation is
   a single `typeof` comparison, `Array.isArray`, or a `null`/`undefined`
   comparison: `isString`, `isNumber`, `isBoolean`, `isBigInt`, `isSymbol`,
   `isUndefined`, `isNull`, `isFunction`, `isObject`, `isArray`, `isNullish`,
   `isNonNullish`.

Anything composite belongs in `@openinf/util`, even when it looks primitive.
`isPrimitive` is a union over this set rather than a single test, and
`isInteger` refines `number` rather than identifying a type, so both live there.

The rule matters because the alternative is a boundary drawn by whatever happens
to be imported across packages today, which shifts every time a new call site
appears.

Most consumers should reach for
[`@openinf/util`](https://www.npmjs.com/package/@openinf/util), which re-exports
everything here alongside its full set of type guards.
