'use client';

import { Skeleton } from '@mui/material';

export const MindshareGraphSkeleton = ({ variant = 'rounded' }: { variant?: 'rounded' | 'rectangular' }) => {
    return (
        <Skeleton
            variant={variant as 'rounded' | 'text' | 'rectangular' | 'circular'}
            height={500}
            sx={{
                bgcolor: 'rgba(255, 255, 255, 0.05)'
            }}
        />
    );
};
