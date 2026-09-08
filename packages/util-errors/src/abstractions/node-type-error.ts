// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { NodeErrorAbstraction } from './node-error-abstraction';

export class NodeTypeError extends NodeErrorAbstraction implements TypeError {
  public constructor(code: string, message: string) {
    super(TypeError.prototype.name, code, message);
  }
}

// Wires TypeError.prototype into the static prototype chain once, here,
// rather than per-instance in the constructor. A per-instance
// `Object.setPrototypeOf(this, TypeError.prototype)` would *replace* each
// instance's prototype outright, breaking `instanceof NodeTypeError` and
// `instanceof <LeafSubclass>`. Doing it on the class prototype instead means
// every instance's normal `new.target.prototype` chain (e.g.
// InvalidArgTypeError.prototype -> NodeTypeError.prototype -> ...) already
// passes through the real TypeError.prototype too, so `instanceof TypeError`
// works without sacrificing the rest of the chain.
Object.setPrototypeOf(NodeTypeError.prototype, TypeError.prototype);
