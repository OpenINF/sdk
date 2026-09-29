# @openinf/util-text

Text helpers for terminal output: color, underline, curly quotes, ellipsis, and
Markdown code spans. The styling helpers degrade to plain text where the
terminal does not support them.

The string guards, such as `isEmptyString` and `isEmail`, are in
[`@openinf/util-string`](https://www.npmjs.com/package/@openinf/util-string).

## Installation

```bash
npm install @openinf/util-text
```

## Usage

```ts
import { blueify, ellipsify } from '@openinf/util-text';

console.log(blueify(ellipsify('Deserializing database tables')));
```

## Requirements

TypeScript 6 or newer, which is what these packages are built and tested with,
and a `module` and `moduleResolution` pair that reads an `exports` map:

- `node16` with `node16`
- `nodenext` with `nodenext`
- `commonjs`, `esnext`, or `preserve` with `bundler`

## Documentation

The API reference for `@openinf/util-text` and the other OpenINF packages is on
the [OpenINF portal](https://open.inf.is/docs/sdk/), one version per release.
