// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Deno.
// https://github.com/denoland/deno_std/blob/main/node/_errors.ts

/**
 * All error instances in Node have additional methods and properties.
 * This export class is meant to be extended by these instances abstracting native JS error instances
 */
export class NodeErrorAbstraction extends Error {
  public code: string;
  public override name: string;

  public constructor(name: string, code: string, message: string) {
    super(message);
    this.code = code;
    this.name = name;
    const stack = this.stack;
    if (stack) {
      const firstFrame = stack.indexOf('\n');
      const frames = firstFrame === -1 ? '' : stack.slice(firstFrame);
      this.stack = `${name} [${this.code}]: ${message}${frames}`;
    }
  }

  // Declared as an own instance property, not a prototype method: subclasses
  // like NodeTypeError splice a built-in error's prototype (e.g.
  // TypeError.prototype) into their static prototype chain so `instanceof
  // TypeError` works, which puts NodeErrorAbstraction.prototype out of reach
  // for lookup. An own property is unaffected by where `[[Prototype]]`
  // points, so it survives that splice.
  public override toString = (): string => {
    return `${this.name} [${this.code}]: ${this.message}`;
  };
}
