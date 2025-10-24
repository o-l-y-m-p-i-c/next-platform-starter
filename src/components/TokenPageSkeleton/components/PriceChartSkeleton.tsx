'use client';

import { Skeleton, Stack, Box } from '@mui/material';
import { MemePaper } from '../../MemePaper';

export const PriceChartSkeleton = () => {
    return (
        <MemePaper title={<Skeleton variant={'rounded'} width={200} height={42} />}>
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    minHeight: {
                        xs: 500
                    }
                }}
            >
                <Stack gap={2} flex={1}>
                    <Skeleton
                        variant="rectangular"
                        sx={{
                            borderRadius: 2,
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            flex: 1
                        }}
                    />
                </Stack>
            </Box>
        </MemePaper>
    );
};
