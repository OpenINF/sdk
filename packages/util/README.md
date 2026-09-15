# @openinf/util

Type guards, assertion helpers, and function argument validators covering every
ECMAScript primitive.

The guards are not ordinary type-check shorthands. Each carries an `expectation`
describing what it tests, which the assertion helpers and argument validators
read to build their error messages, so a guard doubles as the specification for
its own check.

## Installation

```bash
npm install @openinf/util
```

## Usage

```ts
import { and, isInteger, isPositive, isValidDate } from '@openinf/util';

isValidDate(new Date('nope')); // ↪ false — a Date, but not a usable one
isInteger(3); // ↪ true

// Guards compose, and the combined guard keeps a combined expectation.
const isPositiveInteger = and(isInteger, isPositive);
isPositiveInteger(3); // ↪ true
```

Argument validators throw the corresponding `@openinf/util-errors` exception, so
a caller can catch by class:

```ts
import { validateString } from '@openinf/util';
import { InvalidArgTypeError } from '@openinf/util-errors';

try {
  validateString(42, 'name');
} catch (error) {
  error instanceof InvalidArgTypeError; // ↪ true
}
```

## Relationship to the other packages

This package re-exports two others in full, so importing from either name gives
you the same function:

- [`@openinf/util-core`](https://www.npmjs.com/package/@openinf/util-core) holds
  the shared vocabulary every `@openinf` package builds on: the `Guard` and
  `Validator` types, `Tagged`, `Comparable`, `Equatable`, and the language type
  guards such as `isString` and `isNumber`. It has no dependencies.
- [`@openinf/util-number`](https://www.npmjs.com/package/@openinf/util-number)
  holds the number guards: `isInteger`, `isInt32`, `isUint32`, `isLength`,
  `isNaN` and the sign checks.

Depend on one of those directly if it is all you need; depend on this package
for the full set of guards, validators, and helpers.
