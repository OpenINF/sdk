// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { runInNewContext } from 'node:vm';

import {
  isArgumentsObject,
  isAsyncFunction,
  isAsyncGenerator,
  isAsyncGeneratorFunction,
  isGeneratorFunction,
  isGeneratorObject,
  isMapIterator,
  isModuleNamespaceObject,
  isPromise,
  isSetIterator,
} from '../../src';

type Predicate = (value: unknown) => boolean;

const fallbacks: ReadonlyArray<readonly [string, Predicate]> = [
  ['Arguments', isArgumentsObject],
  ['AsyncFunction', isAsyncFunction],
  ['AsyncGenerator', isAsyncGenerator],
  ['AsyncGeneratorFunction', isAsyncGeneratorFunction],
  ['GeneratorFunction', isGeneratorFunction],
  ['Generator', isGeneratorObject],
  ['Map Iterator', isMapIterator],
  ['Module', isModuleNamespaceObject],
  ['Promise', isPromise],
  ['Set Iterator', isSetIterator],
];

const realFallbacks: ReadonlyArray<
  readonly [string, Predicate, () => unknown, string]
> = [
  [
    'Arguments',
    isArgumentsObject,
    function getArguments() {
      return arguments;
    },
    '(function() { return arguments; })(1)',
  ],
  [
    'AsyncFunction',
    isAsyncFunction,
    () => async function named() {},
    '(async function named() {})',
  ],
  [
    'AsyncGenerator',
    isAsyncGenerator,
    () => (async function* generate() {})(),
    '(async function* generate() {})()',
  ],
  [
    'AsyncGeneratorFunction',
    isAsyncGeneratorFunction,
    () => async function* generate() {},
    '(async function* generate() {})',
  ],
  [
    'GeneratorFunction',
    isGeneratorFunction,
    () => function* generate() {},
    '(function* generate() {})',
  ],
  [
    'Generator',
    isGeneratorObject,
    () => (function* generate() {})(),
    '(function* generate() {})()',
  ],
  [
    'Map Iterator',
    isMapIterator,
    () => new Map().entries(),
    'new Map().entries()',
  ],
  ['Promise', isPromise, () => Promise.resolve(), 'Promise.resolve()'],
  [
    'Set Iterator',
    isSetIterator,
    () => new Set().values(),
    'new Set().values()',
  ],
];

function withTag<T extends object>(value: T, tag: string): T {
  Object.defineProperty(value, Symbol.toStringTag, {
    configurable: true,
    value: tag,
  });
  return value;
}

describe('documented tag fallback boundary', () => {
  for (const [tag, predicate] of fallbacks) {
    it(`rejects a casual ${tag} tag spoof`, () => {
      const fake = { [Symbol.toStringTag]: tag, next() {}, throw() {} };
      assert.strictEqual(predicate(fake), false);
      assert.strictEqual(predicate(withTag({}, tag)), false);
    });

    it(`does not invoke a tag getter and catches a revoked proxy for ${tag}`, () => {
      let reads = 0;
      const fake = {
        get [Symbol.toStringTag](): string {
          reads += 1;
          throw new Error('tag');
        },
      };
      assert.strictEqual(predicate(fake), false);
      assert.strictEqual(reads, 0);
      const { proxy, revoke } = Proxy.revocable({}, {});
      revoke();
      assert.strictEqual(predicate(proxy), false);
    });
  }

  for (const [tag, predicate, create, expression] of realFallbacks) {
    it(`accepts genuine same- and cross-realm ${tag} values`, () => {
      assert.strictEqual(predicate(create()), true);
      assert.strictEqual(predicate(runInNewContext(expression)), true);
    });
  }

  it('accepts genuine module namespace objects', async () => {
    const loadNamespace = new Function(
      'return import("data:text/javascript,export const answer = 42")'
    ) as () => Promise<unknown>;
    const namespace = await loadNamespace();
    assert.strictEqual(isModuleNamespaceObject(namespace), true);
  });

  it('still treats carefully shaped opaque objects as best-effort matches', () => {
    const args = withTag({}, 'Arguments');
    Object.defineProperties(args, {
      callee: { value() {} },
      length: { value: 0 },
    });

    const promise = withTag({ catch() {}, finally() {}, then() {} }, 'Promise');
    const generator = withTag(
      {
        [Symbol.iterator]() {
          return this;
        },
        next() {},
        return() {},
        throw() {},
      },
      'Generator'
    );
    const asyncGenerator = withTag(
      {
        [Symbol.asyncIterator]() {
          return this;
        },
        next() {},
        return() {},
        throw() {},
      },
      'AsyncGenerator'
    );
    const mapIterator = withTag(
      {
        [Symbol.iterator]() {
          return this;
        },
        next() {},
      },
      'Map Iterator'
    );
    const setIterator = withTag(
      {
        [Symbol.iterator]() {
          return this;
        },
        next() {},
      },
      'Set Iterator'
    );
    const namespace = Object.create(null) as Record<PropertyKey, unknown>;
    Object.defineProperties(namespace, {
      [Symbol.toStringTag]: { value: 'Module' },
      answer: { enumerable: true, value: 42, writable: true },
    });
    Object.preventExtensions(namespace);
    const bunPrototype = Object.create(null) as Record<PropertyKey, unknown>;
    Object.defineProperty(bunPrototype, '__esModule', {
      configurable: false,
      enumerable: false,
      get() {
        return true;
      },
      set() {},
    });
    const bunNamespace = Object.create(bunPrototype) as Record<
      PropertyKey,
      unknown
    >;
    Object.defineProperties(bunNamespace, {
      [Symbol.toStringTag]: { value: 'Module' },
      answer: { enumerable: true, value: 42, writable: true },
    });
    Object.preventExtensions(bunNamespace);

    assert.strictEqual(isArgumentsObject(args), true);
    assert.strictEqual(isPromise(promise), true);
    assert.strictEqual(isGeneratorObject(generator), true);
    assert.strictEqual(isAsyncGenerator(asyncGenerator), true);
    assert.strictEqual(isMapIterator(mapIterator), true);
    assert.strictEqual(isSetIterator(setIterator), true);
    assert.strictEqual(isModuleNamespaceObject(namespace), true);
    assert.strictEqual(isModuleNamespaceObject(bunNamespace), true);
  });

  it('does not let a safe tag turn an ordinary function into a special one', () => {
    const ordinaryNamedAsync = withTag(
      {
        async() {
          return () => {};
        },
      }.async,
      'AsyncFunction'
    );
    assert.strictEqual(
      isAsyncFunction(withTag(function ordinary() {}, 'AsyncFunction')),
      false
    );
    assert.strictEqual(isAsyncFunction(ordinaryNamedAsync), false);
    assert.strictEqual(
      isGeneratorFunction(withTag(function ordinary() {}, 'GeneratorFunction')),
      false
    );
    assert.strictEqual(
      isAsyncGeneratorFunction(
        withTag(function ordinary() {}, 'AsyncGeneratorFunction')
      ),
      false
    );
  });

  it('rejects bound functions and proxies that inherit special tags', () => {
    const asyncFunction = async function named() {};
    const generatorFunction = function* generate() {};
    const asyncGeneratorFunction = async function* generate() {};
    assert.strictEqual(isAsyncFunction(asyncFunction.bind(undefined)), false);
    assert.strictEqual(isAsyncFunction(new Proxy(asyncFunction, {})), false);
    assert.strictEqual(
      isGeneratorFunction(generatorFunction.bind(undefined)),
      false
    );
    assert.strictEqual(
      isGeneratorFunction(new Proxy(generatorFunction, {})),
      false
    );
    assert.strictEqual(
      isAsyncGeneratorFunction(asyncGeneratorFunction.bind(undefined)),
      false
    );
    assert.strictEqual(
      isAsyncGeneratorFunction(new Proxy(asyncGeneratorFunction, {})),
      false
    );
  });

  it('accepts subclasses of the hidden special-function constructors', () => {
    const [asyncFunction, generatorFunction, asyncGeneratorFunction] =
      new Function(`
        const AsyncFunction = Object.getPrototypeOf(async function() {})
          .constructor;
        const GeneratorFunction = Object.getPrototypeOf(function* () {})
          .constructor;
        const AsyncGeneratorFunction = Object.getPrototypeOf(
          async function* () {}
        ).constructor;
        return [
          new (class extends AsyncFunction {})(''),
          new (class extends GeneratorFunction {})(''),
          new (class extends AsyncGeneratorFunction {})('')
        ];
      `)() as readonly unknown[];
    assert.strictEqual(isAsyncFunction(asyncFunction), true);
    assert.strictEqual(isGeneratorFunction(generatorFunction), true);
    assert.strictEqual(isAsyncGeneratorFunction(asyncGeneratorFunction), true);
  });

  it('recognizes declaration, method, and arrow function syntax', () => {
    const arrowWithNestedParameters = new Function(
      'return async(value = (1)) => value'
    )() as (value?: unknown) => Promise<unknown>;
    const generatorWithComment = new Function(
      'return function /* retained comment */ * generate() {}'
    )() as GeneratorFunction;
    const asyncGeneratorWithComments = new Function(
      'return async /* retained comment */ function' +
        ' /* retained comment */ * generate() {}'
    )() as AsyncGeneratorFunction;
    const object = {
      async 'quoted method'() {},
      async method() {},
      async *asyncGenerator() {},
      *generator() {},
    };
    assert.strictEqual(
      isAsyncFunction(async () => {}),
      true
    );
    assert.strictEqual(
      isAsyncFunction(async (value: unknown) => value),
      true
    );
    assert.strictEqual(isAsyncFunction(arrowWithNestedParameters), true);
    assert.strictEqual(isAsyncFunction(object.method), true);
    assert.strictEqual(isAsyncFunction(object['quoted method']), true);
    assert.strictEqual(isGeneratorFunction(object.generator), true);
    assert.strictEqual(isAsyncGeneratorFunction(object.asyncGenerator), true);
    assert.strictEqual(isGeneratorFunction(generatorWithComment), true);
    assert.strictEqual(
      isAsyncGeneratorFunction(asyncGeneratorWithComments),
      true
    );
  });

  it('does not advance iterators or generators or read promise species', async () => {
    const mapIterator = new Map([[1, 2]]).entries();
    const setIterator = new Set([3]).values();
    function* generate() {
      yield 4;
    }
    async function* generateAsync() {
      yield 5;
    }
    const generator = generate();
    const asyncGenerator = generateAsync();
    const promise = Promise.resolve(6);
    Object.defineProperty(promise, 'constructor', {
      get() {
        throw new Error('must not read species');
      },
    });
    assert.strictEqual(isMapIterator(mapIterator), true);
    assert.strictEqual(isSetIterator(setIterator), true);
    assert.strictEqual(isGeneratorObject(generator), true);
    assert.strictEqual(isAsyncGenerator(asyncGenerator), true);
    assert.strictEqual(isPromise(promise), true);
    assert.deepStrictEqual(mapIterator.next(), { value: [1, 2], done: false });
    assert.deepStrictEqual(setIterator.next(), { value: 3, done: false });
    assert.deepStrictEqual(generator.next(), { value: 4, done: false });
    assert.deepStrictEqual(await asyncGenerator.next(), {
      value: 5,
      done: false,
    });
  });

  it('catches a throwing generator method accessor', () => {
    let reads = 0;
    assert.strictEqual(
      isGeneratorObject(
        withTag(
          {
            get next(): never {
              reads += 1;
              throw new Error('next');
            },
          },
          'Generator'
        )
      ),
      false
    );
    assert.strictEqual(reads, 0);
  });

  it('bounds prototype inspection when a proxy invents a cycle', () => {
    let proxy: object;
    proxy = new Proxy(
      {},
      {
        getOwnPropertyDescriptor() {
          return undefined;
        },
        getPrototypeOf() {
          return proxy;
        },
      }
    );
    assert.strictEqual(isPromise(proxy), false);
  });
});
