/**
 * Sanity check: the `@hitaqnia/react` re-export of `TokenStorage` is the same
 * object as `@hitaqnia/core`'s `TokenStorage` — same module-global state. The
 * full behavioral test suite lives in `@hitaqnia/core`.
 */
import { describe, expect, it } from "vitest";
import { TokenStorage as ReactTokenStorage } from "../src/storage";
import { TokenStorage as CoreTokenStorage } from "@hitaqnia/core";

describe("TokenStorage re-export", () => {
  it("is the same object as @hitaqnia/core's TokenStorage", () => {
    expect(ReactTokenStorage).toBe(CoreTokenStorage);
  });

  it("shares the underlying storage strategy state", () => {
    ReactTokenStorage.setStrategy("localStorage");
    expect(CoreTokenStorage.getStrategy()).toBe("localStorage");
    ReactTokenStorage.setStrategy("memory");
  });
});
