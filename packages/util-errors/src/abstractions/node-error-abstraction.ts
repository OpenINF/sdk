// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Deno.
// https://github.com/denoland/deno_std/blob/main/node/_errors.ts

/**
 * The base of this package's errors, which carry a `code` property and render
 * as `Name [CODE]: message`, as Node.js errors do.
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
      // The header V8 wrote is `Error: message`, so it spans one line more
      // than the message has line breaks. Cutting at the first line break
      // instead would leave the rest of a multiline message in the frames.
      let header = -1;
      for (let lines = message.split('\n').length; lines > 0; lines -= 1) {
        header = stack.indexOf('\n', header + 1);
        if (header === -1) break;
      }
      const frames = header === -1 ? '' : stack.slice(header);
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
