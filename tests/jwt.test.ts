/**
 * Sanity check: the `@hitaqnia/huwiya-react` re-exports of `decodeJwt` and
 * `extractUser` are identical to the ones in `@hitaqnia/huwiya-core`. The full test
 * suite lives in `@hitaqnia/huwiya-core`.
 */
import { describe, expect, it } from "vitest";
import { decodeJwt as reactDecode, extractUser as reactExtract } from "../src/jwt";
import { decodeJwt as coreDecode, extractUser as coreExtract } from "@hitaqnia/huwiya-core";

describe("jwt helpers re-export", () => {
  it("decodeJwt is the same function as @hitaqnia/huwiya-core's", () => {
    expect(reactDecode).toBe(coreDecode);
  });

  it("extractUser is the same function as @hitaqnia/huwiya-core's", () => {
    expect(reactExtract).toBe(coreExtract);
  });
});
