# Next.js App Router Guide

## ❌ Don't Use React Router in Next.js

Next.js has its own built-in routing system. **Do NOT install or use `react-router-dom`**.

## ✅ How Next.js App Router Works

### File-Based Routing

The file structure in `/app` directory defines your routes:

```
app/
├── page.tsx                           → /
├── layout.tsx                         → Root layout (wraps all pages)
├── not-found.tsx                      → 404 page
├── token/
│   └── [tokenSlug]/
│       └── page.tsx                   → /token/:tokenSlug (dynamic route)
└── profile/
    ├── page.tsx                       → /profile
    └── edit/
        └── page.tsx                   → /profile/edit
```

### Current Structure (Already Set Up)

```
✅ app/
   ✅ page.tsx                         → / (Home)
   ✅ layout.tsx                       → Root layout
   ✅ providers.tsx                    → Client providers
   ✅ not-found.tsx                    → 404
   ✅ token/
      ✅ [tokenSlug]/
         ✅ page.tsx                   → /token/:tokenSlug
   ✅ profile/
      ✅ page.tsx                      → /profile
      ✅ edit/
         ✅ page.tsx                   → /profile/edit
   ✅ components/
      ✅ MainLayoutWrapper.tsx
      ✅ RouterWrapper.tsx
```

## Navigation in Next.js

### Use Next.js Link Component

```tsx
import Link from 'next/navigation';

// ✅ Correct
<Link href="/profile">Profile</Link>
<Link href="/token/ethereum">Token</Link>

// ❌ Wrong - Don't use React Router
import { Link } from 'react-router-dom'; // NO!
```

### Use Next.js Navigation Hooks

```tsx
'use client';

import { useRouter, usePathname, useParams } from 'next/navigation';

function MyComponent() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  
  // Navigate programmatically
  router.push('/profile');
  router.back();
  
  // Get current path
  console.log(pathname); // e.g., "/token/ethereum"
  
  // Get dynamic params
  console.log(params.tokenSlug); // e.g., "ethereum"
}
```

## Dynamic Routes

### Single Dynamic Segment

```
app/token/[tokenSlug]/page.tsx
```

Access with:
```tsx
import { useParams } from 'next/navigation';

export default function TokenPage() {
  const params = useParams();
  const tokenSlug = params.tokenSlug; // "ethereum"
  
  return <div>Token: {tokenSlug}</div>;
}
```

### Catch-All Routes

```
app/user/[username]/[[...page]]/page.tsx
```

Matches:
- `/user/john` → `{ username: 'john' }`
- `/user/john/posts` → `{ username: 'john', page: ['posts'] }`
- `/user/john/posts/123` → `{ username: 'john', page: ['posts', '123'] }`

## Layouts

### Root Layout (app/layout.tsx)

```tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

### Nested Layouts

```
app/
├── layout.tsx              → Root layout
└── profile/
    ├── layout.tsx          → Profile layout (wraps all /profile/* pages)
    ├── page.tsx            → /profile
    └── edit/
        └── page.tsx        → /profile/edit (uses profile layout)
```

## Client vs Server Components

### Server Components (Default)

```tsx
// app/page.tsx
// No 'use client' directive = Server Component

export default function HomePage() {
  // Runs on server
  return <div>Home</div>;
}
```

### Client Components

```tsx
'use client'; // Must be at the top

import { useState } from 'react';

export default function InteractivePage() {
  const [count, setCount] = useState(0);
  
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

## Loading & Error States

### Loading UI

```tsx
// app/token/[tokenSlug]/loading.tsx
export default function Loading() {
  return <div>Loading token...</div>;
}
```

### Error Handling

```tsx
// app/token/[tokenSlug]/error.tsx
'use client';

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

## Metadata (SEO)

### Static Metadata

```tsx
// app/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TrenchSpy',
  description: 'Crypto analytics platform',
};

export default function HomePage() {
  return <div>Home</div>;
}
```

### Dynamic Metadata

```tsx
// app/token/[tokenSlug]/page.tsx
import { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const token = await fetchToken(params.tokenSlug);
  
  return {
    title: `${token.name} - TrenchSpy`,
    description: token.description,
  };
}

export default function TokenPage() {
  return <div>Token Page</div>;
}
```

## Route Groups (Organization)

Use `(folder)` to organize without affecting URL:

```
app/
├── (marketing)/
│   ├── about/page.tsx      → /about
│   └── contact/page.tsx    → /contact
└── (dashboard)/
    ├── profile/page.tsx    → /profile
    └── settings/page.tsx   → /settings
```

## Parallel Routes

```
app/
├── @modal/
│   └── login/page.tsx
├── @sidebar/
│   └── page.tsx
└── layout.tsx
```

## Intercepting Routes

```
app/
├── feed/
│   └── page.tsx
└── (..)photo/
    └── [id]/page.tsx
```

## Migration from React Router

If you have React Router code, convert it like this:

### Before (React Router)
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/token/:slug" element={<Token />} />
  </Routes>
</BrowserRouter>
```

### After (Next.js App Router)
```
app/
├── page.tsx              → <Home />
├── profile/
│   └── page.tsx          → <Profile />
└── token/
    └── [slug]/
        └── page.tsx      → <Token />
```

## Summary

✅ **Do:**
- Use file-based routing in `/app` directory
- Use `next/link` for navigation
- Use `useRouter`, `usePathname`, `useParams` from `next/navigation`
- Create layouts for shared UI
- Use Server Components by default

❌ **Don't:**
- Install `react-router-dom`
- Use `<BrowserRouter>` or `<RouterProvider>`
- Use React Router hooks
- Try to configure routes manually

## Your Current Setup

You already have the correct structure! Just use it:

```tsx
// Navigate to token page
<Link href={`/token/${tokenSlug}`}>View Token</Link>

// Navigate to profile
<Link href="/profile">My Profile</Link>

// Navigate to edit profile
<Link href="/profile/edit">Edit Profile</Link>
```

That's it! Next.js handles all the routing automatically based on your file structure.
