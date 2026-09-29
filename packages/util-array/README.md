# @openinf/util-array

Array utilities with no third-party dependencies, following section 23 of the
ECMAScript specification, Indexed Collections: the guards `isArrayHomogenous`
and `isArrayLike`, a guard for each typed array and `isTypedArray` for any of
them, and functions for converting, comparing, searching, and combining arrays.

## Installation

```bash
npm install @openinf/util-array
```

## Usage

```ts
import { arraysEqual, toArray } from '@openinf/util-array';

toArray(1); // ↪ [1]
arraysEqual([1, 2], [1, 2]); // ↪ true
```

## Requirements

TypeScript 6 or newer, which is what these packages are built and tested with,
and a `module` and `moduleResolution` pair that reads an `exports` map:

- `node16` with `node16`
- `nodenext` with `nodenext`
- `commonjs`, `esnext`, or `preserve` with `bundler`

## Documentation

The API reference for `@openinf/util-array` and the other OpenINF packages is on
the [OpenINF portal](https://open.inf.is/docs/sdk/), one version per release.
