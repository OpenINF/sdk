// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { inspect } from 'node:util';

import { assert } from '@openinf/assert';
import { curlyQuote } from '@openinf/util-text';

import { _getReceivedSubMsg } from './_get-received-sub-msg';

const classRegExp = /^([A-Z][a-z0-9]*)+$/;
// Sorted by a rough estimate on most frequently used entries.
const kTypes = [
  'string',
  'function',
  'number',
  'object',
  // Accept 'Function' and 'Object' as alternative to the lower cased version.
  'Function',
  'Object',
  'boolean',
  'bigint',
  'symbol',
];

export function _getInvalidTypeSubMsg(
  expected: string | string[],
  actual: unknown
): string {
  if (!Array.isArray(expected)) {
    expected = [String(expected)];
  }

  let msg = '';
  let types = [];
  let instances = [];
  let other = [];

  for (const value of expected) {
    assert(
      typeof value === 'string',
      `All expected entries have to be of type ${curlyQuote('string')}`
    );
    if (kTypes.includes(value)) {
      types.push(value.toLowerCase());
    } else if (classRegExp.test(value)) {
      instances.push(value);
    } else {
      assert(
        value !== 'object',
        `The value ${curlyQuote('object')} should be written as ` +
          `${curlyQuote('Object')}`
      );
      other.push(value);
    }
  }

  // Special handle `object` in case other instances are allowed to outline
  // the differences between each other.
  if (instances.length > 0) {
    const pos = types.indexOf('object');
    if (pos !== -1) {
      types.splice(pos, 1);
      instances.push('Object');
    }
  }

  if (types.length > 0) {
    types = types.map((value) => {
      return curlyQuote(value);
    });
    if (types.length > 2) {
      const last = types.pop();
      msg += `one of type ${types.join(', ')}, or ${inspect(last)}`;
    } else if (types.length === 2) {
      msg += `one of type ${types[0]} or ${types[1]}`;
    } else {
      msg += `of type ${types[0]}`;
    }
    if (instances.length > 0 || other.length > 0) msg += ' or ';
  }

  if (instances.length > 0) {
    instances = instances.map((value) => {
      return curlyQuote(value);
    });
    if (instances.length > 2) {
      const last = instances.pop();
      msg += `an instance of ${instances.join(', ')}, or ${inspect(last)}`;
    } else {
      msg += `an instance of ${instances[0]}`;
      if (instances.length === 2) {
        msg += ` or ${instances[1]}`;
      }
    }
    if (other.length > 0) msg += ' or ';
  }

  if (other.length > 0) {
    other = other.map((value) => {
      return curlyQuote(value);
    });
    if (other.length > 2) {
      const last = other.pop();
      msg += `one of ${other.join(', ')}, or ${inspect(last)}`;
    } else if (other.length === 2) {
      // length === 2 guarantees indices 0 and 1 are present.
      // oxlint-disable-next-line typescript/no-unnecessary-type-assertion -- oxlint-tsgolint doesn't currently honor noUncheckedIndexedAccess; tsc does require this.
      msg += `one of ${other[0]!} or ${other[1]!}`;
    } else {
      // other.length > 0 and not >2 or ===2, so length is exactly 1.
      // oxlint-disable-next-line typescript/no-unnecessary-type-assertion -- oxlint-tsgolint doesn't currently honor noUncheckedIndexedAccess; tsc does require this.
      if (other[0]!.toLowerCase() !== other[0]) msg += 'an ';
      // oxlint-disable-next-line typescript/no-unnecessary-type-assertion -- oxlint-tsgolint doesn't currently honor noUncheckedIndexedAccess; tsc does require this.
      msg += `${other[0]!}`;
    }
  }

  msg += _getReceivedSubMsg(actual);

  return msg;
}
