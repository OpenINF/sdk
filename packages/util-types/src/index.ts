// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// guards

export * from './guards/is-any-array-buffer';
export * from './guards/is-array-buffer';
export * from './guards/is-array-buffer-view';
export * from './guards/is-array-iterator';
export * from './guards/is-async-disposable-stack';
export * from './guards/is-async-function';
export * from './guards/is-async-generator';
export * from './guards/is-async-generator-function';
export * from './guards/is-async-iterable';
export * from './guards/is-boxed-primitive';
export * from './guards/is-data-view';
export * from './guards/is-disposable-stack';
export * from './guards/is-external';
export * from './guards/is-finalization-registry';
export * from './guards/is-generator-function';
export * from './guards/is-generator-object';
export * from './guards/is-iterable';
export * from './guards/is-iterator';
export * from './guards/is-iterator-helper';
export * from './guards/is-map';
export * from './guards/is-map-iterator';
export * from './guards/is-module-namespace-object';
export * from './guards/is-promise';
export * from './guards/is-proxy';
export * from './guards/is-reg-exp-string-iterator';
export * from './guards/is-set';
export * from './guards/is-set-iterator';
export * from './guards/is-shared-array-buffer';
export * from './guards/is-string-iterator';
export * from './guards/is-weak-map';
export * from './guards/is-weak-ref';
export * from './guards/is-weak-set';
export * from './guards/is-web-assembly-compiled-module';

// helpers
export * from './get-expectation';

// Node's util.types checks these Fundamental Objects, section 20, and the
// arguments exotic object too. They live in @openinf/util-object; this package
// re-exports them so it stays a drop-in.
export {
  isArgumentsObject,
  isBooleanObject,
  isNativeError,
  isSymbolObject,
} from '@openinf/util-object';

// Node's util.types checks the typed arrays too. They are §23.2, and live in
// @openinf/util-array; this package re-exports them so it stays a drop-in.
export {
  isBigInt64Array,
  isBigUint64Array,
  isFloat16Array,
  isFloat32Array,
  isFloat64Array,
  isInt16Array,
  isInt32Array,
  isInt8Array,
  isTypedArray,
  isUint16Array,
  isUint32Array,
  isUint8Array,
  isUint8ClampedArray,
} from '@openinf/util-array';

// Node's util.types checks String objects and RegExps too. They are §22, and
// live in @openinf/util-string; this package re-exports them so it stays a
// drop-in.
export { isRegExp, isStringObject } from '@openinf/util-string';

// Node's util.types checks Dates too. A Date is §21.4, and lives in
// @openinf/util-date; this package re-exports it so it stays a drop-in.
export { isDate } from '@openinf/util-date';

// Node's util.types checks the boxed Number and BigInt objects too. They are
// numbers, and live in @openinf/util-number; this package re-exports them so it
// stays a drop-in for util.types.
export { isBigIntObject, isNumberObject } from '@openinf/util-number';

export * from './types';
