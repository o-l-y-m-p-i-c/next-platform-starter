import bnbLogo from './../assets/networks/bnb.svg';
import ethereumLogo from './../assets/networks/ehtereum.svg';
import solanaLogo from './../assets/networks/solana.svg';
import baseLogo from './../assets/networks/base-logo.svg';
import suiLogo from './../assets/networks/sui-logo.svg';
import { ETokenChain } from '../enums/token';
import { TTokenAddress } from '@/types/responces/Token';

const makeAddressObj = ({
  blockchainAddress,
  blockchainId,
}: TTokenAddress): { label: string; image: string; href: string } | null => {
  switch (blockchainId) {
    case ETokenChain.SOLANA:
      return {
        label: 'Solana',
        image:
          typeof solanaLogo === 'string'
            ? solanaLogo
            : solanaLogo.src || String(solanaLogo),
        href: `https://solscan.io/token/${blockchainAddress}`,
      };
    case ETokenChain.EIP155_1:
      return {
        label: 'Ethereum',
        image:
          typeof ethereumLogo === 'string'
            ? ethereumLogo
            : ethereumLogo.src || String(ethereumLogo),
        href: `https://etherscan.io/token/${blockchainAddress}`,
      };
    case ETokenChain.EIP155_1_SHORT:
      return {
        label: 'Ethereum',
        image:
          typeof ethereumLogo === 'string'
            ? ethereumLogo
            : ethereumLogo.src || String(ethereumLogo),
        href: `https://etherscan.io/token/${blockchainAddress}`,
      };
    case ETokenChain.EIP155_56:
      return {
        label: 'BNB',
        image:
          typeof bnbLogo === 'string'
            ? bnbLogo
            : bnbLogo.src || String(bnbLogo),
        href: `https://bscscan.com/token/${blockchainAddress}`,
      };
    case ETokenChain.EIP155_56_SHORT:
      return {
        label: 'BNB',
        image:
          typeof bnbLogo === 'string'
            ? bnbLogo
            : bnbLogo.src || String(bnbLogo),
        href: `https://bscscan.com/token/${blockchainAddress}`,
      };
    case ETokenChain.SUI:
      return {
        label: 'sui',
        image:
          typeof suiLogo === 'string'
            ? suiLogo
            : suiLogo.src || String(suiLogo),
        href: `https://suiscan.xyz/mainnet/coin/${blockchainAddress}`,
      };
    case ETokenChain.EIP155_8453:
      return {
        label: 'Base',
        image:
          typeof baseLogo === 'string'
            ? baseLogo
            : baseLogo.src || String(baseLogo),
        href: `https://basescan.org/token/${blockchainAddress}`,
      };

    default:
      return null;
  }
};

export { makeAddressObj };
