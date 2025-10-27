# TrenchSpy.ai

**Spot the Most-Hyped Tokens Before Everyone Else**

TrenchSpy is a cryptocurrency analytics platform that helps traders and investors identify trending tokens before they gain mainstream attention. The platform combines social media signals, on-chain analytics, and AI-powered hype detection.

## Features

- 🔍 **Hype Detector** - AI-powered token hype analysis
- 🗺️ **Hype Map** - Visual representation of trending tokens
- 📊 **Token Analytics** - Comprehensive token metrics and holder analysis
- 🐦 **Social Signals** - Twitter and Telegram integration
- 👥 **KOL Tracking** - Monitor influential crypto personalities
- 💎 **Sniper Tracking** - Identify early token buyers
- 🔄 **Real-time Updates** - WebSocket-powered live data
- 🌐 **Web3 Integration** - Wallet connection and on-chain interactions

## Tech Stack

- **Frontend**: Next.js, TypeScript
- **UI**: Material-UI v6, Emotion
- **Web3**: Wagmi, Viem, RainbowKit
- **Data Viz**: D3.js, TradingView, MUI Charts
- **State**: TanStack Query, Context API
- **Real-time**: Socket.io
- **Monitoring**: Sentry, Google Analytics

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Run proxy server (for local API testing)
npm run proxy
```

## Environment Variables

Create a `.env` file with the following variables:

```env
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_API_ID=
NEXT_PUBLIC_CORE_BACKEND_DOMAIN=
NEXT_PUBLIC_CORE_BACKEND_USE_HTTPS=
NEXT_PUBLIC_AUTH_ROUTINGS=
NEXT_PUBLIC_IS_PROD=
NEXT_PUBLIC_BSC_STAKING=
NEXT_PUBLIC_BSCTN_STAKING=
NEXT_PUBLIC_BSC_MOCK_TOKEN=
NEXT_PUBLIC_BSCTN_MOCK_TOKEN=
```

## License

Proprietary - All rights reserved
