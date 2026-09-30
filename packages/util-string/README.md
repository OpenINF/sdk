# @openinf/util-string

Guards for ECMAScript strings and regular expressions, following section 22 of
the specification, Text Processing: `isStringObject` for a boxed `String`,
`isRegExp` for a regular expression, and guards for the content of a string,
such as `isEmptyString` and `isStringContaining`.

`isStringObject` and `isRegExp` check the internal slots only the `String` and
`RegExp` constructors give an object, so a look-alike carrying
`Symbol.toStringTag` does not pass. The guard for a string primitive,
`isString`, is in
[`@openinf/util-core`](https://www.npmjs.com/package/@openinf/util-core), the
one package this depends on.

## Installation

```bash
npm install @openinf/util-string
```

## Usage

```ts
import { isRegExp, isStringContaining } from '@openinf/util-string';

isRegExp(/abc/); // ↪ true
isRegExp({ [Symbol.toStringTag]: 'RegExp' }); // ↪ false

const mentionsNode = isStringContaining('Node');
mentionsNode('Node.js'); // ↪ true
```

## Requirements

TypeScript 6 or newer, which is what these packages are built and tested with,
and a `module` and `moduleResolution` pair that reads an `exports` map:

- `node16` with `node16`
- `nodenext` with `nodenext`
- `commonjs`, `esnext`, or `preserve` with `bundler`

## Documentation

The API reference for `@openinf/util-string` and the other OpenINF packages is
on the [OpenINF portal](https://open.inf.is/docs/sdk/), one version per release.
