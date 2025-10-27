import TradingViewWidget from '@/components/TradingViewWidget/TradingViewWidget';
import { ChartingLibraryTV } from '@/components/ChartingLibraryTV';
import { getChainIDFromBlockchaninIdForGeckoTerminal } from '../../helpers/tokenHelper';
import BlurPlaceholder from '@/components/BlurPlaceholder';

import type { TToken } from '@/types/responces/Token';
import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { Box } from '@mui/system';
import { useEffect } from 'react';
import { useFetch } from '../../hooks';

const UnifiedCandlesGraph = ({ token }: { token: TToken }) => {
    const { fetchData } = useFetch();

    const checkForGeckoTerminal = async () => {
        try {
            const chainId = getChainIDFromBlockchaninIdForGeckoTerminal(token.addresses[0].blockchainId);
            const response = await fetch(
                `https://www.geckoterminal.com/${chainId}/pools/${token.coingeckoTerminalPoolAddress}?embed=1&info=0&swaps=0`
            );

            if (response.status === 404) {
                await fetchData(`token/${token.slug}/refreshCoingecko`, {
                    method: 'POST'
                });
            }
        } catch (error) {
            const typedError = error as Error;
            console.error(`[terminal error]: ${typedError.message}`);
        }
    };

    // Move useEffect before any returns
    useEffect(() => {
        if (token.coingeckoTerminalPoolAddress) {
            checkForGeckoTerminal();
        }
    }, [token.coingeckoTerminalPoolAddress]);

    // Priority 1: TradingView ticker (most reliable)
    if (token.tradingViewTicker) {
        return <TradingViewWidget symbol={token.tradingViewTicker} />;
    }

    // Priority 2: GeckoTerminal pool address
    if (token.coingeckoTerminalPoolAddress) {
        const chainId = getChainIDFromBlockchaninIdForGeckoTerminal(token.addresses[0].blockchainId);

        return (
            <Box minHeight={500} height={'100%'}>
                <iframe
                    src={`https://www.geckoterminal.com/${chainId}/pools/${token.coingeckoTerminalPoolAddress}?embed=1&info=0&swaps=0`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="clipboard-write"
                    allowFullScreen
                ></iframe>
            </Box>
        );
    }

    if (token.slug === 'test') {
        // just to include TV there
        return <ChartingLibraryTV tokenSlug={token.slug} />;
    }
    return (
        <BlurPlaceholder
            block={'price-chart'}
            customContent={
                <Stack maxWidth={500} px={4}>
                    <Typography variant={'h6'} gutterBottom>
                        Price chart is not available yet. Check back later
                    </Typography>
                    <Typography>
                        This token is either not traded on DEXes yet (no pairs found), or was minted just recently
                    </Typography>
                </Stack>
            }
        />
    );
};

export { UnifiedCandlesGraph };
