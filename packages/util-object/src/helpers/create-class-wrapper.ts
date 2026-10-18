// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

interface ClassLike {
  name: string;
  length: number;
  prototype: unknown;
}

/**
 * Wraps an ES6 class with a constructor function that can be called without
 * `new`.
 * @category Fundamental Objects
 * @param type The class to wrap.
 * @returns The wrapper function, callable both with and without `new`.
 * @example
 * ```ts
 * class Point {
 *   x: number;
 *
 *   constructor(x: number) {
 *     this.x = x;
 *   }
 * }
 *
 * const makePoint = createClassWrapper(Point);
 *
 * makePoint(1) instanceof Point; // ↪ true
 *
 * makePoint(1) instanceof makePoint; // ↪ true
 * ```
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
