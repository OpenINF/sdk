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

## Requirements

TypeScript 6 or newer, which is what these packages are built and tested with,
and a `module` and `moduleResolution` pair that reads an `exports` map:

- `node16` with `node16`
- `nodenext` with `nodenext`
- `commonjs`, `esnext`, or `preserve` with `bundler`

## Documentation

The API reference for `@openinf/assert` and the other OpenINF packages is on the
[OpenINF portal](https://open.inf.is/docs/sdk/), one version per release.
