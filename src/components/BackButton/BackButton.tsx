'use client';

import { Button } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export const BackButton = () => {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // This is intentional for hydration safety - prevents SSR/client mismatch
        setMounted(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!mounted) {
        return (
            <Button variant={'outlined'} disabled startIcon={<ArrowBackIosIcon />}>
                Back
            </Button>
        );
    }

    return (
        <Button variant={'outlined'} onClick={() => router.back()} startIcon={<ArrowBackIosIcon />}>
            Back
        </Button>
    );
};
