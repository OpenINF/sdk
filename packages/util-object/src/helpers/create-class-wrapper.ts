// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Useful for wrapping an ES6 class with a constructor function that does not
// require the `new` keyword. For instance:
//   class A { constructor(x) { this.x = x; } }
//   const B = createClassWrapper(A);
//   B() instanceof A // true
//   B() instanceof B // true

interface ClassLike {
  name: string;
  length: number;
  prototype: unknown;
}

/**
 * Wraps an ES6 class with a constructor function that can be called without
 * `new`.
 * @param type The class to wrap.
 * @returns The wrapper function, callable both with and without `new`.
 */
export function createClassWrapper<T extends new (...args: any[]) => unknown>(
  type: T
): T & ((...args: ConstructorParameters<T>) => InstanceType<T>) {
  function fn(this: unknown, ...args: unknown[]): unknown {
    // oxlint-disable-next-line typescript/no-unnecessary-condition -- new.target is undefined when fn() is called without `new`, even though TS infers it as always defined here.
    return Reflect.construct(type, args, new.target ?? type);
  }

  const ctor = type as unknown as ClassLike;

  // Mask the wrapper function's name and length values
  Object.defineProperties(fn, {
    name: { value: ctor.name },
    length: { value: ctor.length },
  });
  Object.setPrototypeOf(fn, type);
  (fn as unknown as ClassLike).prototype = ctor.prototype;

  return fn as unknown as T &
    ((...args: ConstructorParameters<T>) => InstanceType<T>);
}
