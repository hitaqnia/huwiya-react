"use client";

import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  HuwiyaClient,
  TokenStorage,
  extractUser,
  type HuwiyaConfig,
  type HuwiyaContextValue,
  type HuwiyaUser,
  type StoredTokens,
} from "@hitaqnia/huwiya-core";

export const HuwiyaContext = createContext<HuwiyaContextValue | null>(null);

const REFRESH_MARGIN_MS = 60_000; // refresh 1 minute before expiry

export function HuwiyaProvider({
  children,
  ...config
}: HuwiyaConfig & { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<StoredTokens | null>(null);
  const [user, setUser] = useState<HuwiyaUser | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const client = useMemo(() => new HuwiyaClient(config), [
    config.clientId,
    config.idpUrl,
    config.redirectUri,
    config.scope,
    config.postLogoutRedirectUri,
    config.storageStrategy,
  ]);

  const updateFromTokens = useCallback((stored: StoredTokens | null) => {
    setTokens(stored);
    if (stored) {
      setUser(extractUser(stored.accessToken));
    } else {
      setUser(null);
    }
  }, []);

  const scheduleRefresh = useCallback(
    (expiresAt: number) => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }

      const delay = Math.max(expiresAt - Date.now() - REFRESH_MARGIN_MS, 0);

      refreshTimerRef.current = setTimeout(async () => {
        try {
          const newTokens = await client.refreshTokens();
          updateFromTokens(newTokens);
          scheduleRefresh(newTokens.expiresAt);
        } catch {
          updateFromTokens(null);
          setError("Session expired. Please log in again.");
        }
      }, delay);
    },
    [client, updateFromTokens],
  );

  // Initialize from stored tokens on mount
  useEffect(() => {
    const stored = TokenStorage.getTokens();
    if (stored && stored.accessToken && stored.expiresAt > Date.now()) {
      updateFromTokens(stored);
      scheduleRefresh(stored.expiresAt);
      setIsLoading(false);
    } else if (stored?.refreshToken) {
      // Access token expired or missing (e.g., page reload with memory strategy),
      // but refresh token is available — attempt silent refresh
      client
        .refreshTokens()
        .then((newTokens) => {
          updateFromTokens(newTokens);
          scheduleRefresh(newTokens.expiresAt);
        })
        .catch(() => {
          TokenStorage.clearAll();
          updateFromTokens(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [client, updateFromTokens, scheduleRefresh]);

  const login = useCallback(() => {
    client.buildAuthorizationUrl().then((url) => {
      window.location.href = url;
    });
  }, [client]);

  const handleCallback = useCallback(async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const errorParam = params.get("error");

    if (errorParam) {
      setError(params.get("error_description") ?? errorParam);
      return;
    }

    if (!code || !state) {
      setError("Missing code or state in callback URL.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const newTokens = await client.exchangeCodeForTokens(code, state);
      updateFromTokens(newTokens);
      scheduleRefresh(newTokens.expiresAt);

      // Clean up URL params
      window.history.replaceState({}, "", window.location.pathname);
    } catch (err) {
      // Clean up PKCE state so the app isn't stuck in a broken state
      TokenStorage.clearAll();
      setError(err instanceof Error ? err.message : "Authentication failed.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [client, updateFromTokens, scheduleRefresh]);

  const logout = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }
    client.logout();
    updateFromTokens(null);
    setError(null);
  }, [client, updateFromTokens]);

  const refresh = useCallback(async () => {
    try {
      const newTokens = await client.refreshTokens();
      updateFromTokens(newTokens);
      scheduleRefresh(newTokens.expiresAt);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Token refresh failed.");
      throw err;
    }
  }, [client, updateFromTokens, scheduleRefresh]);

  const value: HuwiyaContextValue = useMemo(
    () => ({
      isAuthenticated: !!tokens,
      isLoading,
      user,
      error,
      login,
      logout,
      handleCallback,
      accessToken: tokens?.accessToken ?? null,
      refreshToken: tokens?.refreshToken ?? null,
      expiresAt: tokens?.expiresAt ?? null,
      refresh,
    }),
    [tokens, isLoading, user, error, login, logout, handleCallback, refresh],
  );

  return <HuwiyaContext.Provider value={value}>{children}</HuwiyaContext.Provider>;
}
