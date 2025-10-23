import type { TToken } from './Token';

// export type TokenTransaction = {
//   amount: number;
//   receiver: string;
//   sender: string;
// };

export type TokenTransactionSnipers = {
  transactionHash: string;
  tokenAddress: string;
  tokenAmount: number; // it not iclude decimal
  isBuy: boolean;
  from: string;
  transactionTime: string;
  USDMarketCap: number;
  tokenUSDPrice: number;
  tokenData: TToken;
};
