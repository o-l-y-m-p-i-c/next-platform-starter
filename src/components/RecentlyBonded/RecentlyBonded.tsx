'use client';

import { useRef } from 'react';
import { Button, CircularProgress, Stack } from '@mui/material';
import type { TToken } from '@/types/responces/Token';
import Link from 'next/link';

import { useQuery } from '@tanstack/react-query';
import { RecentlyTable } from './RecentlyTable';
import r from '@/constants/routes.constants';
import { TokenInfoCard } from '../TokenInfoCard';
import { MemePaper } from '../MemePaper';

const RecentlyBonded = ({ isPreview = true }: { isPreview?: boolean }) => {
  const period = useRef<'1H' | '2H' | '4H' | '6H' | '12H' | '24H'>('12H');

  // todo: pagination
  const {
    data: tokens,
    isLoading,
    refetch: refetchTokens,
  } = useQuery<{
    data: TToken[];
  }>({
    queryKey: [
      `/token/pumpfunMigrated?period=${period.current}&limit=${isPreview ? 5 : 200}`,
    ],
  });

  const periods: Array<'1H' | '2H' | '4H' | '6H' | '12H' | '24H'> = [
    '1H',
    '2H',
    '4H',
    '6H',
    '12H',
    '24H',
  ];

  const handlePeriodClick = (
    _period: '1H' | '2H' | '4H' | '6H' | '12H' | '24H',
  ) => {
    period.current = _period;
    refetchTokens();
  };

  return (
    <>
      <MemePaper
        title="Recently Bonded"
        helpText="Stay updated with a stream of new tokens entering the market."
        headerComponent={
          <Stack
            direction={'row'}
            sx={{
              flex: 1,
              justifyContent: 'flex-end',
              height: 24,
              gap: 2.5,
            }}
          >
            {periods.map((_period) => (
              <Button
                size="small"
                key={`minted_${_period}`}
                onClick={() => {
                  handlePeriodClick(_period);
                }}
                sx={{
                  borderRadius: '100%!important',
                  height: 40,
                  minWidth: 40,
                  width: 40,
                  transform: 'translateY(-20%)',
                }}
                variant={_period === period.current ? 'contained' : 'outlined'}
              >
                {_period}
              </Button>
            ))}
          </Stack>
        }
      >
        {!isPreview && (
          <>
            <RecentlyTable data={tokens?.data ?? []} />
          </>
        )}
        {isPreview && (
          <>
            <Stack
              flex={1}
              spacing={1}
              sx={{
                overflowX: 'hidden',
              }}
            >
              {tokens?.data &&
                tokens.data?.map((token, index) => (
                  <TokenInfoCard key={`${token.slug}-${index}`} data={token} />
                ))}
              {isLoading && (
                <Stack justifyContent={'center'} alignItems={'center'} flex={1}>
                  <CircularProgress />
                </Stack>
              )}
            </Stack>
            <Stack mt={1.5}>
              {/* <Button
                component={NavLink}
                href={`${r.recentlyBonded}`}
                variant={'contained'}
                size="small"
              >
                View all
              </Button> */}
              <Link
                href={`${r.recentlyBonded}`}
                style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
              >
                <Button variant={'contained'} size="small">
                  View all
                </Button>
              </Link>
            </Stack>
          </>
        )}
      </MemePaper>
    </>
  );
};
export { RecentlyBonded };
