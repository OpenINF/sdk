/**-*- coding: utf-8 -*- esm -*- /documentation/.remarkrc.mjs *****************

  This file is amongst the sources of the OpenINF SDK.

********************************************************************************

  TypeDoc reads this directory and writes the pages elsewhere, so a relative
  link here resolves against the generated tree rather than against the file
  beside it. `tools/check-api-docs.js` resolves those links there, where they
  mean something, and holds the whole corpus to what the portal will import.
  Checking them twice, once against the wrong tree, only produces a warning
  nobody can act on.

*******************************************************************************/

import { documentPlugins } from '../build/shared/markdown-plugins.mjs';

/** @type {import('unified').Preset} */
const config = { plugins: documentPlugins({ links: false }) };

export default config;
