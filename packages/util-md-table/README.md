# @openinf/util-md-table

Reads a Markdown table into an array of objects, one per row, keyed by the
table's column headings. An optional transform runs over every cell on the way.

## Installation

```sh
npm install @openinf/util-md-table
```

## Usage

```ts
import { mdTbl2json } from '@openinf/util-md-table';

const table = [
  '| Col1  | Col2  | Col3  | Col4  |',
  '|:-----:|:-----:|:-----:|:-----:|',
  '| one   | two   | three | four  |',
  '| Fee   | Fie   | Foe   | Fum   |',
].join('\n');

console.log(mdTbl2json(table, (value) => value.toLowerCase()));
```

```console
[
  { col1: 'one', col2: 'two', col3: 'three', col4: 'four' },
  { col1: 'fee', col2: 'fie', col3: 'foe', col4: 'fum' }
]
```
