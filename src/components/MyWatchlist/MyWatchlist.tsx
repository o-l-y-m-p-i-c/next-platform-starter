import { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';

import type { TToken } from '@/types/responces/Token';
import { IBackendResponsePagination } from '@/types/Backend';
import { PaginatedList } from '../PaginatedList';
import { TokenInfoCard } from '../TokenInfoCard';

const MyWatchlist: FC = () => {
  const limit = 10000;

  const {
    data,
    error: errorWatchlistData,
    isLoading,
  } = useQuery<IBackendResponsePagination<TToken>>({
    queryKey: ['/users/whatchlist', { limit, page: 1 }],
  });

  if (errorWatchlistData) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        Error loading collection
      </Box>
    );
  }

  return (
    <Stack gap={2} p={1}>
      {isLoading && (
        <Stack p={2} pt={4} alignItems={'center'}>
          <CircularProgress />
        </Stack>
      )}
      {!isLoading && data?.data?.length === 0 && (
        <Stack p={2} pt={4}>
          <Typography fontWeight={'bold'}>No data</Typography>
        </Stack>
      )}
      <PaginatedList
        itemsPerPage={5}
        items={data?.data ?? []}
        renderItem={TokenInfoCard}
      />
    </Stack>
  );
};

export { MyWatchlist };
