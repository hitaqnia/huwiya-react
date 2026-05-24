/**
 * Sanity check: the `@hitaqnia/huwiya-react` re-export of `HuwiyaClient` is the same
 * class as `@hitaqnia/huwiya-core`'s `HuwiyaClient`. The full behavioral test suite
 * lives in `@hitaqnia/huwiya-core`.
 */
import { describe, expect, it } from "vitest";
import { HuwiyaClient as ReactHuwiyaClient } from "../src/client";
import { HuwiyaClient as CoreHuwiyaClient } from "@hitaqnia/huwiya-core";

describe("HuwiyaClient re-export", () => {
  it("is the same class exported from @hitaqnia/huwiya-core", () => {
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
