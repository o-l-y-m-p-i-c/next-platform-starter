# TrenchSpy2 → next-platform-starter Migration Plan

## ✅ Step 1: TypeScript Setup (DONE)
- [x] Install TypeScript dependencies
- [x] Create `tsconfig.json`
- [x] Configure path aliases

## 📋 Step 2: Copy Dependencies

### From TrenchSpy2 `package.json`:

```bash
# Web3 & Wallet
npm install wagmi viem @rainbow-me/rainbowkit @tanstack/react-query

# UI Framework
npm install @mui/material @mui/system @emotion/react @emotion/styled

# Icons & Animations
npm install @mui/icons-material gsap lottie-react d3

# Utilities
npm install react-toastify socket.io-client @sentry/react

# Dev Dependencies
npm install --save-dev @types/react @types/node typescript
```

## 📁 Step 3: Directory Structure

Create the following structure:

```
next-platform-starter/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Home page
│   ├── providers.tsx                 # Client providers
│   ├── components/
│   │   ├── MainLayoutWrapper.tsx
│   │   └── RouterWrapper.tsx
│   ├── token/[tokenSlug]/page.tsx
│   ├── user/[username]/[[...page]]/page.tsx
│   └── ... (other routes)
├── src/
│   ├── components/                   # Shared components
│   ├── layouts/                      # Layout components
│   ├── modules/                      # Feature modules
│   ├── hooks/                        # Custom hooks
│   ├── providers/                    # Context providers
│   ├── store/                        # Redux/state
│   ├── utils/                        # Utilities
│   ├── constants/                    # Constants
│   └── types/                        # TypeScript types
├── public/                           # Static assets
└── styles/                           # Global styles
```

## 🔧 Step 4: Configuration Files

Copy from TrenchSpy2:
- [x] `tsconfig.json` (created with improvements)
- [ ] `next.config.mjs`
- [ ] `netlify.toml`
- [ ] `.env.example`
- [ ] `eslint.config.js`

## 📦 Step 5: Migration Order

### Phase 1: Foundation (Core Setup)
1. Install all dependencies
2. Copy configuration files
3. Set up providers structure
4. Copy types and constants

### Phase 2: Components (UI Building Blocks)
1. Copy `/src/components` directory
2. Copy `/src/layouts` directory
3. Update import paths

### Phase 3: Features (Business Logic)
1. Copy `/src/modules` directory
2. Copy `/src/hooks` directory
3. Copy `/src/providers` directory
4. Copy `/src/utils` directory

### Phase 4: Pages (Routes)
1. Copy `/app` directory structure
2. Update page components
3. Fix routing

### Phase 5: Assets & Styles
1. Copy `/public` directory
2. Copy global styles
3. Set up fonts

### Phase 6: Testing & Cleanup
1. Test each route
2. Fix broken imports
3. Remove unused code
4. Run build test

## 🚀 Quick Start Commands

```bash
# 1. Install dependencies
cd next-platform-starter
npm install

# 2. Copy environment variables
cp ../TrenchSpy2/.env.example .env

# 3. Run development server
npm run dev

# 4. Test build
npm run build
```

## 📝 Notes

- Keep TrenchSpy2 as reference
- Test after each major copy
- Update imports as you go
- Check for deprecated packages

## ⚠️ Important Differences

### Next.js 16 vs 15:
- React 19 (vs React 18)
- Turbopack enabled by default
- New caching APIs
- Improved TypeScript support

### What to Watch:
- Path aliases (`@/` vs relative imports)
- Client vs Server components
- Async components syntax
- Metadata API changes
