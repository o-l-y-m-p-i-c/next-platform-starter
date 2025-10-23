import { useQuery } from '@tanstack/react-query';
import {
  ITwitterResponse,
  ITwitterTweet,
} from '../../../modules/twitter/twitter.interfaces';
import { TweetsList } from '../TweetsList';
import { useEffect, useState } from 'react';

export const LatestTweets = ({
  tokenSlug,
  limit,
  minFollowers,
  tokenPrice,
}: {
  tokenSlug: string;
  limit: number;
  minFollowers: number;
  tokenPrice: number | undefined;
}) => {
  const [page, setPage] = useState({
    currentPage: 1,
    hasNextPage: true,
    isLoading: false,
  });

  const handleClick = (arg: number) => {
    setPage((prev) => {
      return { ...prev, currentPage: arg };
    });
  };

  const { data, isLoading, error, refetch } = useQuery<
    ITwitterResponse<ITwitterTweet[]>
  >({
    queryKey: [
      `/token/${tokenSlug}/twitter`,
      {
        page: page.currentPage,
        limit,
        minFollowers,
      },
    ],
    enabled: false,
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
    />
  );
};
