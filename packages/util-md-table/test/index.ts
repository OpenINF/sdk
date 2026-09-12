// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { mdTbl2json } from '../src/index';

const sampleTable = [
  '| Col1  | Col2  | Col3  | Col4  |',
  '|:-----:|:-----:|:-----:|:-----:|',
  '| one   | two   | three | four  |',
  '| Fee   | Fie   | Foe   | Fum   |',
].join('\n');

describe(mdTbl2json.name, () => {
  it('should parse a Markdown table into an array of row objects', () => {
    assert.deepStrictEqual(mdTbl2json(sampleTable), [
      { Col1: 'one', Col2: 'two', Col3: 'three', Col4: 'four' },
      { Col1: 'Fee', Col2: 'Fie', Col3: 'Foe', Col4: 'Fum' },
    ]);
  });

  it('should apply cellTransform to every data and header cell', () => {
    const result = mdTbl2json(sampleTable, (v) => v.toLowerCase());
    assert.deepStrictEqual(result, [
      { col1: 'one', col2: 'two', col3: 'three', col4: 'four' },
      { col1: 'fee', col2: 'fie', col3: 'foe', col4: 'fum' },
    ]);
  });

  it('should apply attribCellTransform only to header cells, after cellTransform', () => {
    const result = mdTbl2json(
      sampleTable,
      (v) => v.toLowerCase(),
      (v) => `attrib_${v}`
    );
    assert.deepStrictEqual(result, [
      {
        attrib_col1: 'one',
        attrib_col2: 'two',
        attrib_col3: 'three',
        attrib_col4: 'four',
      },
      {
        attrib_col1: 'fee',
        attrib_col2: 'fie',
        attrib_col3: 'foe',
        attrib_col4: 'fum',
      },
    ]);
  });

  it('should trim whitespace around cell contents', () => {
    const table = ['|  A  |  B  |', '|:---:|:---:|', '|  1  |  2  |'].join(
      '\n'
    );
    assert.deepStrictEqual(mdTbl2json(table), [{ A: '1', B: '2' }]);
  });

  it('should return an empty array for a table with no data rows', () => {
    const table = ['| Col1  | Col2  |', '|:-----:|:-----:|'].join('\n');
    assert.deepStrictEqual(mdTbl2json(table), []);
  });

  it('should omit an attribute rather than set it to undefined when a data row has fewer cells than the header', () => {
    const table = [
      '| Col1  | Col2  | Col3  |',
      '|:-----:|:-----:|:-----:|',
      '| one   | two   |',
    ].join('\n');
    const [row] = mdTbl2json(table);
    assert.deepStrictEqual(row, { Col1: 'one', Col2: 'two' });
    assert.equal(row && 'Col3' in row, false);
  });

  it('should preserve empty cells in their original columns', () => {
    const table = [
      '| First | Middle | Last |',
      '|:------|:-------|:-----|',
      '| one   |        | three |',
    ].join('\n');

    assert.deepStrictEqual(mdTbl2json(table), [
      { First: 'one', Middle: '', Last: 'three' },
    ]);
  });

  it('should not split cells at escaped pipes', () => {
    const table = [
      '| Name | Expression |',
      '|:-----|:-----------|',
      '| OR   | left \\| right |',
    ].join('\n');

    assert.deepStrictEqual(mdTbl2json(table), [
      { Name: 'OR', Expression: 'left \\| right' },
    ]);
  });

  it('should support tables without leading or trailing pipes', () => {
    const table = ['Name | Value', '-----|------', 'one  | two'].join('\n');
    assert.deepStrictEqual(mdTbl2json(table), [{ Name: 'one', Value: 'two' }]);
  });
});
