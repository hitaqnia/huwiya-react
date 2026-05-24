"use client";

import { useContext } from "react";
import type { HuwiyaContextValue, HuwiyaUser } from "@hitaqnia/core";
import { HuwiyaContext } from "./provider";

function useHuwiyaContext(): HuwiyaContextValue {
  const context = useContext(HuwiyaContext);
  if (!context) {
    throw new Error("useHuwiya must be used within a <HuwiyaProvider>.");
  }
  return context;
}

export function useHuwiya() {
  const { login, logout, handleCallback, isAuthenticated, isLoading, error } =
    useHuwiyaContext();
  return { login, logout, handleCallback, isAuthenticated, isLoading, error };
}

export function useUser(): HuwiyaUser | null {
  return useHuwiyaContext().user;
}

export function useToken() {
  const { accessToken, refreshToken, expiresAt, refresh } = useHuwiyaContext();
  return { accessToken, refreshToken, expiresAt, refresh };
}
