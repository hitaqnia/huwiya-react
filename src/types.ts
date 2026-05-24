/**
 * Re-export of all types from `@hitaqnia/huwiya-core`. Kept so existing imports from
 * `@hitaqnia/huwiya-react/types` keep working — new code should import directly from
 * `@hitaqnia/huwiya-core`.
 */
export type {
  HuwiyaAuthState,
  HuwiyaConfig,
  HuwiyaContextValue,
  HuwiyaUser,
  StorageStrategy,
  StoredTokens,
  TokenResponse,
} from "@hitaqnia/huwiya-core";
