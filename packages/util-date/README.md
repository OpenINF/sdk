# @openinf/util-date

Guards for ECMAScript dates: the `Date` object of section 21.4 of the
specification, and the `Temporal` objects finished for ES2027.

`isDate` checks for a real `Date`, one with the internal time value only the
`Date` constructor gives an object, so a look-alike carrying
`Symbol.toStringTag` does not pass. `isValidDate` also requires that time value
not be `NaN`, which an Invalid Date's is.

There is a guard for each Temporal type: `isTemporalInstant`,
`isTemporalZonedDateTime`, `isTemporalPlainDate`, `isTemporalPlainTime`,
`isTemporalPlainDateTime`, `isTemporalPlainYearMonth`, `isTemporalPlainMonthDay`
and `isTemporalDuration`. Each asks for the internal slots of its own type, so
no other Temporal type passes, and in a runtime without `Temporal` they all say
`false`.

The probe is captured from the realm's `Temporal` when the module loads, as the
other brand checks are captured from their intrinsics. A polyfill installed
before that is the realm's `Temporal`, and these guards answer for its objects:
there is no way from inside the language to reach a `Temporal` behind one.

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

## Requirements

TypeScript 6 or newer, which CI type-checks the published declarations with, and
a `module` and `moduleResolution` pair that reads an `exports` map:

- `node16` with `node16`
- `nodenext` with `nodenext`
- `commonjs`, `esnext`, or `preserve` with `bundler`

The declarations name `Temporal`, which TypeScript 6 does not load by default,
so `lib` needs `esnext.temporal`, or all of `esnext`; otherwise the compiler
reports `Cannot find namespace 'Temporal'` from inside the package, whichever
guard you import.

## Documentation

The API reference for `@openinf/util-date` and the other OpenINF packages is on
the [OpenINF portal](https://open.inf.is/docs/sdk/), one version per release.
