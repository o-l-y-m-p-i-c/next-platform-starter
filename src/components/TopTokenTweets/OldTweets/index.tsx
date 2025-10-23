import { useEffect, useMemo, useState } from 'react';
import { getTimestampsByThreshold } from '../../../modules/twitter/twitter.utils';
import {
  ITwitterResponse,
  ITwitterTweet,
} from '../../../modules/twitter/twitter.interfaces';
import { useQuery } from '@tanstack/react-query';
import { TweetsList } from '../TweetsList';
import BlurPlaceholder from '../../BlurPlaceholder';
import { Box, Stack } from '@mui/system';
import { Typography } from '@mui/material';

export const OldTweets = ({
  tokenSlug,
  mintedAt,
  limit,
  minFollowers,
  tokenPrice,
}: {
  tokenSlug: string;
  mintedAt: string;
  limit: number;
  minFollowers: number;
  tokenPrice: number | undefined;
}) => {
  const periods = {
    H1: 1000 * 60 * 60,
    H3: 1000 * 60 * 60 * 3,
    D3: 1000 * 60 * 60 * 24 * 3,
  };

  const [page, setPage] = useState({
    currentPage: 1,
    hasNextPage: true,
    isLoading: false,
  });

  if (!mintedAt) {
    return (
      <Box m={-1} flex={1}>
        <BlurPlaceholder
          block={'price-chart'}
          customContent={
            <Stack>
              <Typography variant={'h6'} gutterBottom>
                No minted data
              </Typography>
            </Stack>
          }
        />
      </Box>
    );
  }

  const handleClick = (arg: number) => {
    setPage((prev) => {
      return { ...prev, currentPage: arg };
    });
  };

  const currentData = new Date(mintedAt);

  const { start_date, end_date } = useMemo(() => {
    return getTimestampsByThreshold(0, [
      new Date(currentData.getTime() - periods['H1']).toISOString(),
      new Date(currentData.getTime() + periods['D3']).toISOString(),
    ]);
  }, []);

  const { data, isLoading, error, refetch } = useQuery<
    ITwitterResponse<ITwitterTweet[]>
  >({
    queryKey: [
      `/token/${tokenSlug}/twitter`,
      {
        page: page.currentPage,
        limit,
        minFollowers,
        from: new Date(start_date * 1000).toISOString(),
        to: new Date(end_date * 1000).toISOString(),
      },
    ],
    enabled: !!tokenSlug,
  });

  useEffect(() => {
    refetch();
  }, [page]);

  useEffect(() => {
    if (data?.data) {
      setPage((prev) => {
        return { ...prev, hasNextPage: data?.data.length > 5 };
      });
    }
  }, [data]);

  return (
    <TweetsList
      tokenPrice={tokenPrice}
      data={data?.data ? data?.data.slice(0, 5) : []}
      error={!!error}
      isLoading={isLoading}
      changePage={handleClick}
      page={page}
      mintedAt={mintedAt}
      // start_date={start_date}
      // end_date={end_date}
    />
  );
};
