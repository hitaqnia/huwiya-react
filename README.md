# @hitaqnia/huwiya-react

React bindings for the [Huwiya Identity Provider](https://github.com/hitaqnia/huwiya-backend) — OAuth2 PKCE authentication for React and Next.js applications.

This package is the React layer on top of [`@hitaqnia/huwiya-core`](https://github.com/hitaqnia/huwiya-js). Use this package if you have a React app; use `@hitaqnia/huwiya-core` directly if you're on another framework or in plain JS/Node.

## Installation

```bash
npm install @hitaqnia/huwiya-react
```

`@hitaqnia/huwiya-core` is installed automatically as a transitive dependency. `react` (and `react-dom` if you use SSR/Next.js) are peer dependencies.

## Quick Start

Wrap your application with `HuwiyaProvider`:

```tsx
import { HuwiyaProvider } from "@hitaqnia/huwiya-react";

function App() {
  return (
    <HuwiyaProvider
      clientId="your-client-id"
      idpUrl="https://your-huwiya-instance.com"
      redirectUri="http://localhost:3000/callback"
      scope="openid profile"
      postLogoutRedirectUri="http://localhost:3000"
    >
      <YourApp />
    </HuwiyaProvider>
  );
}
```

### Trigger Login

```tsx
import { useHuwiya } from "@hitaqnia/huwiya-react";

function LoginButton() {
  const { login, isAuthenticated, isLoading } = useHuwiya();

  if (isLoading) return <p>Loading...</p>;
  if (isAuthenticated) return <p>Logged in!</p>;

  return <button onClick={login}>Log in</button>;
}
```

### Handle the OAuth Callback

```tsx
import { useHuwiya } from "@hitaqnia/huwiya-react";
import { useEffect } from "react";

function CallbackPage() {
  const { handleCallback } = useHuwiya();

  useEffect(() => {
    handleCallback().then(() => {
      window.location.href = "/";
    });
  }, [handleCallback]);

  return <p>Authenticating...</p>;
}
```

### Access the User

```tsx
import { useUser } from "@hitaqnia/huwiya-react";

function Profile() {
  const user = useUser();
  if (!user) return null;

  return (
    <div>
      <p>Name: {user.name}</p>
      <p>Phone: {user.phone}</p>
    </div>
  );
}
```

### Access Tokens

```tsx
import { useToken } from "@hitaqnia/huwiya-react";

function ApiCaller() {
  const { accessToken, refresh } = useToken();

  async function callApi() {
    const res = await fetch("/api/data", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.json();
  }

  return <button onClick={callApi}>Call API</button>;
}
```

## Configuration

| Property | Type | Required | Description |
|---|---|---|---|
| `clientId` | `string` | Yes | OAuth2 client ID |
| `idpUrl` | `string` | Yes | Base URL of the Huwiya IDP |
| `redirectUri` | `string` | Yes | OAuth2 callback URL |
| `scope` | `string` | No | OAuth2 scopes |
| `postLogoutRedirectUri` | `string` | No | Redirect URL after logout |
| `storageStrategy` | `"memory" \| "sessionStorage" \| "localStorage"` | No | Token storage strategy (default: `"memory"`) |

### Storage Strategies

- **`memory`** (default, recommended) — Access token in memory, refresh token in `sessionStorage`. Survives page reloads via silent refresh. Best XSS protection.
- **`sessionStorage`** — Both tokens in `sessionStorage`. Tab-scoped, cleared on browser close.
- **`localStorage`** — Both tokens in `localStorage`. Persistent across tabs and browser restarts. More vulnerable to XSS.

## Hooks

| Hook | Returns | Description |
|---|---|---|
| `useHuwiya()` | `{ login, logout, handleCallback, isAuthenticated, isLoading, error }` | Core auth state and actions |
| `useUser()` | `HuwiyaUser \| null` | Current authenticated user |
| `useToken()` | `{ accessToken, refreshToken, expiresAt, refresh }` | Token access and manual refresh |

## What's re-exported from `@hitaqnia/huwiya-core`

For convenience, every public symbol from `@hitaqnia/huwiya-core` is re-exported from `@hitaqnia/huwiya-react`, so you can import everything from one place:

```ts
import {
  // React
  HuwiyaProvider, HuwiyaContext,
  useHuwiya, useUser, useToken,
  // Re-exported from @hitaqnia/huwiya-core
  HuwiyaClient, TokenStorage, decodeJwt, extractUser,
  generateCodeChallenge, generateCodeVerifier, generateState,
  type HuwiyaConfig, type HuwiyaUser, type StoredTokens,
} from "@hitaqnia/huwiya-react";
```

If you want a smaller install or you're using the client outside of React, import from `@hitaqnia/huwiya-core` instead.

## Requirements

- React 18+ or React 19+
- A running Huwiya Identity Provider instance

## Development

```bash
npm install
npm run build
npm run test
npm run dev     # watch mode
```

## License

MIT
