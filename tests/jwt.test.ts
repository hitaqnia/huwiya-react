/**
 * Sanity check: the `@hitaqnia/react` re-exports of `decodeJwt` and
 * `extractUser` are identical to the ones in `@hitaqnia/core`. The full test
 * suite lives in `@hitaqnia/core`.
 */
import { describe, expect, it } from "vitest";
import { decodeJwt as reactDecode, extractUser as reactExtract } from "../src/jwt";
import { decodeJwt as coreDecode, extractUser as coreExtract } from "@hitaqnia/core";

describe("jwt helpers re-export", () => {
  it("decodeJwt is the same function as @hitaqnia/core's", () => {
    expect(reactDecode).toBe(coreDecode);
  });

  it("extractUser is the same function as @hitaqnia/core's", () => {
    expect(reactExtract).toBe(coreExtract);
  });
});
