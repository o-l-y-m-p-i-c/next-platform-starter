import { useQuery } from '@tanstack/react-query';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { shortenAddress } from '../../utils/shortenAddress';
import { formatNumber } from '../../helpers/formatNumber';
import { Stack, styled } from '@mui/system';
import {
    Button,
    Card,
    CircularProgress,
    ClickAwayListener,
    IconButton,
    LinearProgress,
    linearProgressClasses,
    Tooltip,
    Typography
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { DexScreenerPair } from '../TokenInfo/types';
import { useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { handleCopy } from '../../helpers/handleCopy';

const FoundPullElement = ({ address, pull }: { address: string; pull: DexScreenerPair | null }) => {
    const [open, setOpen] = useState(false);

    const labels = pull?.labels ? pull.labels.map((pull_label) => pull_label).join(', ') : null;

    const isRaydiumAuthorityV4Address = address == '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1';

    return (
        <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} gap={0.5}>
            <Button
                onClick={() => handleCopy({ text: address })}
                size={'small'}
                color={'inherit'}
                sx={{
                    textTransform: 'none'
                }}
            >
                {shortenAddress(address, 8)}
            </Button>{' '}
            {pull && !isRaydiumAuthorityV4Address && (
                <>
                    <ClickAwayListener onClickAway={() => setOpen(false)}>
                        <Tooltip
                            title={
                                <Stack>
                                    <Typography variant={'caption'}>
                                        Liquidity pool ({pull.dexId}) {labels}
                                    </Typography>
                                </Stack>
                            }
                            onClose={() => setOpen(false)}
                            open={open}
                            arrow
                        >
                            <IconButton size={'small'} onClick={() => setOpen((prev) => !prev)}>
                                <span
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: 22,
                                        height: 22
                                    }}
                                >
                                    🏦
                                </span>
                            </IconButton>
                        </Tooltip>
                    </ClickAwayListener>
                </>
            )}
            {isRaydiumAuthorityV4Address && (
                <>
                    <ClickAwayListener onClickAway={() => setOpen(false)}>
                        <Tooltip
                            title={
                                <Stack>
                                    <Typography variant={'caption'}>Raydium Authority V4</Typography>
                                </Stack>
                            }
                            onClose={() => setOpen(false)}
                            open={open}
                            arrow
                        >
                            <IconButton size={'small'} onClick={() => setOpen((prev) => !prev)}>
                                <span
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: 22,
                                        height: 22
                                    }}
                                >
                                    🏦
                                </span>
                            </IconButton>
                        </Tooltip>
                    </ClickAwayListener>
                </>
            )}
        </Stack>
    );
};

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[200],
        ...theme.applyStyles('dark', {
            backgroundColor: theme.palette.grey[800]
        })
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: '#1a90ff',
        ...theme.applyStyles('dark', {
            backgroundColor: '#308fe8'
        })
    }
}));

interface Column {
    id: 'rank' | 'address' | 'amount' | 'percentage' | 'value' | 'explore';
    label: string;
    minWidth?: number;
    width?: number;
    align?: 'right' | 'center';
    format?: (value: any) => any;
}

const columns: Column[] = [
    { id: 'rank', label: 'Rank', align: 'center', width: 100 },
    {
        id: 'address',
        label: 'Address',
        align: 'center',
        minWidth: 100,
        format: ({ address, foundPull }) => {
            if (foundPull) {
                return <FoundPullElement address={address} pull={foundPull} />;
            }
            return <FoundPullElement address={address} pull={null} />;
        }
    },
    {
        id: 'percentage',
        label: '%',
        width: 100,
        align: 'center',
        format: (value: number) => `${value}%`
    },
    {
        id: 'amount',
        label: 'Amount',
        minWidth: 170,
        align: 'center',
        format: ({
            value,
            totalSupplyUI,
            percentage
        }: {
            value: number;
            minValue: number;
            totalSupplyUI: number;
            percentage: string;
        }) => {
            return (
                <Stack flexDirection={'row'} alignItems={'center'} gap={2} justifyContent={'center'}>
                    <Typography
                        sx={{
                            width: 65
                        }}
                    >
                        {formatNumber(value, 2, 2)}
                    </Typography>
                    <Stack
                        sx={{
                            minWidth: 200
                        }}
                    >
                        <BorderLinearProgress value={Number(percentage)} variant="determinate" />
                    </Stack>
                    <Typography
                        sx={{
                            width: 65
                        }}
                    >
                        {formatNumber(totalSupplyUI, 2, 1)}
                    </Typography>
                </Stack>
            );
        }
    },

    {
        id: 'value',
        label: 'Value',
        width: 100,
        align: 'center',
        format: (value: number) => `$${formatNumber(value, 2, 2)}`
    },
    {
        id: 'explore',
        label: 'Holdings',
        width: 100,
        align: 'center',
        format: (value: string) => (
            <IconButton target={'_blank'} href={`https://solscan.io/account/${value}#portfolio`}>
                <OpenInNewIcon />
            </IconButton>
        )
        // format: (value: number) => value.toFixed(2),
    }
];

const pieParams = {
    margin: { right: 5 },
    slotProps: {
        legend: {
            hidden: true
        } as any
    }
};

const SupplyChartElement = ({
    tokenName = 'tokenName',
    fullValue = 0,
    supplyValue = 0,
    value,
    title,
    undertitle,
    chartHoverTitle,
    chartCenteredLabel
}: {
    fullValue: number;
    supplyValue: number;
    tokenName: string;
    value: number;
    title: string;
    undertitle: string;
    chartHoverTitle: string;
    chartCenteredLabel: string;
}) => {
    return (
        <Card
            variant={'outlined'}
            sx={{
                p: 1,
                flex: {
                    xs: 1
                },
                textAlign: {
                    xs: 'center'
                }
            }}
        >
            <Stack direction={'row'} alignItems={'center'} gap={1}>
                <Stack
                    sx={{
                        position: 'relative'
                    }}
                >
                    <Typography
                        sx={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            textAlign: 'center',
                            transform: 'translate(-50%,-50%)'
                        }}
                        variant={'caption'}
                        fontWeight={'bold'}
                    >
                        {chartCenteredLabel}
                    </Typography>
                    <PieChart
                        series={[
                            {
                                data: [
                                    {
                                        id: 0,
                                        value: Number(value.toFixed(2) ?? 0),
                                        label: `${chartHoverTitle} ${formatNumber(fullValue)} $${tokenName}`
                                    },
                                    {
                                        id: 1,
                                        color: '#ffffff00',

                                        value: 100 - Number(value.toFixed(2) ?? 0),
                                        // value: supplyValue,
                                        label: `Total supply ${formatNumber(supplyValue)} $${tokenName}`
                                    }
                                ],
                                paddingAngle: 5,
                                cornerRadius: 5,
                                valueFormatter: (value) => {
                                    return `${value.value.toFixed(2)}%`;
                                },
                                innerRadius: 25
                            }
                        ]}
                        width={100}
                        height={100}
                        {...pieParams}
                    />
                </Stack>
                <Stack
                    sx={{
                        textAlign: 'left'
                    }}
                >
                    <Typography variant={'caption'}>{title}</Typography>
                    <Typography variant={'h5'} fontWeight={'bold'}>
                        {value.toFixed(2)}%
                    </Typography>
                    <Typography variant={'caption'}>{undertitle}</Typography>
                </Stack>
            </Stack>
        </Card>
    );
};
export function HoldersTable({
    slug,
    decimals,
    tokenPrice = 0,
    tokenName,
    pairs,
    totalSupply
}: {
    slug: string | undefined;
    tokenName: string;
    decimals: number;
    tokenPrice: number | undefined;
    pairs: DexScreenerPair[];
    totalSupply: number;
}) {
    const { data, error, isLoading } = useQuery<{
        data: {
            address: string;
            amount: number;
            percentage: string;
        }[];
    }>({
        queryKey: [`/token/${slug}/holders`]
        // enabled: !!slug,
    });

    const RaydiumAuthorityV4Address = '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1';

    const totalSupplyUI = totalSupply / 10 ** decimals;

    let summTop5Holdings = 0;
    let summTop10Holdings = 0;
    let summTop20Holdings = 0;

    const newRows =
        data?.data.map((data_item, index) => {
            const { address, amount, percentage } = data_item;
            const value = tokenPrice * (amount / 10 ** decimals);

            const foundPull =
                pairs.find((pair) => pair.pairAddress === address) || RaydiumAuthorityV4Address === address;

            if (!foundPull && index < 5) {
                summTop5Holdings += amount / 10 ** decimals;
            }

            if (!foundPull && index < 10) {
                summTop10Holdings += amount / 10 ** decimals;
            }
            if (!foundPull && index < 20) {
                summTop20Holdings += amount / 10 ** decimals;
            }

            return {
                ...data_item,
                rank: `#${index + 1}`,
                address: {
                    address,
                    foundPull
                },
                amount: {
                    value: amount / 10 ** decimals,
                    percentage,
                    minValue: 0,
                    totalSupplyUI
                },
                percentage,
                value,
                explore: address
            };
        }) ?? [];

    if (!slug) return <></>;

    const top5HoldInPerc = (summTop5Holdings / (totalSupplyUI * 1)) * 100;
    const top10HoldInPerc = (summTop10Holdings / (totalSupplyUI * 1)) * 100;
    const top20HoldInPerc = (summTop20Holdings / (totalSupplyUI * 1)) * 100;

    return (
        <>
            <Stack
                // justifyContent={'flex-end'}
                sx={{
                    flexDirection: {
                        xs: 'columns',
                        md: 'row'
                    }
                }}
                gap={1}
            >
                {newRows.length > 0 && (
                    <SupplyChartElement
                        supplyValue={Number(totalSupplyUI.toFixed(2))}
                        tokenName={tokenName}
                        fullValue={Number(summTop5Holdings.toFixed(2))}
                        value={top5HoldInPerc}
                        title={'Top 5 wallets hold'}
                        undertitle={'of total supply'}
                        chartHoverTitle={'Top 5 wallets hold'}
                        chartCenteredLabel={'Top5'}
                    />
                )}
                {newRows.length > 0 && (
                    <SupplyChartElement
                        supplyValue={Number(totalSupplyUI.toFixed(2))}
                        tokenName={tokenName}
                        fullValue={Number(summTop10Holdings.toFixed(2))}
                        value={top10HoldInPerc}
                        title={'Top 10 wallets hold'}
                        undertitle={'of total supply'}
                        chartHoverTitle={'Top 10 wallets hold'}
                        chartCenteredLabel={'Top10'}
                    />
                )}
                {newRows.length > 0 && (
                    <SupplyChartElement
                        supplyValue={Number(totalSupplyUI.toFixed(2))}
                        tokenName={tokenName}
                        fullValue={Number(summTop20Holdings.toFixed(2))}
                        value={top20HoldInPerc}
                        title={'Top 20 wallets hold'}
                        undertitle={'of total supply'}
                        chartHoverTitle={'Top 20 wallets hold'}
                        chartCenteredLabel={'Top20'}
                    />
                )}
            </Stack>
            <Card sx={{ mt: 1 }} variant={'outlined'}>
                <TableContainer sx={{ maxHeight: 600 }}>
                    {/* aria-label="sticky table" */}
                    <Table stickyHeader size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{
                                            top: 0,
                                            minWidth: column.minWidth,
                                            width: column.width
                                        }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading && (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center">
                                        <Stack sx={{ minHeight: 543 }} alignItems={'center'} justifyContent={'center'}>
                                            <CircularProgress size={35} />
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            )}
                            {!isLoading && error && (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center">
                                        <Stack sx={{ minHeight: 543 }} alignItems={'center'} justifyContent={'center'}>
                                            <Typography>{error.message}</Typography>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            )}
                            {!isLoading &&
                                newRows.map((row) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.rank}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.format ? column.format(value) : value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                            {!isLoading && newRows.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center">
                                        <Stack sx={{ minHeight: 543 }} alignItems={'center'} justifyContent={'center'}>
                                            <Typography>No data</Typography>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </>
    );
}
