'use client';

import { Skeleton, Stack } from '@mui/material';
import { MemePaper } from '../../MemePaper';

export const HoldersSkeleton = () => {
    return (
        <MemePaper title={<Skeleton variant={'rounded'} width={150} height={36} />}>
            <Stack gap={2}>
                <Skeleton
                    variant="rectangular"
                    height={500}
                    sx={{
                        borderRadius: 2,
                        bgcolor: 'rgba(255, 255, 255, 0.05)'
                    }}
                />
            </Stack>
        </MemePaper>
    );
};
