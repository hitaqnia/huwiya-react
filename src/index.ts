/**
 * @hitaqnia/react — React bindings for the Huwiya Identity Provider OAuth2
 * PKCE client. Built on top of `@hitaqnia/core`, which is also re-exported
 * here for convenience.
 */

// React-specific exports
export { HuwiyaProvider, HuwiyaContext } from "./provider";
export { useHuwiya, useUser, useToken } from "./hooks";

// Re-exports from @hitaqnia/core so consumers don't have to install it
// separately when they only want everything from one entry point.
export {
  HuwiyaClient,
  TokenStorage,
  STORAGE_KEYS,
  decodeJwt,
  extractUser,
  generateCodeChallenge,
  generateCodeVerifier,
  generateState,
} from "@hitaqnia/core";

export type {
  HuwiyaAuthState,
  HuwiyaConfig,
  HuwiyaContextValue,
  HuwiyaUser,
  JwtPayload,
  StorageStrategy,
  StoredTokens,
  TokenResponse,
} from "@hitaqnia/core";
