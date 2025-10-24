import { ETokenChain } from '../enums/token';
import { TTokenAddress } from '@/types/responces/Token';

export const getChainInfo = ({
    blockchainAddress,
    blockchainId
}: TTokenAddress): { label: string; image: string; href: string } | null => {
    switch (blockchainId) {
        case ETokenChain.SOLANA:
            return {
                label: 'Solana',
                image: '/networks/solana.svg',
                href: `https://solscan.io/token/${blockchainAddress}`
            };
        case ETokenChain.EIP155_1:
            return {
                label: 'Ethereum',
                image: '/networks/ehtereum.svg',
                href: `https://etherscan.io/token/${blockchainAddress}`
            };
        case ETokenChain.EIP155_1_SHORT:
            return {
                label: 'Ethereum',
                image: '/networks/ehtereum.svg',
                href: `https://etherscan.io/token/${blockchainAddress}`
            };
        case ETokenChain.EIP155_56:
            return {
                label: 'BNB',
                image: '/networks/bnb.svg',
                href: `https://bscscan.com/token/${blockchainAddress}`
            };
        case ETokenChain.EIP155_56_SHORT:
            return {
                label: 'BNB',
                image: '/networks/bnb.svg',
                href: `https://bscscan.com/token/${blockchainAddress}`
            };
        case ETokenChain.SUI:
            return {
                label: 'sui',
                image: '/networks/sui-logo.svg',
                href: `https://suiscan.xyz/mainnet/coin/${blockchainAddress}`
            };
        case ETokenChain.EIP155_8453:
            return {
                label: 'Base',
                image: '/networks/base-logo.svg',
                href: `https://basescan.org/token/${blockchainAddress}`
            };

        default:
            return null;
    }
};
