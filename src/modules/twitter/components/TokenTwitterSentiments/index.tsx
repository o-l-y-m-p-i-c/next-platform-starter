import { Stack, Box, Typography } from '@mui/material';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ITwitterResponse,
  ITwitterTweet,
  TwitterSentimentThreshold,
} from '../../twitter.interfaces';
import { CircularProgress } from '@mui/material';
import { ETweetSentiment } from '../../twitter.enums';
import BlurPlaceholder from '../../../../components/BlurPlaceholder';
import { TokenTwitterSentimentsTable } from './TokenTwitterSentimentsTable';
import TokenTwitterSentimentsGraph from './TokenTwitterSentimentsGraph';

interface TokenTwitterSentimentsProp {
  tokenSlug?: string;
  tokenAddress: string;
  tokenChain: string;
  dexScreenerDataIsLoading: boolean;
  tokenImage: string;
  tokenPrice: number | undefined;
  tokenSymbol: string;
  tokenName: string;
  start_date: number;
  end_date: number;
  customDates: [string, string] | undefined;
  timeThreshold: TwitterSentimentThreshold;
  setCustomDates: (arg: [string, string] | undefined) => void;
  setTimeThreshold: (arg: TwitterSentimentThreshold) => void;
  followerCount: {
    minFollowers: number;
    maxFollowers: number;
  };
  setFollowerCount: (followerCount: {
    minFollowers: number;
    maxFollowers: number;
  }) => void;
}

const TokenTwitterSentiments: FC<TokenTwitterSentimentsProp> = ({
  tokenSlug,
  dexScreenerDataIsLoading,
  tokenAddress,
  tokenImage,
  tokenSymbol,
  tokenPrice,
  start_date,
  end_date,
  customDates,
  followerCount,
}) => {
  const graphHeight = Math.max(window.innerHeight - 64 - 64 - 111, 600);

  const {
    data: newData,
    isLoading,
    error,
  } = useQuery<ITwitterResponse<ITwitterTweet[]>>({
    queryKey: [
      `/token/${tokenSlug}/twitter`,
      {
        page: '1',
        limit: 10000,
        minFollowers: followerCount.minFollowers ?? 0,
        // maxFollowers: followerCount.maxFollowers,
        from: new Date(start_date * 1000).toISOString(),
        to: new Date(end_date * 1000).toISOString(),
      },
    ],
    enabled: !!tokenSlug,
  });

  const newDatafilteredData = useMemo(() => {
    if (newData && newData.data.length) {
      return newData.data
        .map((t) => ({
          ...t,
          timestamp: new Date(t.message.messageTime).getTime(), // to ms
          sentiment: t.sentiment ?? ETweetSentiment.NEUTRAL, // if null make NEUTRAL
        }))
        .filter((t) => t.author.id); // has id
    }

    return [];
  }, [newData]);

  const maxFollowerCount = useRef<number>(0);

  newDatafilteredData.forEach((data_item) => {
    if (
      data_item.author.followers &&
      maxFollowerCount.current < data_item.author.followers
    ) {
      maxFollowerCount.current = data_item.author.followers;
    }
  });

  const [, setTweetCount] = useState({
    currentTweetCount: 0,
    newTweetCount: 0,
  });

  const setNewTweetCount = (count: number) => {
    setTweetCount((prev) => {
      return {
        ...prev,
        newTweetCount: prev.newTweetCount + count,
      };
    });
  };

  useEffect(() => {
    setTweetCount((prev) => {
      return {
        ...prev,
        newTweetCount: 0,
        currentTweetCount: newDatafilteredData.length,
      };
    });
  }, [newDatafilteredData]);

  if (error) {
    console.error(error);
  }

  if (isLoading || dexScreenerDataIsLoading) {
    return (
      <Stack>
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          height={graphHeight}
          py={2}
        >
          <CircularProgress />
        </Box>
      </Stack>
    );
  }

  return (
    <Stack position={'relative'} gap={2}>
      {newDatafilteredData.length ? (
        <>
          <Stack position={'relative'} m={-2}>
            <TokenTwitterSentimentsGraph
              height={graphHeight}
              tokenPrice={tokenPrice || 0}
              setNewTweetCount={setNewTweetCount}
              rootNode={{ tokenAddress, tokenImage }}
              tokenSymbol={tokenSymbol}
              tokenAddress={tokenAddress}
              data={newDatafilteredData}
              customDates={customDates}
            />
          </Stack>
          <Stack
            border={'1px solid rgba(255,255,255,0.2)'}
            borderLeft={'none'}
            borderRight={'none'}
            direction={'row'}
            gap={2}
          >
            <TokenTwitterSentimentsTable
              tokenPrice={tokenPrice || 0}
              setNewTweetCount={setNewTweetCount}
              rootNode={{ tokenAddress, tokenImage, tokenSymbol }}
              data={newDatafilteredData}
              customDates={customDates}
            />
          </Stack>
        </>
      ) : (
        <BlurPlaceholder
          customContent={
            <Stack>
              <Typography variant={'h6'} gutterBottom>
                No token mentions found yet
              </Typography>
            </Stack>
          }
          height={graphHeight}
        />
      )}
    </Stack>
  );
};

export default TokenTwitterSentiments;
