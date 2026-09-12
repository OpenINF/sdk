# @openinf/util-errors

Error classes modeled on the ones Node.js core throws, so that a caller can
catch by class rather than by matching a message. Each carries the same `code`
its Node.js counterpart does.

## Installation

```bash
npm install @openinf/util-errors
```

## Usage

```ts
import { MissingOptionError } from '@openinf/util-errors';
import { hasOwn } from '@openinf/util-object';

function configure(options: object): void {
  if (!hasOwn(options, 'scope')) {
    throw new MissingOptionError('scope');
  }
}

try {
  configure({});
} catch (error) {
  error instanceof MissingOptionError; // ↪ true
  (error as MissingOptionError).code; // ↪ 'ERR_MISSING_OPTION'
}
```
