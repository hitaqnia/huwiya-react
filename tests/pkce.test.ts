/**
 * Sanity check: the `@hitaqnia/react` re-exports of the PKCE helpers are
 * identical to the ones in `@hitaqnia/core`. The full test suite lives in
 * `@hitaqnia/core`.
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
} from "@hitaqnia/core";

describe("pkce helpers re-export", () => {
  it("generateCodeVerifier is the same function as @hitaqnia/core's", () => {
    expect(reactVerifier).toBe(coreVerifier);
  });

  it("generateCodeChallenge is the same function as @hitaqnia/core's", () => {
    expect(reactChallenge).toBe(coreChallenge);
  });

  it("generateState is the same function as @hitaqnia/core's", () => {
    expect(reactState).toBe(coreState);
  });
});
