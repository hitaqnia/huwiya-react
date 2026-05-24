/**
 * Sanity check: the `@hitaqnia/huwiya-react` re-exports of the PKCE helpers are
 * identical to the ones in `@hitaqnia/huwiya-core`. The full test suite lives in
 * `@hitaqnia/huwiya-core`.
 */
import { describe, expect, it } from "vitest";
import {
  generateCodeChallenge as reactChallenge,
  generateCodeVerifier as reactVerifier,
  generateState as reactState,
} from "../src/pkce";
import {
  generateCodeChallenge as coreChallenge,
  generateCodeVerifier as coreVerifier,
  generateState as coreState,
} from "@hitaqnia/huwiya-core";

describe("pkce helpers re-export", () => {
  it("generateCodeVerifier is the same function as @hitaqnia/huwiya-core's", () => {
    expect(reactVerifier).toBe(coreVerifier);
  });

  it("generateCodeChallenge is the same function as @hitaqnia/huwiya-core's", () => {
    expect(reactChallenge).toBe(coreChallenge);
  });

  it("generateState is the same function as @hitaqnia/huwiya-core's", () => {
    expect(reactState).toBe(coreState);
  });
});
