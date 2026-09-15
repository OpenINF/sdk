# @openinf/util-object

Object utilities for reading, comparing, and reshaping object contents:
ownership and shape checks such as `hasOwn` and `isPlainObject`, shallow and
deep comparison, cloning, merging, mixing in, and omitting keys.

It also holds the guards for section 20 of the ECMAScript specification,
Fundamental Objects, beyond the language types in `@openinf/util-core`:
`isError` and `isNativeError` for Error objects, `isBooleanObject` and
`isSymbolObject` for the boxed forms, and `isArgumentsObject` for the arguments
exotic object of section 10.4.4.

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
