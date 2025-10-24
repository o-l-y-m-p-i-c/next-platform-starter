import { Button, Card, Divider, LinearProgress, linearProgressClasses, Skeleton, Typography } from '@mui/material';
import { Box, Stack, styled } from '@mui/system';
import { FC, useEffect, useState } from 'react';
import { DexScreenerPair, Transactions } from '../TokenInfo/types';
import { formatNumber } from '../../helpers/formatNumber';
import TokenUSDPrice from '../TokenUSDPrice';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { makeAddressObj } from '../ChainIcon';
import { renderExchangeIcon } from '../../helpers/renderExchangeIcon';
import { MyWatchListToggl } from '../MyWatchlist';
import { ShareButton } from '../ShareButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { TToken } from '@/types/responces/Token';
import { QuickBuyButton } from '../QuickBuyButton';
import { shortenAddress } from '../../utils/shortenAddress';
import { usePathname } from 'next/navigation';
import { TokenMetricsSkeleton } from '../TokenPageSkeleton';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.error.main
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 0,
        backgroundColor: theme.palette.success.main
    }
}));

function TabDexContentRow({
    title = 'Title',
    leftSideLabel = 'Left Side',
    rightSideLabel = 'Right Side',
    leftSideValue = 0,
    rightSideValue = 0
}: {
    title: string;
    leftSideLabel: string;
    rightSideLabel: string;
    leftSideValue: number;
    rightSideValue: number;
}) {
    const sum = leftSideValue + rightSideValue;
    const perc = (leftSideValue / sum) * 100 || 0;

    return (
        <Stack direction={'row'} spacing={2} alignItems={'center'}>
            <Stack
                sx={{
                    minWidth: 60,
                    width: 60,
                    pb: 2,
                    pt: 2,
                    textAlign: 'left'
                }}
            >
                <Typography>{title}</Typography>
                <Typography
                    sx={{
                        color: '#fff',
                        fontWeight: 'bold'
                    }}
                >
                    {formatNumber(sum, 0)}
                </Typography>
            </Stack>
            <Divider orientation="vertical" flexItem />
            <Stack
                sx={{
                    pb: 2,
                    pt: 2
                }}
                flex={1}
            >
                <Stack direction={'row'} justifyContent={'space-between'} pb={1}>
                    <Stack
                        sx={{
                            textAlign: 'left'
                        }}
                    >
                        <Typography variant="caption">{leftSideLabel}</Typography>
                        <Typography
                            sx={{
                                color: '#fff',
                                fontWeight: 'bold'
                            }}
                        >
                            {formatNumber(leftSideValue, 0)}
                        </Typography>
                    </Stack>
                    <Stack
                        sx={{
                            textAlign: 'right'
                        }}
                    >
                        <Typography variant="caption">{rightSideLabel}</Typography>
                        <Typography
                            sx={{
                                color: '#fff',
                                fontWeight: 'bold'
                            }}
                        >
                            {formatNumber(rightSideValue, 0)}
                        </Typography>
                    </Stack>
                </Stack>
                <BorderLinearProgress value={perc} variant="determinate" />
            </Stack>
        </Stack>
    );
}

export function TabDexContent({
    txns,
    tweets
}: {
    txns: Transactions;
    tweets: {
        negative: number;
        positive: number;
    };
}) {
    return (
        <>
            <Stack>
                <TabDexContentRow
                    {...{
                        title: 'TXNS',
                        leftSideLabel: 'Buys',
                        rightSideLabel: 'Sells',
                        leftSideValue: txns.buys,
                        rightSideValue: txns.sells
                    }}
                />
                <TabDexContentRow
                    {...{
                        title: 'TWEETS',
                        leftSideLabel: 'Positive',
                        rightSideLabel: 'Negative',
                        leftSideValue: tweets.positive,
                        rightSideValue: tweets.negative
                    }}
                />
            </Stack>
        </>
    );
}

export const InfoBlock = ({
    children,
    hasBottomBorder = true
}: {
    children: React.ReactNode;
    hasBottomBorder?: boolean;
}) => {
    return (
        <Card
            variant={'outlined'}
            sx={{
                backgroundColor: 'transparent',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1.5,
                pl: 0,
                pr: 0,
                ...(!hasBottomBorder && {
                    borderBottom: 0
                }),
                borderRadius: 0,
                borderLeft: 0,
                borderRight: 0,
                borderTop: 0,
                flex: 1,
                // textAlign: 'center',

                '*': {
                    lineHeight: '1.2!important'
                }
                // 'h6:nth-child(2)': {
                //   fontWeight: 'bold',
                // },
            }}
        >
            {children}
        </Card>
    );
};

const TokenMetrics: FC<{
    tokenInfo: TToken;
    dexData: DexScreenerPair;
    isLoading: boolean;
}> = ({ tokenInfo, dexData, isLoading }) => {
    const {
        chainId,
        dexId,
        baseToken,

        info,
        priceUsd,
        priceNative,
        liquidity = { usd: 0 },
        fdv,
        marketCap,
        quoteToken
    } = dexData;

    const pathname = usePathname();

    const [url, setUrl] = useState(`https://trenchspy.ai${pathname}`);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUrl(window.location.href);
        }
    }, []);

    if (isLoading) {
        return <TokenMetricsSkeleton />;
    }

    return (
        <Stack gap={1} sx={{ width: '100%' }}>
            <Stack
                sx={{
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <img
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        maxHeight: 200,
                        position: 'absolute',
                        opacity: 0.4,
                        zIndex: -1,
                        filter: 'blur(25px)',
                        left: 0,
                        top: 0
                    }}
                    src={info?.header}
                    alt=""
                />
                <img
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        maxHeight: 200
                    }}
                    src={info?.header}
                    alt=""
                />
            </Stack>
            <Stack gap={1}>
                <Stack mb={0} direction={'row'} alignItems={'center'} gap={2}>
                    <Box
                        sx={{
                            width: 42,
                            height: 42,
                            borderRadius: 100,
                            overflow: 'hidden'
                        }}
                    >
                        <img
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                            src={tokenInfo.imageURL}
                            alt=""
                        />
                    </Box>
                    {info && info.header ? (
                        <>
                            <Stack
                                direction={'row'}
                                color={'#fff'}
                                gap={0.5}
                                flex={1}
                                // spacing={0.5}
                                alignItems={'center'}
                            >
                                {baseToken && quoteToken && (
                                    <>
                                        <Typography fontWeight={'bold'}>{baseToken.symbol}</Typography>{' '}
                                        <Typography fontWeight={'bold'}>/</Typography>
                                        <Typography fontWeight={'bold'} mr={2}>
                                            {quoteToken.symbol}
                                        </Typography>
                                    </>
                                )}
                                <Stack
                                    sx={{
                                        ml: 'auto'
                                    }}
                                >
                                    <MyWatchListToggl
                                        token={{ slug: tokenInfo.slug, name: tokenInfo.name }}
                                        isInMyWatchlist={tokenInfo.isInMyWatchlist}
                                        queryKeys={[`/token/${tokenInfo.slug}`]}
                                        mode={'token'}
                                    />
                                </Stack>
                            </Stack>
                        </>
                    ) : (
                        <Stack direction={'row'} flex={1} alignItems={'center'} gap={1}>
                            <Stack direction={'row'} gap={1}>
                                <Typography fontWeight={'bold'}>{tokenInfo.symbol}</Typography>
                                <Typography fontWeight={'bold'}>/</Typography>
                                <Typography fontWeight={'bold'} textTransform={'uppercase'}>
                                    {tokenInfo.addresses[0].blockchainId}
                                </Typography>
                            </Stack>
                            <Stack
                                sx={{
                                    ml: 'auto'
                                }}
                            >
                                <MyWatchListToggl
                                    token={{ slug: tokenInfo.slug, name: tokenInfo.name }}
                                    isInMyWatchlist={tokenInfo.isInMyWatchlist}
                                    queryKeys={[`/token/${tokenInfo.slug}`]}
                                    mode={'token'}
                                />
                            </Stack>
                        </Stack>
                    )}
                </Stack>

                <Typography
                    sx={{
                        fontWeight: 'bold',
                        '*': {
                            fontWeight: 'bold!important'
                        }
                    }}
                    fontSize={25}
                >
                    $
                    <TokenUSDPrice price={Number(priceUsd ?? tokenInfo.stats?.tokenUSDPrice ?? 0)} showUSD={false} />
                </Typography>

                {baseToken && chainId && (
                    <Stack direction={'row'} alignItems={'center'} spacing={0.5}>
                        <Stack direction={'row'} alignItems={'center'} gap={0.5}>
                            {makeAddressObj({
                                blockchainId: chainId,
                                blockchainAddress: baseToken.address
                            })?.image && (
                                <img
                                    style={{
                                        width: 20,
                                        height: 20,
                                        minWidth: 20
                                    }}
                                    src={
                                        makeAddressObj({
                                            blockchainId: chainId,
                                            blockchainAddress: baseToken.address
                                        })?.image
                                    }
                                />
                            )}
                            <Typography>{chainId}</Typography>
                        </Stack>
                        <ArrowForwardIosIcon
                            sx={{
                                width: 10
                            }}
                        />
                        <Stack direction={'row'} alignItems={'center'} gap={0.5}>
                            {renderExchangeIcon({ type: dexId }) && (
                                <img
                                    style={{
                                        width: 20,
                                        height: 20,
                                        minWidth: 20
                                    }}
                                    src={renderExchangeIcon({ type: dexId }) ?? ''}
                                />
                            )}
                            <Typography>{dexId}</Typography>
                        </Stack>
                    </Stack>
                )}
            </Stack>

            <QuickBuyButton
                sx={{
                    mt: 1
                }}
                address={tokenInfo.addresses[0].blockchainAddress}
                chainID={tokenInfo.addresses[0].blockchainId}
            />

            <Stack>
                <InfoBlock>
                    <Typography variant={'subtitle1'}>Address</Typography>
                    <Stack direction={'row'} alignItems={'center'} gap={1}>
                        <Typography
                            variant={'subtitle1'}
                            fontWeight={'bold'}
                            title={tokenInfo.addresses[0].blockchainAddress}
                        >
                            {shortenAddress(tokenInfo.addresses[0].blockchainAddress, 6)}
                        </Typography>
                        <Button
                            variant={'text'}
                            sx={{
                                minWidth: 0,
                                pl: 1,
                                pr: 1
                            }}
                            onClick={() => {
                                navigator.clipboard.writeText(tokenInfo.addresses[0].blockchainAddress);
                            }}
                        >
                            <ContentCopyIcon fontSize="small" />
                        </Button>
                    </Stack>
                </InfoBlock>
                <InfoBlock>
                    <Typography variant={'subtitle1'}>Updated</Typography>
                    <Typography variant={'subtitle1'} fontWeight={'bold'}>
                        {dexData?.priceChange
                            ? 'Just now'
                            : tokenInfo.stats?.updatedAt
                            ? new Intl.DateTimeFormat('ru', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: '2-digit',
                                  hour12: false
                              }).format(new Date(tokenInfo.stats?.updatedAt))
                            : '-'}
                    </Typography>
                </InfoBlock>
                {tokenInfo.mintedAt && (
                    <InfoBlock>
                        <Typography variant={'subtitle1'}>Minted </Typography>
                        <Typography variant={'subtitle1'} fontWeight={'bold'}>
                            {new Intl.DateTimeFormat('ru', {
                                hour: '2-digit',
                                minute: '2-digit',
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit',
                                hour12: false
                            }).format(new Date(tokenInfo.mintedAt))}
                        </Typography>
                    </InfoBlock>
                )}
                <InfoBlock>
                    <Typography variant={'subtitle1'}>Price</Typography>
                    <Typography
                        variant={'subtitle1'}
                        sx={{
                            fontWeight: 'bold!important',
                            '*': {
                                fontWeight: 'bold!important'
                            }
                        }}
                        color="#fff"
                    >
                        <TokenUSDPrice price={Number(priceNative ?? 0)} showUSD={false} />{' '}
                        {quoteToken && quoteToken.symbol}
                    </Typography>
                </InfoBlock>

                <InfoBlock>
                    <Typography variant={'subtitle1'}>Liquidity</Typography>
                    <Typography variant={'subtitle1'} color="#fff">
                        ${formatNumber(liquidity?.usd ?? 0)}
                    </Typography>
                </InfoBlock>
                <InfoBlock>
                    <Typography variant={'subtitle1'}>FDV</Typography>
                    <Typography variant={'subtitle1'} color="#fff">
                        ${formatNumber(fdv || 0)}
                    </Typography>
                </InfoBlock>
                <InfoBlock hasBottomBorder={false}>
                    <Typography variant={'subtitle1'}>Market Cap</Typography>
                    <Typography variant={'subtitle1'} color="#fff">
                        ${formatNumber(marketCap ?? tokenInfo.stats?.USDMarketCap ?? 0)}
                    </Typography>
                </InfoBlock>
            </Stack>
            <Stack mt={1}>
                <ShareButton
                    btnTitle={<ContentCopyIcon fontSize="small" />}
                    variant={'contained'}
                    // title={`${name}`}
                    text={`${tokenInfo.name}\n\n${tokenInfo.addresses[0].blockchainAddress}`}
                    url={url}
                />
            </Stack>
        </Stack>
    );
};

export { TokenMetrics };
