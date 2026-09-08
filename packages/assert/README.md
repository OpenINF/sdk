# @openinf/assert

Runtime assertion and comparison guard utilities.

---

This module provides `assert`-style functions that throw a descriptive
`AssertionError` when an expression, value, or comparison doesn't hold, plus the
underlying `is*` comparison guards (`isEqualTo`, `isGreaterThan`,
`isComparable`, etc.) they're built on.

## Installation

`@openinf/assert` runs on Node.js and is available via `npm`.

```shell
npm install @openinf/assert
```

## Usage

```ts
import { assert, assertIsDefined } from '@openinf/assert';

assertIsDefined(value, 'value must be defined');
assert(value > 0, 'value must be positive');
```

## API Reference

Type-aware API documentation for every `@openinf` package is generated with
[TypeDoc](https://typedoc.org). To build and browse it locally:

```shell
pnpm docs:build   # writes a merged, multi-package site to docs/
pnpm docs:serve   # serves it
```
