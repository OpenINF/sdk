// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { NodeErrorAbstraction } from './node-error-abstraction';

export class NodeError extends NodeErrorAbstraction {
  public constructor(code: string, message: string) {
    super(Error.prototype.name, code, message);
  }
}
