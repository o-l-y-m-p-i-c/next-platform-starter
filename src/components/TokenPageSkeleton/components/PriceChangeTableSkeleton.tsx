'use client';

import { Skeleton, Stack } from '@mui/material';
import { MemePaper } from '../../MemePaper';

export const PriceChangeTableSkeleton = () => {
    return (
        <MemePaper>
            <Stack gap={1}>
                <Skeleton variant={'rounded'} width={150} height={36} />
                <Stack direction="row" gap={2}>
                    {[1, 2, 3, 4, 5].map((col) => (
                        <Stack key={col} flex={1}>
                            <Skeleton variant="text" width="100%" height={60} />
                            <Skeleton variant="text" width="100%" height={60} />
                        </Stack>
                    ))}
                </Stack>
            </Stack>
        </MemePaper>
    );
};
