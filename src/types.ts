/**
 * Re-export of all types from `@hitaqnia/core`. Kept so existing imports from
 * `@hitaqnia/react/types` keep working — new code should import directly from
 * `@hitaqnia/core`.
 */
export type {
  HuwiyaAuthState,
  HuwiyaConfig,
  HuwiyaContextValue,
  HuwiyaUser,
  StorageStrategy,
  StoredTokens,
  TokenResponse,
} from "@hitaqnia/core";
