/**
 * Sanity check: the `@hitaqnia/react` re-export of `HuwiyaClient` is the same
 * class as `@hitaqnia/core`'s `HuwiyaClient`. The full behavioral test suite
 * lives in `@hitaqnia/core`.
 */
import { describe, expect, it } from "vitest";
import { HuwiyaClient as ReactHuwiyaClient } from "../src/client";
import { HuwiyaClient as CoreHuwiyaClient } from "@hitaqnia/core";

describe("HuwiyaClient re-export", () => {
  it("is the same class exported from @hitaqnia/core", () => {
    expect(ReactHuwiyaClient).toBe(CoreHuwiyaClient);
  });

  it("can be instantiated through the re-export", () => {
    const client = new ReactHuwiyaClient({
      clientId: "c",
      idpUrl: "https://idp.example.com",
      redirectUri: "https://app.example.com/cb",
    });
    expect(client).toBeInstanceOf(CoreHuwiyaClient);
  });
});
