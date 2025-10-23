'use client';

import { Paper, Typography } from '@mui/material';
import { Stack, SxProps } from '@mui/system';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { formatNumber } from '../../helpers/formatNumber';

export function Card({
  icon,
  title,
  undertitle,
  description,
  counter,
  counterAfterPointer = 2,
  counterPrefix,
  isFormated = true,
  counterfixedAfterCount = 1,
  headerProps,
  paperProps,
}: {
  icon?: ReactNode;
  title?: string;
  counter?: number;
  isFormated?: boolean;
  counterAfterPointer?: number;
  counterfixedAfterCount?: number;
  counterPrefix?: string;
  undertitle?: string;
  description?: ReactNode;
  headerProps?: SxProps;
  paperProps?: SxProps;
}) {
  const [currentCounter, setCurrentCounter] = useState(0);
  const [isStarted, setStartingFlag] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setStartingFlag(true);
        }
      });
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [containerRef]);

  useEffect(() => {
    if (isStarted) {
      if (counter && counter > 0) {
        const increment = counter / 50;
        const interval = setInterval(() => {
          setCurrentCounter((prev) => {
            if (prev + increment >= counter) {
              clearInterval(interval);
              return counter;
            }
            return prev + increment;
          });
        }, 20);
        return () => clearInterval(interval);
      }
    }
  }, [counter, isStarted]);

  return (
    <>
      <Paper
        ref={containerRef}
        sx={{
          display: 'flex',
          flex: {
            xs: 1,
            md: 'none',
          },
          minWidth: {
            xs: 200,
          },
          // maxWidth: {
          //   sm: 373,
          // },
          ...paperProps,
        }}
      >
        <Stack p={2} gap={2} flex={1}>
          <Stack direction={'row'} gap={2} alignItems={'center'}>
            {icon}
            <Stack flex={1} gap={2} sx={headerProps}>
              {(title || counter || counterPrefix) && (
                <Typography fontWeight={'bold'} variant={'h5'}>
                  {title}{' '}
                  {counter &&
                    !isFormated &&
                    currentCounter.toFixed(counterfixedAfterCount)}
                  {counter &&
                    isFormated &&
                    formatNumber(
                      currentCounter,
                      counterAfterPointer,
                      counterfixedAfterCount,
                    )}{' '}
                  {counterPrefix}
                </Typography>
              )}
              {undertitle && <Typography>{undertitle}</Typography>}
            </Stack>
          </Stack>
          {description && <Stack>{description}</Stack>}
        </Stack>
      </Paper>
    </>
  );
}
