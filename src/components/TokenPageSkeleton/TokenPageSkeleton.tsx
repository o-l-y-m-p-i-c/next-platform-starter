'use client';

import { Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { BackButton } from '../BackButton';
import {
    TokenMetricsSkeleton,
    PriceChartSkeleton,
    PriceChangeTableSkeleton,
    HoldersSkeleton,
    MindshareMapSkeleton
} from './components';

export const TokenPageSkeleton = () => {
    return (
        <>
            <Stack mb={2} direction={'row'}>
                <BackButton />
            </Stack>
            <Grid container spacing={2} mb={2}>
                <Grid
                    container
                    order={1}
                    size={{
                        xs: 12,
                        md: 4
                    }}
                >
                    <Stack flex={1} gap={2}>
                        <Stack
                            sx={{
                                padding: 0,
                                position: 'sticky',
                                top: 64 + 10 + 5,
                                width: '100%'
                            }}
                            direction={'column'}
                            minHeight={400}
                        >
                            <Stack
                                sx={{
                                    overflowX: 'hidden',
                                    maxHeight: {
                                        xs: 'auto',
                                        md: 'calc(100svh - 64px - 20px - 52px - 20px - 10px)'
                                    }
                                }}
                            >
                                <TokenMetricsSkeleton />
                            </Stack>
                        </Stack>
                    </Stack>
                </Grid>

                {/* Price Chart */}
                <Grid
                    container
                    order={2}
                    size={{
                        xs: 12,
                        md: 8
                    }}
                >
                    <PriceChartSkeleton />
                </Grid>

                <Grid order={3} size={12}>
                    <PriceChangeTableSkeleton />
                </Grid>

                {/* Holders */}
                <Grid order={4} size={12}>
                    <HoldersSkeleton />
                </Grid>

                {/* Mindshare Map */}
                <Grid order={5} size={12}>
                    <MindshareMapSkeleton />
                </Grid>
            </Grid>
        </>
    );
};
