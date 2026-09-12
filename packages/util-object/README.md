# @openinf/util-object

Object utilities for reading, comparing, and reshaping object contents:
ownership and shape checks such as `hasOwn` and `isPlainObject`, shallow and
deep comparison, cloning, merging, mixing in, and omitting keys.

## Installation

```bash
npm install @openinf/util-object
```

## Usage

```ts
import { hasOwn } from '@openinf/util-object';

const value: object = JSON.parse('{ "id": 7 }');

hasOwn(value, 'id'); // ↪ true

if (hasOwn(value, 'id')) {
  value.id; // ↪ narrowed to `unknown`, no cast needed
}
```
