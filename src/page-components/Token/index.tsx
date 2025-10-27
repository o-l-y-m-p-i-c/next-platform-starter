// 'use client';

// import { Button, ButtonGroup, Stack, Typography, useTheme } from '@mui/material';
// import Box from '@mui/material/Box';
// import Grid from '@mui/material/Grid';
// import { useParams } from 'next/navigation';
// import { useQuery } from '@tanstack/react-query';
// import { MemePaper } from '@/components/MemePaper';
// import { IBackendResponse } from '@/types/Backend';
// import { TToken } from '@/types/responces/Token';
// import ErrorBoundary from '@/components/ErrorBoundary';
// import { useAppGlobal, useFetch } from '@/hooks';
// import { UnifiedCandlesGraph } from '@/components/UnifiedCandlesGraph';
// import { Warning } from '@/components/Warning';
// import { BackButton } from '@/components/BackButton';
// import { useEffect, useMemo, useState } from 'react';
// import { TwitterSentimentThreshold } from '@/modules/twitter/twitter.interfaces';
// import { getTimestampsByThreshold } from '@/modules/twitter/twitter.utils';
// import { TokenMetrics } from '@/components/TokenMetrics';
// import { HoldersTable } from '@/components/HoldersTable';
// import { PriceChangeTable } from '@/components/PriceChangeTable';
// import TokenTwitterSentiments from '@/modules/twitter/components/TokenTwitterSentiments';
import { TokenPageSkeleton } from '@/components/TokenPageSkeleton';
import { Stack } from '@mui/system';

const TokenPage = () => {
    return (
        <Stack>
            <TokenPageSkeleton />
        </Stack>
    );
};

// const TokenPage = () => {
//     const params = useParams();
//     const tokenSlug = typeof params?.tokenSlug === 'string' ? params.tokenSlug : undefined;
//     const theme2 = useTheme();
//     const { fetchData } = useFetch();
//     const { data, isLoading, isFetching, isError } = useQuery<IBackendResponse<TToken>>({
//         queryKey: [`/token/${tokenSlug}`],
//         queryFn: async () => {
//             const { data, error } = await fetchData<IBackendResponse<TToken>>(`/token/${tokenSlug}`);
//             if (error) throw error;
//             return data as IBackendResponse<TToken>;
//         },
//         refetchOnWindowFocus: false,
//         enabled: !!tokenSlug
//     });

//     const { data: dexScreenerData, isLoading: dexScreenerDataIsLoading } = useQuery({
//         queryKey: [`dexscreener-${data?.data?.addresses[0].blockchainAddress}`],
//         queryFn: async () => {
//             const response = await fetch(
//                 `https://api.dexscreener.com/latest/dex/tokens/${data?.data?.addresses[0].blockchainAddress}`
//             );
//             return response.json();
//         },
//         refetchInterval: 2000,
//         refetchOnWindowFocus: false,
//         enabled: !!data?.data && !!data?.data?.addresses[0].blockchainAddress
//     });

//     const { setTheme, theme, isFullWidth } = useAppGlobal();

//     const [customDates, setCustomDates] = useState<[string, string] | undefined>(undefined);
//     const [timeThreshold, setTimeThreshold] = useState<TwitterSentimentThreshold>(30);

//     const { start_date, end_date } = useMemo(
//         () => getTimestampsByThreshold(timeThreshold, customDates),
//         [timeThreshold, customDates]
//     );

//     const [followerCount, setFollowerCount] = useState({
//         minFollowers: 0,
//         maxFollowers: 2000000000000
//     });

//     useEffect(() => {
//         setTheme(undefined);
//         if (data?.data) {
//             if (data.data.tags && data.data.tags.length > 0) {
//                 setTheme(data.data.tags[0].name);
//             }
//         }
//     }, [data, theme]);

//     if (isLoading || isFetching) {
//         return <TokenPageSkeleton />;
//     }

//     if (isError || !data || !data.data) {
//         return (
//             <Stack flex={1}>
//                 <Box>
//                     <BackButton />
//                 </Box>
//                 <Stack alignItems={'center'} py={5} flex={1}>
//                     <Typography variant={'body2'}>Something happened while loading the data...</Typography>
//                 </Stack>
//             </Stack>
//         );
//     }

//     const {
//         name,
//         // description,
//         addresses,
//         imageURL,
//         symbol,
//         warnings,
//         decimals,
//         stats,

//         totalSupply
//     } = data.data;

//     const mainAddressChain = addresses[0].blockchainId;

//     const isSolanaToken = mainAddressChain === 'solana';

//     const handleChangeThreshold = (threshold: TwitterSentimentThreshold) => {
//         setTimeThreshold(threshold);
//         setCustomDates(undefined);
//     };

//     return (
//         <>
//             <Grid container spacing={2} mb={2}>
//                 {warnings && warnings.map((warning, index) => <Warning key={`warning-${index}`} warning={warning} />)}
//                 <Grid
//                     container
//                     size={{
//                         xs: 12
//                     }}
//                 >
//                     {/* Token metrics */}
//                     <Grid
//                         container
//                         order={1}
//                         size={{
//                             xs: 12,
//                             md: 4
//                         }}
//                     >
//                         <Stack flex={1} gap={2}>
//                             <Stack
//                                 sx={{
//                                     padding: 0,
//                                     position: 'sticky',
//                                     top: 64 + 10 + 5,
//                                     width: '100%'
//                                 }}
//                                 direction={'column'}
//                                 minHeight={400}
//                             >
//                                 <Stack mb={2} direction={'row'}>
//                                     <BackButton />
//                                 </Stack>
//                                 <Stack
//                                     sx={{
//                                         overflowX: 'hidden',
//                                         maxHeight: {
//                                             xs: 'auto',
//                                             md: 'calc(100svh - 64px - 20px - 52px - 20px - 10px)'
//                                         }
//                                     }}
//                                 >
//                                     <TokenMetrics
//                                         tokenInfo={{ ...data.data }}
//                                         isLoading={dexScreenerDataIsLoading}
//                                         dexData={{
//                                             ...(dexScreenerData?.pairs ? dexScreenerData?.pairs[0] : null)
//                                         }}
//                                     />
//                                 </Stack>
//                             </Stack>
//                         </Stack>
//                         {/* </Paper> */}
//                     </Grid>
//                     {/* Price */}
//                     <Grid
//                         container
//                         order={2}
//                         size={{
//                             xs: 12,
//                             md: 8
//                         }}
//                     >
//                         <MemePaper title={'Price chart'}>
//                             <Box
//                                 sx={{
//                                     flex: 1,
//                                     display: 'flex',
//                                     flexDirection: 'column',
//                                     justifyContent: 'flex-end',
//                                     minHeight: {
//                                         xs: 500,
//                                         md: 700
//                                     }
//                                 }}
//                             >
//                                 <UnifiedCandlesGraph token={data.data} />
//                             </Box>
//                         </MemePaper>
//                     </Grid>
//                 </Grid>
//                 <Grid
//                     container
//                     size={{
//                         xs: 12,
//                         md: 12
//                     }}
//                 >
//                     {dexScreenerData && dexScreenerData?.pairs && (
//                         <Grid order={3} size={12}>
//                             <PriceChangeTable dexData={{ ...dexScreenerData?.pairs[0] }} tokenInfo={{ ...data.data }} />
//                         </Grid>
//                     )}

//                     {/* Hype */}
//                     <Grid order={isFullWidth ? 3 : 3} size={12}>
//                         <MemePaper
//                             title={'Mindshare Map'}
//                             helpText="Analyze all social media activity and sentiment from posts, comments, and reactions—including deleted tweets—with clickable links to the original content."
//                             headerComponent={
//                                 <Stack alignItems={'center'} alignSelf={'flex-end'} flex={1} gap={1}>
//                                     <Stack alignItems={'center'} alignSelf={'flex-end'}>
//                                         <Stack
//                                             direction={'row'}
//                                             justifyContent={'flex-end'}
//                                             // spacing={2}
//                                             gap={2}
//                                             flexWrap={'wrap'}
//                                             zIndex={1000}
//                                         >
//                                             <ButtonGroup
//                                                 size={'small'}
//                                                 sx={{
//                                                     gap: 1,
//                                                     flexWrap: 'wrap',
//                                                     justifyContent: 'flex-end',
//                                                     button: {
//                                                         borderRadius: '100px!important',
//                                                         borderColor: `${theme2.palette.primary.dark}!important`
//                                                     }
//                                                 }}
//                                                 aria-label="outlined button group"
//                                             >
//                                                 <Button
//                                                     variant={timeThreshold === 1 ? 'contained' : 'outlined'}
//                                                     onClick={() => handleChangeThreshold(1)}
//                                                 >
//                                                     24H
//                                                 </Button>
//                                                 <Button
//                                                     variant={timeThreshold === 3 ? 'contained' : 'outlined'}
//                                                     onClick={() => handleChangeThreshold(3)}
//                                                 >
//                                                     3D
//                                                 </Button>
//                                                 <Button
//                                                     variant={timeThreshold === 7 ? 'contained' : 'outlined'}
//                                                     onClick={() => handleChangeThreshold(7)}
//                                                 >
//                                                     1W
//                                                 </Button>
//                                                 <Button
//                                                     variant={timeThreshold === 30 ? 'contained' : 'outlined'}
//                                                     onClick={() => handleChangeThreshold(30)}
//                                                 >
//                                                     1M
//                                                 </Button>
//                                                 <Button
//                                                     variant={timeThreshold === 90 ? 'contained' : 'outlined'}
//                                                     onClick={() => handleChangeThreshold(90)}
//                                                 >
//                                                     3M
//                                                 </Button>
//                                             </ButtonGroup>
//                                         </Stack>
//                                     </Stack>
//                                 </Stack>
//                             }
//                         >
//                             <ErrorBoundary>
//                                 <Stack gap={2}>
//                                     <TokenTwitterSentiments
//                                         tokenSlug={tokenSlug}
//                                         tokenPrice={
//                                             dexScreenerData?.pairs && dexScreenerData?.pairs.length > 0
//                                                 ? Number(dexScreenerData?.pairs[0].priceUsd)
//                                                 : stats?.tokenUSDPrice
//                                         }
//                                         dexScreenerDataIsLoading={dexScreenerDataIsLoading}
//                                         tokenAddress={addresses[0].blockchainAddress || ''}
//                                         tokenChain={addresses[0].blockchainId || ''}
//                                         tokenImage={imageURL || ''}
//                                         tokenSymbol={symbol}
//                                         tokenName={name}
//                                         start_date={start_date}
//                                         end_date={end_date}
//                                         customDates={customDates}
//                                         timeThreshold={timeThreshold}
//                                         setCustomDates={setCustomDates}
//                                         setTimeThreshold={setTimeThreshold}
//                                         followerCount={followerCount}
//                                         setFollowerCount={setFollowerCount}
//                                     />
//                                 </Stack>
//                             </ErrorBoundary>
//                         </MemePaper>
//                     </Grid>

//                     {/* Holders - Full Width */}
//                     {isSolanaToken && totalSupply && (
//                         <Grid size={12}>
//                             <MemePaper title="Holders">
//                                 <HoldersTable
//                                     slug={tokenSlug}
//                                     tokenName={symbol}
//                                     decimals={decimals}
//                                     totalSupply={totalSupply}
//                                     pairs={dexScreenerData?.pairs ?? []}
//                                     tokenPrice={
//                                         dexScreenerData?.pairs &&
//                                         dexScreenerData?.pairs.length > 0 &&
//                                         dexScreenerData?.pairs[0].priceUsd
//                                             ? Number(dexScreenerData?.pairs[0].priceUsd)
//                                             : stats?.tokenUSDPrice
//                                     }
//                                 />
//                             </MemePaper>
//                         </Grid>
//                     )}
//                 </Grid>
//             </Grid>
//         </>
//     );
// };

export { TokenPage };
