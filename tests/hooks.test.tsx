import React, { useState, useEffect } from "react";
import { describe, expect, it } from "vitest";
import { useHuwiya, useUser, useToken } from "../src/hooks";
import { HuwiyaContext } from "../src/provider";
import type { HuwiyaContextValue } from "../src/types";

const mockContextValue: HuwiyaContextValue = {
  isAuthenticated: true,
  isLoading: false,
  user: { id: "1", name: "Test", phone: "+966500000000", scopes: ["read"] },
  error: null,
  login: () => {},
  logout: () => {},
  handleCallback: async () => {},
  accessToken: "mock-access-token",
  refreshToken: "mock-refresh-token",
  expiresAt: Date.now() + 3600_000,
  refresh: async () => {},
};

/**
 * Minimal hook tester using React.createElement and ReactDOM.
 * We avoid @testing-library/react since it's blocked in the sandbox.
 */
async function testHook<T>(
  hook: () => T,
  contextValue?: HuwiyaContextValue,
): Promise<T> {
  const ReactDOM = await import("react-dom");
  const ReactDOMClient = await import("react-dom/client");
  let result: T | undefined;
  let error: Error | undefined;

  function HookConsumer() {
    try {
      result = hook();
    } catch (e) {
      error = e as Error;
    }
    return null;
  }

  const container = document.createElement("div");
  document.body.appendChild(container);

  const root = ReactDOMClient.createRoot(container);

  await new Promise<void>((resolve) => {
    if (contextValue) {
      root.render(
        React.createElement(
          HuwiyaContext.Provider,
          { value: contextValue },
          React.createElement(HookConsumer),
        ),
      );
    } else {
      root.render(React.createElement(HookConsumer));
    }
    // React 19 flushes synchronously in some cases; schedule a microtask
    setTimeout(resolve, 0);
  });

  root.unmount();
  document.body.removeChild(container);

  if (error) throw error;
  return result as T;
}

describe("useHuwiya", () => {
  it("returns auth state and actions when inside provider", async () => {
    const result = await testHook(() => useHuwiya(), mockContextValue);

    expect(result.isAuthenticated).toBe(true);
    expect(result.isLoading).toBe(false);
    expect(result.error).toBeNull();
    expect(typeof result.login).toBe("function");
    expect(typeof result.logout).toBe("function");
    expect(typeof result.handleCallback).toBe("function");
  });

  it("throws when used outside HuwiyaProvider", async () => {
    await expect(testHook(() => useHuwiya())).rejects.toThrow(
      "useHuwiya must be used within a <HuwiyaProvider>",
    );
  });
});

describe("useUser", () => {
  it("returns the current user", async () => {
    const result = await testHook(() => useUser(), mockContextValue);

    expect(result).toEqual({
      id: "1",
      name: "Test",
      phone: "+966500000000",
      scopes: ["read"],
    });
  });

  it("returns null when no user is authenticated", async () => {
    const noUserContext: HuwiyaContextValue = {
      ...mockContextValue,
      isAuthenticated: false,
      user: null,
    };

    const result = await testHook(() => useUser(), noUserContext);
    expect(result).toBeNull();
  });
});

describe("useToken", () => {
  it("returns token information", async () => {
    const result = await testHook(() => useToken(), mockContextValue);

    expect(result.accessToken).toBe("mock-access-token");
    expect(result.refreshToken).toBe("mock-refresh-token");
    expect(result.expiresAt).toBeGreaterThan(0);
    expect(typeof result.refresh).toBe("function");
  });

  it("returns null tokens when not authenticated", async () => {
    const noTokenContext: HuwiyaContextValue = {
      ...mockContextValue,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
    };

    const result = await testHook(() => useToken(), noTokenContext);

    expect(result.accessToken).toBeNull();
    expect(result.refreshToken).toBeNull();
    expect(result.expiresAt).toBeNull();
  });
});
