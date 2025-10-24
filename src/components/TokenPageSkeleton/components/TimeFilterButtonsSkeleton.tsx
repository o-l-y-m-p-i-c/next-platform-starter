'use client';

import { Skeleton, Stack } from '@mui/material';

export const TimeFilterButtonsSkeleton = ({ count = 5 }: { count?: number }) => {
    return (
        <Stack direction={'row'} gap={1} justifyContent={'flex-end'} flex={1}>
            {Array.from({ length: count }).map((_, index) => (
                <Skeleton key={index} variant="rectangular" width={50} height={36} sx={{ borderRadius: 20 }} />
            ))}
        </Stack>
    );
};
