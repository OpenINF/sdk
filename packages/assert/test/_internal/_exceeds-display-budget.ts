// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { _exceedsDisplayBudget } from '../../src/_internal/_exceeds-display-budget';
import { _stringifyValue } from '../../src/_internal/_stringify-value';
import { assertEqual } from '../../src/assertions/assert-equal';
import { assertValue } from '../../src/assertions/assert-value';
import { AssertionError } from '../../src/errors/assertion-error';
import { inspectValue } from '../../src/helpers/inspect-value';

/** Two paths to one object at each of 40 levels: 2 ** 40 leaves shown. */
function ladder(): unknown {
  let node: unknown = { leaf: true };
  for (let level = 0; level < 40; level += 1) {
    node = { left: node, right: node };
  }
  return node;
}

function quickly<T>(run: () => T): T {
  const started = performance.now();
  const result = run();
  assert.ok(performance.now() - started < 2000);
  return result;
}

describe(_exceedsDisplayBudget.name, () => {
  it('should count a shared object every time it is reached', () => {
    const shared = { a: 1, b: 2 };
    assert.strictEqual(
      _exceedsDisplayBudget({ x: shared, y: shared }, 6),
      false
    );
    assert.strictEqual(
      _exceedsDisplayBudget({ x: shared, y: shared }, 5),
      true
    );
  });

  it('should count a cycle once', () => {
    const cycle: Record<string, unknown> = { a: 1 };
    cycle['self'] = cycle;
    assert.strictEqual(_exceedsDisplayBudget(cycle, 2), false);
  });

  it('should count Map and Set entries', () => {
    assert.strictEqual(_exceedsDisplayBudget(new Map([[1, 2]]), 2), false);
    assert.strictEqual(_exceedsDisplayBudget(new Map([[1, 2]]), 1), true);
    assert.strictEqual(_exceedsDisplayBudget(new Set([1, 2, 3]), 2), true);
  });

  it('should refuse a wide Map, Set, or typed array before enumerating it', () => {
    const buffer = new Uint8Array(50_000_000);
    const shown = quickly(() => _exceedsDisplayBudget(buffer));
    assert.strictEqual(shown, true);
    assert.strictEqual(_exceedsDisplayBudget(new Uint8Array(3), 3), false);
    assert.strictEqual(_exceedsDisplayBudget(new Uint8Array(4), 3), true);
    assert.strictEqual(_exceedsDisplayBudget({ inner: buffer }, 10), true);
    const map = new Map([
      [1, 2],
      [3, 4],
    ]);
    Object.defineProperty(map, 'size', { value: 0 });
    assert.strictEqual(_exceedsDisplayBudget(map, 3), true);
    assert.strictEqual(
      _exceedsDisplayBudget(new DataView(new ArrayBuffer(8)), 0),
      false
    );
  });

  it('should keep counting past a node that cannot be read', () => {
    const { proxy, revoke } = Proxy.revocable({}, {});
    revoke();
    // The unreadable node comes first, so the graph is only reached after it.
    const withRevoked = { proxy, graph: ladder() };
    const withFakeMap = { map: new Proxy(new Map(), {}), graph: ladder() };
    const withBareMap = {
      map: Object.create(Map.prototype) as object,
      graph: ladder(),
    };
    assert.strictEqual(_exceedsDisplayBudget(withRevoked), true);
    assert.strictEqual(_exceedsDisplayBudget(withFakeMap), true);
    assert.strictEqual(_exceedsDisplayBudget(withBareMap), true);
    assert.strictEqual(_exceedsDisplayBudget({ proxy }), false);
  });

  it('should not run getters', () => {
    let ran = false;
    const value = {
      get trap() {
        ran = true;
        return 1;
      },
    };
    assert.strictEqual(_exceedsDisplayBudget(value, 0), false);
    assert.strictEqual(ran, false);
  });

  it('should count an enumerable getter as over budget when it would run', () => {
    let ran = false;
    const value = {
      nested: {
        get trap() {
          ran = true;
          return ladder();
        },
      },
    };
    assert.strictEqual(_exceedsDisplayBudget(value, undefined, true), true);
    assert.strictEqual(_exceedsDisplayBudget(value), false);
    assert.strictEqual(ran, false);
  });

  it('should leave ordinary values to be shown in full', () => {
    assert.strictEqual(_exceedsDisplayBudget({ a: [1, 2, { b: 3 }] }), false);
    assert.strictEqual(_exceedsDisplayBudget('text'), false);
    assert.strictEqual(_exceedsDisplayBudget(null), false);
  });
});

describe('describing a graph that shares one object along many paths', () => {
  it('should show only the top level in inspectValue', () => {
    const shown = quickly(() => inspectValue(ladder()));
    assert.match(shown, /left: \[Object\]/);
  });

  it('should show a getter that returns a big graph only to the top level', () => {
    const value = {
      get trap() {
        return ladder();
      },
    };
    assert.match(
      quickly(() => _stringifyValue(value)),
      /trap: \[Getter/
    );
    assert.match(
      quickly(() => inspectValue(value)),
      /trap: \[Getter/
    );
  });

  it('should show only the top level in _stringifyValue', () => {
    const shown = quickly(() => _stringifyValue(ladder()));
    assert.match(shown, /left: \[Object\]/);
  });

  it('should still fail assertEqual promptly', () => {
    quickly(() =>
      assert.throws(() => assertEqual(ladder(), ladder()), AssertionError)
    );
  });

  it('should still fail assertValue promptly', () => {
    quickly(() =>
      assert.throws(() => assertValue(() => false, ladder()), AssertionError)
    );
  });

  it('should still build an AssertionError message promptly', () => {
    const error = quickly(
      () =>
        new AssertionError(undefined, {
          actual: ladder(),
          expected: 1,
          operator: 'deepStrictEqual',
        })
    );
    assert.match(error.message, /left: \[Object\]/);
  });
});
