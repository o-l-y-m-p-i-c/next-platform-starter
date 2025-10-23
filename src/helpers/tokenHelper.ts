const getChainIDFromBlockchaninId = (blockchainId: string) => {
  if (blockchainId === 'solana') {
    return 'solana';
  } else if (blockchainId.startsWith('eip155')) {
    return blockchainId.replace('eip155-', '');
  } else if (blockchainId === 'sui') {
    return 'sui-network';
  }
  throw new Error('Invalid blockchainId');
};

export const getChainIDFromBlockchaninIdForSwap = (
  blockchainId: string,
): number => {
  const chainId = getChainIDFromBlockchaninId(blockchainId);
  if (chainId === 'solana') {
    return 1151111081099710; //solma/n in ascii
  }
  return Number(chainId);
};

// export const getChainIDFromBlockchaninIdForOldTwitterApi = (
//   blockchainId: string,
// ): string => {
//   if (blockchainId === 'eip155-1') {
//     return 'ethereum';
//   } else if (blockchainId === 'eip155-56') {
//     return 'bnb';
//   } else if (blockchainId === 'eip155-8453') {
//     return 'eip155-8453';
//   } else if (blockchainId === 'solana') {
//     return 'solana';
//   }
//   throw new Error('Invalid blockchainId');
// };

export const getChainIDFromBlockchaninIdForGeckoTerminal = (
  blockchainId: string,
): string => {
  if (blockchainId === 'eip155-1') {
    return 'eth';
  } else if (blockchainId === 'eip155-56') {
    return 'bsc';
  } else if (blockchainId === 'eip155-8453') {
    return 'base';
  } else if (blockchainId === 'solana') {
    return 'solana';
  } else if (blockchainId === 'sui') {
    return 'sui-network';
  }
  throw new Error('Invalid blockchainId');
};
