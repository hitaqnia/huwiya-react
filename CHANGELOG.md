# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-05-23

### Changed

- **Split**: extracted the framework-agnostic JS into a new [`@hitaqnia/core`](../huwiya-js) package. `@hitaqnia/react` now depends on `@hitaqnia/core` and only ships the React provider, hooks, and context. Every symbol from `@hitaqnia/core` is re-exported from `@hitaqnia/react` so existing imports keep working unchanged — no breaking changes for consumers.
- `provider.tsx` and `hooks.ts` now import their non-React building blocks (`HuwiyaClient`, `TokenStorage`, `extractUser`, types) from `@hitaqnia/core`.
- `HuwiyaContext` is now exported from the package entry point alongside `HuwiyaProvider`.

### Added

- New top-level re-exports: `HuwiyaContext`, `TokenStorage`, `STORAGE_KEYS`, `decodeJwt`, `extractUser`, `generateCodeChallenge`, `generateCodeVerifier`, `generateState`, and the `HuwiyaAuthState`, `JwtPayload`, `StorageStrategy` types.

### Notes

- The `src/client.ts`, `src/jwt.ts`, `src/pkce.ts`, `src/storage.ts`, and `src/types.ts` modules are now thin re-exports of `@hitaqnia/core` for backwards compatibility with deep imports. New code should import from `@hitaqnia/core` (or from the `@hitaqnia/react` entry point).

## [0.1.0] - 2026-04-12

### Added

- `HuwiyaProvider` - React context provider for OAuth2 PKCE authentication
- `useHuwiya` hook - access auth state (login, logout, handleCallback, isAuthenticated, isLoading, error)
- `useUser` hook - access the current authenticated user
- `useToken` hook - access tokens and refresh functionality
- `HuwiyaClient` - standalone OAuth2 PKCE client class
- Configurable token storage strategies: memory (default), sessionStorage, localStorage
- Automatic token refresh with configurable margin
- Silent refresh on page reload (memory strategy persists refresh token in sessionStorage)
- CSRF protection via state parameter validation
- Full TypeScript support with exported types
- Dual ESM/CJS build output
