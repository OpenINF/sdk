// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

/**
 * The accessor V8 installs on every error for `stack`.
 *
 * One pair of functions is shared by every error in the realm, whatever its
 * constructor, so the descriptor can be recognized by identity rather than
 * guessed at from its shape. That is what separates the one accessor worth
 * replacing from an accessor somebody wrote on purpose.
 */
const V8_STACK = Object.getOwnPropertyDescriptor(new Error(), 'stack');

/**
 * What V8's own `stack` accessor produced, if this is that accessor.
 *
 * Wrapped rather than returned bare, because the value is whatever
 * `Error.prepareStackTrace` made it. That hook exists to return something
 * other than a string -- structured call sites, most often -- so "not a
 * string" cannot stand in for "nothing to copy" the way it first appears to.
 * The only reading worth refusing is one that threw.
 * @param source The error being copied.
 * @param descriptor Its own `stack` descriptor.
 * @returns The value in a wrapper, or `undefined` to leave the descriptor be.
 */
function v8StackOf(
  source: Error,
  descriptor: PropertyDescriptor
): { value: unknown } | undefined {
  if (
    V8_STACK === undefined ||
    descriptor.get !== V8_STACK.get ||
    descriptor.set !== V8_STACK.set
  ) {
    return undefined;
  }

  try {
    return { value: source.stack };
  } catch {
    // Reading it runs `Error.prepareStackTrace`, a global hook that any
    // dependency may have replaced. Copying an error is not the moment to
    // surface somebody else's broken formatter, so the accessor is copied as
    // it is and the copy fails the same way the original would.
    return undefined;
  }
}

/**
 * Creates a copy of `source`, preserving its prototype and every own
 * property descriptor.
 * @param source The error to copy.
 * @returns The copy.
 */
export function copyError(source: Error): Error {
  const descriptors = Object.getOwnPropertyDescriptors(source);
  const descriptor: PropertyDescriptor | undefined = descriptors.stack;
  const read =
    descriptor === undefined ? undefined : v8StackOf(source, descriptor);

  // V8's getter answers for the error the trace was captured on rather than
  // for whoever is asking, so a faithfully copied descriptor reads back as
  // `undefined` on the copy. Holding the string it produces is the way to
  // keep the one property a copied error is usually wanted for.
  //
  // Rewritten in the descriptor map rather than on the finished object: a
  // sealed or frozen source arrives with `configurable: false`, and defining
  // over one of those throws rather than returning a copy. The flags are kept
  // as they were found, so a copy is no more mutable than what it came from.
  if (descriptor !== undefined && read !== undefined) {
    // Through a widened view: `stack` is typed as a string, and what the hook
    // produced need not be one.
    (descriptors as Record<PropertyKey, PropertyDescriptor>)['stack'] = {
      configurable: descriptor.configurable ?? false,
      enumerable: descriptor.enumerable ?? false,
      value: read.value,
      writable: typeof descriptor.set === 'function',
    };
  }

  return Object.create(Object.getPrototypeOf(source), descriptors) as Error;
}
