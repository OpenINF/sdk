# @openinf/util-array

Array utilities with no third-party dependencies: the type guards
`isArrayHomogenous` and `isArrayLike`, and functions for converting, comparing,
searching, and combining arrays.

## Installation

```sh
npm install @openinf/util-array
```

## Usage

```ts
import { arraysEqual, toArray } from '@openinf/util-array';

toArray(1); // ↪ [1]
arraysEqual([1, 2], [1, 2]); // ↪ true
```
