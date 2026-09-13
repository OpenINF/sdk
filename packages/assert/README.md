# @openinf/assert

Runtime assertions that throw a descriptive `AssertionError` when an expression,
value, or comparison does not hold, together with the `is*` comparison guards
they are built on.

## Installation

```bash
npm install @openinf/assert
```

## Usage

```ts
import { assert, assertIsDefined } from '@openinf/assert';

const port: number | undefined = Number(process.env['PORT']) || undefined;

assertIsDefined(port, 'PORT must be set');
assert(port > 0, 'PORT must be positive');

// Both narrow, so `port` is a number from here on.
port.toFixed();
```
