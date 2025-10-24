'use client';

import { Skeleton, Stack } from '@mui/material';

export const TweetCardSkeleton = () => {
    return (
        <Stack
            py={1}
            sx={{
                borderRadius: 2
            }}
        >
            <Stack direction="row" gap={2}>
                <Skeleton variant="rounded" width={70} height={70} />
                <Stack flex={1} gap={2} direction={'row'} sx={{ height: 70 }}>
                    <Skeleton variant={'rounded'} width="100%" height={70} />
                </Stack>
            </Stack>
        </Stack>
    );
};
