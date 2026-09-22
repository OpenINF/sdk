# @openinf/util-types

Type-related predicates that reach past `typeof`: boxed primitives, typed
arrays, iterators, proxies, module namespace objects, and the other exotic
objects the language gives you no direct way to tell apart.

This package uses standard JavaScript, not `node:util`. Some exotic types have
no portable, non-mutating brand check; their predicates are best-effort
classifiers, not validators for untrusted objects. See the guarantees below.

## Installation

```bash
npm install @openinf/util-types
```

## Usage

```ts
import { isBoxedPrimitive, isMap } from '@openinf/util-types';

typeof new Map(); // ↪ 'object'
isMap(new Map()); // ↪ true

typeof new String('hi'); // ↪ 'object'
isBoxedPrimitive(new String('hi')); // ↪ true
```

## Brand-check guarantees

The Underscore-derived tag tester uses captured built-in methods and getters
where the language exposes a non-mutating internal-slot check. For example,
`Map.prototype.has` throws if its receiver lacks the map's internal storage,
even when the receiver inherits `Map.prototype` or advertises a `Map` tag. The
predicate catches that exception and returns `false`.

| Types                                                                                            | Implementation                                                                | Guarantee                                                     |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Maps, sets, weak maps, weak sets                                                                 | Captured `has` methods                                                        | Internal-slot check                                           |
| Dates, boxed primitives                                                                          | Captured `getTime` or `valueOf`                                               | Internal-slot check                                           |
| Regular expressions                                                                              | Captured `source` getter                                                      | Internal-slot check; does not change `lastIndex`              |
| Buffers, data views                                                                              | Captured `byteLength` or `buffer` getter                                      | Internal-slot check; accepts detached and out-of-bounds views |
| Typed arrays                                                                                     | Captured `%TypedArray%` tag getter                                            | Reads the internal element type, not the object's tag         |
| Weak refs, finalization registries, disposable stacks                                            | Captured `deref`, `unregister`, `disposed`                                    | Internal-slot check; leaves the value as it found it          |
| WebAssembly modules                                                                              | Captured `WebAssembly.Module.exports`                                         | Host brand check; returns `false` if WebAssembly is absent    |
| Errors                                                                                           | `Error.isError`, or Node.js's `types.isNativeError`                           | Internal brand check; tag fallback on other older engines     |
| Arguments, promises, async/generator functions and objects, map/set iterators, module namespaces | Tag, source, and descriptor checks                                            | Best effort; rejects casual spoofs, not deliberate forgeries  |
| Buffer state, raw JSON                                                                           | Captured `detached`, `resizable` and `growable` getters, and `JSON.isRawJSON` | Internal-slot check; reads state without changing it          |
| Proxies                                                                                          | Captured `Array.isArray`                                                      | Detects revoked proxies only; live proxies remain opaque      |
| Native external values                                                                           | Compatibility stub                                                            | Always `false`; detection requires engine support             |

The internal-slot checks accept values from other realms, including subclasses
and genuine objects with custom tags or overridden methods. They reject proxies
around built-ins: a proxy does not acquire its target's internal slots. They do
not invoke input getters or proxy traps. Intrinsics must be intact when the
package is loaded; this is not a defense against a compromised host environment.

On the Node.js 22 line, which has no `Error.isError`, `node:util`'s
`types.isNativeError` asks V8 the same question, reached through
`process.getBuiltinModule` rather than an import, so every supported Node.js
gives the same answer. Other engines without `Error.isError` read the legacy
cross-realm error tag, which only an object with `[[ErrorData]]` reports, and
fall back to local `Error.prototype` ancestry when a custom tag hides it. Forged
prototypes and proxy traps can still fool that fallback.

For opaque types, the Underscore tag fallback now reads property descriptors
instead of invoking ordinary tag or method getters. It also checks expected
methods and descriptors, uses captured `Function.prototype.toString` for
async/generator function syntax, and validates the observable invariants of
module namespace objects. These filters reject casual tag spoofing, but a
carefully constructed object or proxy can still pass. Thrown proxy traps return
`false`. `isProxy` can identify revoked proxies because the standard `IsArray`
operation exposes revocation without invoking user traps; it cannot identify a
live proxy. None of these best-effort checks is a security boundary.

## Why this approach

- [Underscore's tag tester](https://github.com/jashkenas/underscore/blob/master/modules/_tagTester.js)
  supplies the original factory and tag-comparison fallback. The adaptation is
  retained, with stronger checks where standard intrinsics permit them.
- [Lodash](https://github.com/lodash/lodash/blob/4.17.21/lodash.js) uses Node
  helpers when available. Its `getRawTag` fallback temporarily writes
  `Symbol.toStringTag`; that can run setters and cannot unmask a frozen tag.
  This package does not modify inputs to identify them.
- [The `is-map` library](https://github.com/inspect-js/is-map/blob/main/index.js)
  demonstrates receiver checks using captured collection methods.
  [Deno's typed-array predicates](https://github.com/denoland/deno/blob/main/ext/node/polyfills/internal/util/types.ts)
  likewise call the intrinsic typed-array tag getter directly.
- [Endo uses that same typed-array getter technique](https://github.com/endojs/endo/blob/master/packages/pass-style/src/passStyle-helpers.js),
  while
  [SES captures `Reflect.apply` and other intrinsics](https://github.com/endojs/endo/blob/master/packages/ses/src/commons.js)
  so later prototype changes do not redirect calls. This package follows those
  patterns. Endo's promise-kit instead compares a value with
  `Promise.resolve(value)`; that can inspect or assimilate thenables and does
  not accept ordinary promises from unrelated realms, so it is not used here.
- [Bun](https://github.com/oven-sh/bun/blob/main/src/jsc/modules/NodeUtilTypesModule.cpp)
  inspects JavaScriptCore cell types for opaque brands such as proxies.
  [Deno delegates those checks to V8 through its core](https://github.com/denoland/deno_core/blob/main/core/ops_builtin_types.rs),
  rather than solving them with ordinary JavaScript reflection. Reproducing that
  coverage here would require a separately designed native component.

Calling `Promise.prototype.then` would install reactions and consult species;
calling a generator's or iterator's `next` would consume user state. Neither is
an acceptable probe. The opaque checks inspect method descriptors without
calling the methods. Cloning can invoke getters, copy large graphs, and reject
many unrelated types, so a clone failure is not a proxy test either.

WebAssembly does not supply the missing reflection privilege:
[host references are opaque](https://webassembly.github.io/spec/core/exec/runtime.html#values).
Passing a JavaScript object through `externref` does not expose its engine
slots. A WebAssembly wrapper would still need a host-provided brand-check
function.
