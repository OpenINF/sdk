# @openinf/util-types

Type-related predicates that reach past `typeof`: boxed primitives, typed
arrays, iterators, proxies, module namespace objects, and the other exotic
objects the language gives you no direct way to tell apart.

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
