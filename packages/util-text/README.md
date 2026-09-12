# @openinf/util-text

Text helpers for terminal output: color, underline, curly quotes, ellipsis, and
Markdown code spans, alongside a few string predicates. The styling helpers
degrade to plain text where the terminal does not support them.

## Installation

```bash
npm install @openinf/util-text
```

## Usage

```ts
import { blueify, ellipsify } from '@openinf/util-text';

console.log(blueify(ellipsify('Deserializing database tables')));
```
