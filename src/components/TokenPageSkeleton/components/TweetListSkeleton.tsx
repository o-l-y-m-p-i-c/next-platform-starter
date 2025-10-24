'use client';

import { Stack } from '@mui/material';
import { TweetCardSkeleton } from './TweetCardSkeleton';

export const TweetListSkeleton = ({ count = 3 }: { count?: number }) => {
    return (
        <Stack gap={2}>
            {Array.from({ length: count }).map((_, index) => (
                <TweetCardSkeleton key={index} />
            ))}
        </Stack>
    );
};
