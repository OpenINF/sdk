// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// guards
export * from './guards/and';
export * from './guards/has-interface';
export * from './guards/is-any';
export * from './guards/is-array';
export * from './guards/is-big-int';
export * from './guards/is-boolean';
export * from './guards/is-defined';
export * from './guards/is-function';
export * from './guards/is-non-nullish';
export * from './guards/is-null';
export * from './guards/is-nullish';
export * from './guards/is-number';
export * from './guards/is-object';
export * from './guards/is-object-like';
export * from './guards/is-primitive';
export * from './guards/is-string';
export * from './guards/is-symbol';
export * from './guards/is-undefined';
export * from './guards/is-unknown';
export * from './guards/or';

// The brand-check machinery the guards for built-in objects are made from. It
// is shared with the other @openinf packages rather than published for general
// use, which is why its declarations are marked private and left out of the
// API reference.
export { _tagTester } from './_internal/_tag-tester';
export { _typedArrayName } from './_internal/_typed-array-name';

export * from './types';
