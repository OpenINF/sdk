# @openinf/util-array

Array utilities with no third-party dependencies, following section 23 of the
ECMAScript specification, Indexed Collections: the guard `isArrayLike`, a guard
for each typed array and `isTypedArray` for any of them, and functions for
converting, comparing (`arraysEqual`, `arrayIsHomogeneous`), searching, and
combining arrays.

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

TypeScript 6 or newer, which CI type-checks the published declarations with, and
a `module` and `moduleResolution` pair that reads an `exports` map:

- `node16` with `node16`
- `nodenext` with `nodenext`
- `commonjs`, `esnext`, or `preserve` with `bundler`

The declarations name `Float16Array`, so `lib` needs `es2025` or later, or
`@types/node` 24 or later installed and `node` in `types`. Node.js has
`Float16Array` from release 24; on an earlier one, `isFloat16Array` returns
`false` for everything.

## Documentation

The API reference for `@openinf/util-array` and the other OpenINF packages is on
the [OpenINF portal](https://open.inf.is/docs/sdk/), one version per release.
