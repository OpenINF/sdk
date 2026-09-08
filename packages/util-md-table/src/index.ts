// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

export type CellTransform = (value: string) => string;

/**
 * Parses a Markdown table into an array of row objects keyed by header cell.
 * @param mdTbl A markdown table as a string.
 * @param cellTransform A function run on the contents of each cell.
 * @param attribCellTransform A transform only for attribute (header) cells.
 * @returns An array of objects, one per data row.
 */
export function mdTbl2json(
  mdTbl: string,
  cellTransform?: CellTransform,
  attribCellTransform?: CellTransform
): Record<string, string>[] {
  const allRows = mdTbl
    .split('\n')
    .map((row) => row.trim())
    .filter((row) => row && row.length);

  let allAttributes: string[] = [];
  const jsonTbl: Record<string, string>[] = [];

  allRows.forEach((row, index) => {
    if (index === 0) {
      // These become the keys in each object of the array of objects.
      const cells = row
        .split('|')
        .map((hd) => hd.trim())
        .filter((hd) => hd && hd.length);

      allAttributes = cells.map((value) => {
        const cell = cellTransform ? cellTransform(value) : value;
        return attribCellTransform ? attribCellTransform(cell) : cell;
      });
    } else if (index > 1) {
      let cells = row
        .split('|')
        .map((hd) => hd.trim())
        .filter((hd) => hd && hd.length);

      cells = cells.map((value) =>
        cellTransform ? cellTransform(value) : value
      );

      const cellsMap = new Map<string, string>();

      allAttributes.forEach((value, i) => {
        // A row with fewer cells than the header (e.g. from a filtered-out
        // empty cell) should leave that attribute unset rather than write
        // `undefined` into a Record<string, string>.
        const cell = cells[i];
        // oxlint-disable-next-line typescript/no-unnecessary-condition -- oxlint-tsgolint doesn't currently honor noUncheckedIndexedAccess; cell can genuinely be undefined here.
        if (cell !== undefined) {
          cellsMap.set(value, cell);
        }
      });

      jsonTbl.push(Object.fromEntries(cellsMap));
    }
  });

  return jsonTbl;
}
