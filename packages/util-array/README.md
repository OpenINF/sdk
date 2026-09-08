# @openinf/util-array

Common JavaScript Array type-related utilities.

---

This module provides small, dependency-free helpers for working with arrays:
type guards (`isArrayHomogenous`, `isArrayLike`), and functions for converting,
comparing, searching, and combining arrays (`toArray`, `arraysEqual`, `grep`,
`merge`, and more).

## Installation

`@openinf/util-array` runs on Node.js and is available via `npm`.

```shell
npm install @openinf/util-array
```

## Usage

```ts
import { arraysEqual, toArray } from '@openinf/util-array';

toArray(1); // [1]
arraysEqual([1, 2], [1, 2]); // true
```

## API Reference

Type-aware API documentation for every `@openinf` package is generated with
[TypeDoc](https://typedoc.org). To build and browse it locally:

```shell
pnpm docs:build   # writes a merged, multi-package site to docs/
pnpm docs:serve   # serves it
```
