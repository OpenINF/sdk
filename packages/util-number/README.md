# @openinf/util-number

Guards for ECMAScript numbers, following sections 21.1 to 21.3 of the
specification, Number, BigInt and Math, and the numeric conversions of section
7.1. That covers integers and their sign, the 32-bit ranges `ToInt32` and
`ToUint32` produce, the lengths `ToLength` produces, and the boxed `Number` and
`BigInt` objects.

The number guards narrow to branded types such as `Integer` and `Uint32`, so a
value checked once carries the check with it. There is a guard for each range a
conversion produces, `isInt8` through `isUint32`, one for the safe integers,
`isSafeInteger`, and one for `-0`, `isNegativeZero`, which the operators cannot
tell from `0`.

It depends only on
[`@openinf/util-core`](https://www.npmjs.com/package/@openinf/util-core), which
supplies the `isNumber` and `isBigInt` type guards these refine.

## Installation

```bash
npm install @openinf/util-number
```

## Usage

```ts
import { isInteger, isUint32 } from '@openinf/util-number';

isInteger(4); // ↪ true
isInteger(4.5); // ↪ false
isUint32(-1); // ↪ false
```
