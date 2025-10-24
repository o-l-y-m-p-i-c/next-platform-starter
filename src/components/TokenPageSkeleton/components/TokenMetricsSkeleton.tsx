'use client';

import { Skeleton, Stack } from '@mui/material';
import { MemePaper } from '../../MemePaper';

export const TokenMetricsSkeleton = () => {
    return (
        <MemePaper>
            <Stack gap={2}>
                <Stack direction={'row'} gap={2}>
                    <Skeleton variant={'circular'} width={42} height={42} sx={{ minWidth: 42 }} />
                    <Skeleton variant="rounded" width={'100%'} height={42} />
                    <Skeleton
                        sx={{
                            ml: 'auto',
                            minWidth: 42
                        }}
                        variant="circular"
                        width={42}
                        height={42}
                    />
                </Stack>
                <Skeleton variant="rounded" height={42} />
                <Skeleton variant="rounded" height={42} />
                <Skeleton variant="rounded" height={42} />
                <Skeleton variant="rounded" height={42} />
                <Skeleton variant="rounded" height={42} />
                <Skeleton variant="rounded" height={42} />
                <Skeleton variant="rounded" height={42} />
                <Skeleton variant="rounded" height={42} />
            </Stack>
        </MemePaper>
    );
};
