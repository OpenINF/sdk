/**-*- coding: utf-8 -*- esm -*- /.remarkrc.mjs ********************************

  This file is amongst the sources of the OpenINF SDK.

********************************************************************************

  Markdown lint configuration. The plugin list is shared with the pass that
  reads JSDoc `@example` blocks, so a fence in a doc comment is held to the
  same rules as one in a README -- both become pages on the portal.

  This file and the module it imports are `.mjs`, where everything else in
  the toolchain is `.mts`. Node strips types as it runs, but the editor
  extension loads this config in its own runtime, whose Node is not ours to
  pick and need not be new enough to do that. A config that only CI can read
  would leave the editor reporting nothing. Their types come from JSDoc and
  are checked by `tsconfig.tools.json` all the same.

*******************************************************************************/

import { documentPlugins } from './build/shared/markdown-plugins.mjs';

/** @type {import('unified').Preset} */
const config = { plugins: documentPlugins() };

export default config;
