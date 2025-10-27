'use client';

import { Stack, useTheme } from '@mui/system';
import Lottie from 'lottie-react';
import { useEffect, useRef, useState } from 'react';
import preloaderLottie from '@/assets/Lotties/intro_square.json';

// Track if preloader has already been shown in this session
let hasShownPreloader = false;

export const Preloader = () => {
    const theme = useTheme();
    const preloaderContainerRef = useRef<HTMLDivElement>(null);
    const [showLoadingLottie, setLoadingLottie] = useState(!hasShownPreloader);
    const [shouldRender, setShouldRender] = useState(!hasShownPreloader);

    useEffect(() => {
        // If preloader was already shown, don't render it
        if (hasShownPreloader) {
            setShouldRender(false);
            return;
        }

        // Mark as shown for this session
        hasShownPreloader = true;
    }, []);

    useEffect(() => {
        if (!showLoadingLottie && preloaderContainerRef.current) {
            setTimeout(() => {
                setShouldRender(false);
            }, 1000);
        }
    }, [preloaderContainerRef, showLoadingLottie]);

    // Don't render if already shown
    if (!shouldRender) {
        return null;
    }

    return (
        <Stack
            ref={preloaderContainerRef}
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 9999999,
                background: theme.palette.background.paper,
                ...(!showLoadingLottie && {
                    animation: 'fadeOut 1s ease-out forwards',
                    pointerEvents: 'none'
                })
            }}
            direction={'row'}
            alignItems={'center'}
            justifyContent={'center'}
        >
            <Stack
                sx={{
                    height: '50vh'
                    // maxWidth: '70vw',
                }}
            >
                <Lottie
                    onComplete={() => setLoadingLottie(false)}
                    style={{
                        height: '50vh'
                    }}
                    animationData={preloaderLottie}
                    loop={false}
                />
            </Stack>
        </Stack>
    );
};
