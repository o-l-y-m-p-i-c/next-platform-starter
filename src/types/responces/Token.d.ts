export type TTokenSocial = {
  type: 'website' | 'twitter' | 'telegram';
  link: string;
};

export type TTokenAddress = {
  blockchainId: ETokenChain;
  blockchainAddress: string;
};

export type TToken = {
  name: string;
  description?: string;
  symbol: string;
  tradingViewTicker?: string;
  createdAt?: string;
  coingeckoTerminalPoolAddress?: string;
  slug: string;
  imageURL?: string;
  addresses: TTokenAddress[];
  pumpFunGraduatedAt?: string;
  socials: TTokenSocial[];
  mintedAt?: string;
  stats: {
    updatedAt: string;
    tokenUSDPrice: number;
    USDMarketCap: number;
  } | null;
  featured: boolean;
  decimals: number;
  tags: { name: string; slug: string }[];
  warnings?: {
    showIcon: boolean;
    type: 'Info' | 'Warning' | 'Error' | 'Success';
    title: string;
    message: string;
  }[];
  isInMyWatchlist?: boolean;
  totalSupply?: number | null;
};
