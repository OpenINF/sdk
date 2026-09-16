// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// The shared foundation (core types and the most primitive predicates) lives
// in @openinf/util-core so that packages needing only the vocabulary do not
// have to depend on all of util. Re-exported here so this package remains a
// single entry point -- one definition, reachable from either name.
export * from '@openinf/util-core';
export * from '@openinf/util-date';
export * from '@openinf/util-number';
export * from '@openinf/util-string';

// assertions
export * from './assertions/assert-is-defined';

// argument validators
export * from './validators/validate-arg-count';
export * from './validators/validate-array';
export * from './validators/validate-boolean';
export * from './validators/validate-buffer';
export * from './validators/validate-function';
export * from './validators/validate-int32';
export * from './validators/validate-integer';
export * from './validators/validate-number';
export * from './validators/validate-object';
export * from './validators/validate-one-of';
export * from './validators/validate-string';
export * from './validators/validate-uint32';

// helpers
export * from './helpers/generate-argument-error-message';
export * from './helpers/is-node';

// guards
export * from './guards/is-buffer';
export * from './guards/is-falsy';

// From @openinf/util-object: `isError`, since an Error is a Fundamental Object
// in section 20.5, and the type-name helpers, which read
// `Object.prototype.toString` and belong with the rest of the Object
// operations.
export { isIterator } from '@openinf/util-types';

export {
  getObjectType,
  isError,
  isObjectOfType,
  isObjectTypeName,
  isOfType,
  isPrimitiveTypeName,
  isTypedArrayName,
  objectTypeNames,
  primitiveTypeNames,
  typedArrayTypeNames,
} from '@openinf/util-object';
export type {
  ObjectTypeName,
  PrimitiveTypeName,
  TypeName,
  TypedArrayTypeName,
} from '@openinf/util-object';
