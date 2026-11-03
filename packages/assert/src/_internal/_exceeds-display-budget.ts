// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

/**
 * How many properties a value may show, counted every time a shared object is
 * reached, before describing it in full is no longer worth it. Far more than a
 * message can usefully hold, and still quick to count.
 */
const DISPLAY_BUDGET = 100_000;

const { getOwnPropertyDescriptor, getPrototypeOf } = Object;
const { apply, ownKeys } = Reflect;

// The built-in getters, so a size is read without running a getter that the
// value itself defines.
// oxlint-disable-next-line typescript/unbound-method -- invoked with captured Reflect.apply.
const getMapSize = getOwnPropertyDescriptor(Map.prototype, 'size')?.get;
// oxlint-disable-next-line typescript/unbound-method -- invoked with captured Reflect.apply.
const getSetSize = getOwnPropertyDescriptor(Set.prototype, 'size')?.get;
// oxlint-disable-next-line typescript/unbound-method -- invoked with captured Reflect.apply.
const getTypedArrayLength = getOwnPropertyDescriptor(
  getPrototypeOf(Uint8Array.prototype) as object,
  'length'
)?.get;

/**
 * How many entries a Map, Set, or typed array holds, read from its internal
 * slots, or 0 for anything else.
 * @param node The object about to be enumerated.
 * @returns The number of entries a full description would show for it.
 */
function wideSize(node: object): number {
  if (node instanceof Map) return 2 * (apply(getMapSize!, node, []) as number);
  if (node instanceof Set) return apply(getSetSize!, node, []) as number;
  if (ArrayBuffer.isView(node) && !(node instanceof DataView)) {
    try {
      return apply(getTypedArrayLength!, node, []) as number;
    } catch {
      return 0;
    }
  }
  return 0;
}

/**
 * Whether describing `value` in full would show more than `budget` properties.
 * `JSON.stringify` and `util.inspect` each show a shared object again
 * wherever it is reached, so a small graph that reaches one object along many
 * paths describes as a string exponentially larger than itself. This counts
 * the way they show it, stopping as soon as the budget is spent, so the count
 * itself costs no more than the budget. A cycle is counted once, since both
 * stop at one. Getters are not run.
 * @private
 * @param value The value about to be described.
 * @param budget The most properties a full description may show.
 * @param runsGetters Whether the description would run getters, as `String`
 * and `JSON.stringify` do. A getter can answer with anything, so then an
 * enumerable one anywhere in the value puts it over the budget at once.
 * @returns `true` if the description would show more than `budget`.
 */
export function _exceedsDisplayBudget(
  value: unknown,
  budget: number = DISPLAY_BUDGET,
  runsGetters = false
): boolean {
  let remaining = budget;
  const ancestors = new Set<object>();

  // Returns false once the budget is spent, so the walk unwinds at once.
  const visit = (node: unknown): boolean => {
    if (
      (typeof node !== 'object' && typeof node !== 'function') ||
      node === null ||
      ancestors.has(node)
    ) {
      return true;
    }
    ancestors.add(node);
    try {
      const children: unknown[] = [];
      try {
        // A Map, Set, or typed array too wide for what is left is refused
        // before its entries are collected, so a large buffer costs nothing
        // to refuse.
        if (wideSize(node) > remaining) return false;
        if (node instanceof Map) {
          for (const [key, entry] of node) children.push(key, entry);
        } else if (node instanceof Set) {
          for (const entry of node) children.push(entry);
        }
        for (const key of ownKeys(node)) {
          const descriptor = getOwnPropertyDescriptor(node, key);
          if (descriptor?.enumerable !== true) continue;
          if ('value' in descriptor) children.push(descriptor.value);
          else if (runsGetters) return false;
        }
      } catch {
        // A node that refuses to be read (a revoked proxy, a proxy around a
        // Map, an object that only inherits from one) is counted with what
        // could be read of it, and the rest of the graph is still counted:
        // giving up on the whole value would describe it in full.
      }
      for (const child of children) {
        remaining -= 1;
        if (remaining < 0 || !visit(child)) return false;
      }
      return true;
    } finally {
      ancestors.delete(node);
    }
  };

  try {
    return !visit(value);
  } catch {
    // A proxy or an exotic object that refuses to be read is described by
    // whatever the caller falls back to, not counted here.
    return false;
  }
}
