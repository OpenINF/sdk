// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { NodeErrorAbstraction } from './node-error-abstraction';

export class NodeRangeError extends NodeErrorAbstraction {
  public constructor(code: string, message: string) {
    super(RangeError.prototype.name, code, message);
  }
}

// See node-type-error.ts for why this is wired on the class prototype here
// rather than per-instance in the constructor.
Object.setPrototypeOf(NodeRangeError.prototype, RangeError.prototype);
