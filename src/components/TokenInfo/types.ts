interface Token {
  address: string;
  name: string;
  symbol: string;
}

interface Social {
  type: 'twitter' | 'telegram';
  url: string;
}

interface TokenInfo {
  imageUrl: string;
  header: string;
  openGraph: string;
  socials: Social[];
  websites: string[];
}

interface Liquidity {
  usd: number;
  base: number;
  quote: number;
}

interface PriceChange {
  m5: number;
  h1: number;
  h6: number;
  h24: number;
}

export interface Transactions {
  buys: number;
  sells: number;
}

interface TransactionPeriods {
  m5: Transactions;
  h1: Transactions;
  h6: Transactions;
  h24: Transactions;
}

interface Volume {
  m5: number;
  h1: number;
  h6: number;
  h24: number;
}

export interface DexScreenerPair {
  chainId: string;
  dexId: string;
  url: string;
  baseToken: Token;
  quoteToken: Token;
  info?: TokenInfo;
  liquidity?: Liquidity;
  fdv: number;
  marketCap?: number;
  pairAddress: string;
  pairCreatedAt: number;
  priceChange: PriceChange;
  priceNative: string;
  priceUsd?: string;
  usd: number;
  txns: TransactionPeriods;
  labels?: [];
  volume: Volume;
}
