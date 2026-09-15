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
