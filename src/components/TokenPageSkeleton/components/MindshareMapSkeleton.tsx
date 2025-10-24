'use client';

import { Skeleton, Stack } from '@mui/material';
import { MemePaper } from '../../MemePaper';
import { MindshareGraphSkeleton } from './MindshareGraphSkeleton';
import { TweetListSkeleton } from './TweetListSkeleton';
import { TimeFilterButtonsSkeleton } from './TimeFilterButtonsSkeleton';

export const MindshareMapSkeleton = () => {
    return (
        <MemePaper
            title={<Skeleton variant={'rounded'} width={150} height={36} />}
            headerComponent={<TimeFilterButtonsSkeleton />}
        >
            <Stack gap={2}>
                <MindshareGraphSkeleton />
                <TweetListSkeleton count={5} />
            </Stack>
        </MemePaper>
    );
};
