// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// The shared foundation (core types and the most primitive predicates) lives
// in @openinf/util-core so that packages needing only the vocabulary do not
// have to depend on all of util. Re-exported here so this package remains a
// single entry point -- one definition, reachable from either name.
export * from '@openinf/util-core';

// assertions
export * from './assertions/assert-is-defined';

// argument validators
export * from './validators/validate-arg-count';
export * from './validators/validate-array';
export * from './validators/validate-boolean';
export * from './validators/validate-buffer';
export * from './validators/validate-function';
export * from './validators/validate-int32';
export * from './validators/validate-number';
export * from './validators/validate-object';
export * from './validators/validate-string';
export * from './validators/validate-uint32';

// helpers
export * from './helpers/generate-argument-error-message';
export * from './helpers/is-node';

// guards
export * from './guards/has-interface';
export * from './guards/is-any';
export * from './guards/is-buffer';
export * from './guards/is-date';
export * from './guards/is-defined';
export * from './guards/is-error';
export * from './guards/is-falsy';
export * from './guards/is-finite-number';
export * from './guards/is-int32';
export * from './guards/is-integer';
export * from './guards/is-iterator';
export * from './guards/is-length';
export * from './guards/is-nan';
export * from './guards/is-negative-integer';
export * from './guards/is-negative';
export * from './guards/is-positive-integer';
export * from './guards/is-positive';
export * from './guards/is-primitive';
export * from './guards/is-uint32';
export * from './guards/is-unknown';
export * from './guards/is-valid-date';

export * from './guards/and';
export * from './guards/or';

export * from './types';
