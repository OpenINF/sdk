# @openinf/util-date

Guards for ECMAScript dates, following section 21.4 of the specification: the
`Date` object, and the `Temporal` objects finished for ES2027.

`isDate` checks for a real `Date`, one with the internal time value only the
`Date` constructor gives an object, so a look-alike carrying
`Symbol.toStringTag` does not pass. `isValidDate` also requires that time value
to be a number, which an Invalid Date's is not.

There is a guard for each Temporal type: `isTemporalInstant`,
`isTemporalZonedDateTime`, `isTemporalPlainDate`, `isTemporalPlainTime`,
`isTemporalPlainDateTime`, `isTemporalPlainYearMonth`, `isTemporalPlainMonthDay`
and `isTemporalDuration`. Each asks for the internal slots of its own type, so
no other Temporal type passes, and in a runtime without `Temporal` they all say
`false`.

It depends only on
[`@openinf/util-core`](https://www.npmjs.com/package/@openinf/util-core).

## Installation

```bash
npm install @openinf/util-date
```

## Usage

```ts
import { isDate, isTemporalInstant, isValidDate } from '@openinf/util-date';

isDate(new Date('nope')); // ↪ true
isValidDate(new Date('nope')); // ↪ false
isDate({ [Symbol.toStringTag]: 'Date' }); // ↪ false
isTemporalInstant(new Date()); // ↪ false
```
