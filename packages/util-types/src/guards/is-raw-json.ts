// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Missing from Node.js

const rawJSONCheck = (
  JSON as { isRawJSON?: (this: void, value: unknown) => boolean }
).isRawJSON;

/**
 * Detects whether `value` is a raw JSON object, the result of
 * [`JSON.rawJSON`](https://mdn.io/Global_Objects/JSON/rawJSON), which
 * `JSON.stringify` writes out verbatim instead of serializing, section 25.5
 * of the specification.
 *
 * The check is the captured `JSON.isRawJSON`, which reads the internal slot
 * `JSON.rawJSON` gives its result, so a frozen object carrying a `rawJSON`
 * property of its own does not pass. In a runtime without it, nothing does.
 * @since 3.0.0
 * @category Structured Data
 * @param value The value to identify.
 * @returns `true` if `value` is a raw JSON object; else, `false`.
 * @example
 * ```ts
 * isRawJSON(JSON.rawJSON('12345678901234567890')); // ↪ true
 *
 * isRawJSON({ rawJSON: '1' }); // ↪ false
 * ```
 */
export function isRawJSON(value: unknown): boolean {
  return rawJSONCheck !== undefined && rawJSONCheck(value);
}
