import {
  Avatar,
  CircularProgress,
  ClickAwayListener,
  Divider,
  IconButton,
  Link,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import { Box, Stack, useTheme } from '@mui/system';
import React, { useState } from 'react';
import { StatsItem } from '../../../modules/search/components/SearchListElement';
import { formatNumber } from '../../../helpers/formatNumber';
import { ITwitterTweet } from '../../../modules/twitter/twitter.interfaces';
import BlurPlaceholder from '../../BlurPlaceholder';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const TweetListItem = ({
  dataLength,
  queryItem,
  mintedAt,
  tokenPrice,
  index,
}: {
  dataLength: number;
  tokenPrice: number | undefined;
  queryItem: ITwitterTweet;
  index: number;
  mintedAt?: string;
}) => {
  const theme = useTheme();

  const [showTooltip, setTooltipFlag] = useState(false);

  const successMain = theme.palette.success.main;
  const errorMain = theme.palette.error.main;

  const convertMsToTime = (milliseconds: number) => {
    const totalHours = milliseconds / (1000 * 60 * 60);
    const hours = Math.floor(totalHours);
    const days = Math.floor(hours / 24);
    const minutes = Math.floor((totalHours - hours) * 60);

    return {
      hours: hours > 24 ? hours % 24 : hours,
      minutes,
      days,
    };
  };
  const messagTime = new Date(queryItem.message.messageTime).getTime();

  const currentTime = mintedAt
    ? new Date(mintedAt).getTime()
    : new Date().getTime();

  const getAgoTime = currentTime - messagTime;

  // const isNegative = getAgoTime < 0;

  const convertedAgoTime = convertMsToTime(Math.abs(getAgoTime));

  const precPriceGain =
    tokenPrice && queryItem.tokenPriceUSDOnMessageTime
      ? ((tokenPrice - queryItem.tokenPriceUSDOnMessageTime) /
          queryItem.tokenPriceUSDOnMessageTime) *
        100
      : undefined;
  return (
    <>
      <ListItemButton
        key={queryItem.message.messageId}
        // href={`https://x.com/anyone/status/${queryItem.message.messageId}`}
        // target="_blank"
        sx={{
          position: 'relative',
        }}
      >
        <Link
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
          }}
          href={`https://x.com/anyone/status/${queryItem.message.messageId}`}
          target="_blank"
        />
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src={queryItem.author.avatarURL} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Stack direction={'row'} justifyContent={'space-between'}>
              <Typography>{queryItem.author.name}</Typography>

              <Stack direction={'row'} spacing={1}>
                <Stack>
                  <Typography>
                    {convertedAgoTime.days > 0
                      ? `${convertedAgoTime.days}d `
                      : convertedAgoTime.hours > 0
                        ? `${convertedAgoTime.hours}h `
                        : `${convertedAgoTime.minutes}m`}{' '}
                    ago
                  </Typography>
                </Stack>
                {precPriceGain && tokenPrice && (
                  <ClickAwayListener onClickAway={() => setTooltipFlag(false)}>
                    <Tooltip
                      open={showTooltip}
                      arrow
                      title={
                        <Stack>
                          <Typography variant={'caption'}>
                            Price change since the tweet was published
                          </Typography>
                          <Typography variant={'caption'}>
                            ${queryItem.tokenPriceUSDOnMessageTime.toFixed(4)} →
                            ${tokenPrice.toFixed(4)}
                          </Typography>
                        </Stack>
                      }
                    >
                      <Box
                        sx={{
                          fontWeight: 'bold',
                          color: '#fff',
                          position: 'relative',
                        }}
                        onClick={() => {
                          setTooltipFlag((prev) => !prev);
                        }}
                      >
                        <StatsItem
                          color={precPriceGain < 0 ? errorMain : successMain}
                        >
                          {precPriceGain.toFixed(2)}%
                        </StatsItem>
                      </Box>
                    </Tooltip>
                  </ClickAwayListener>
                )}
              </Stack>
            </Stack>
          }
          secondary={
            <React.Fragment>
              <Typography>
                @{queryItem.author.username}{' '}
                {queryItem.author.followers && (
                  <Stack
                    sx={{
                      display: 'inline-flex',
                      fontWeight: 'bold',
                      fontSize: 14,
                    }}
                  >
                    <StatsItem>
                      {formatNumber(queryItem.author.followers, 0)} Followers
                    </StatsItem>
                  </Stack>
                )}
              </Typography>
              <Typography
                component="span"
                variant="body2"
                mt={1}
                sx={{
                  display: '-webkit-box',
                  color: 'text.primary',
                  '-webkit-line-clamp': '3',
                  '-webkit-box-orient': 'vertical',
                  overflow: 'hidden',
                }}
              >
                {queryItem.message.message}
              </Typography>
            </React.Fragment>
          }
        />
      </ListItemButton>
      {index !== dataLength - 1 && <Divider variant="inset" component="li" />}
    </>
  );
};
export const TweetsList = ({
  data,
  isLoading,
  error,
  page,
  changePage,
  mintedAt,
  tokenPrice,
  // start_date,
  // end_date,
}: {
  tokenPrice: number | undefined;
  data: ITwitterTweet[];
  isLoading: boolean;
  error: boolean;
  page: {
    currentPage: number;
    hasNextPage: boolean;
    isLoading: boolean;
  };
  mintedAt?: string;
  changePage: (arg: number) => void;
}) => {
  if (isLoading) {
    return (
      <>
        <Stack
          flex={1}
          minHeight={585}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <CircularProgress />
        </Stack>
        <Stack
          p={1}
          direction={'row'}
          alignItems={'center'}
          gap={2}
          justifyContent={'center'}
        >
          <IconButton
            size="small"
            onClick={() => changePage(page.currentPage - 1)}
            disabled={page.currentPage <= 1 || isLoading}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          {page.currentPage}
          <IconButton
            size="small"
            onClick={() => changePage(page.currentPage + 1)}
            disabled={!page.hasNextPage || isLoading}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Stack>
      </>
    );
  }

  if ((!isLoading && data.length === 0) || error) {
    return (
      <>
        <Box flex={1}>
          <BlurPlaceholder
            height={585}
            block={'price-chart'}
            customContent={
              <Stack>
                <Typography variant={'h6'} gutterBottom>
                  No tweets found
                </Typography>
              </Stack>
            }
          />
        </Box>
        <Stack
          p={1}
          direction={'row'}
          alignItems={'center'}
          gap={2}
          justifyContent={'center'}
        >
          <IconButton
            size="small"
            onClick={() => changePage(page.currentPage - 1)}
            disabled={page.currentPage <= 1 || isLoading}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          {page.currentPage}
          <IconButton
            size="small"
            onClick={() => changePage(page.currentPage + 1)}
            disabled={!page.hasNextPage || isLoading}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Stack>
      </>
    );
  }

  return (
    <>
      <List sx={{ width: '100%', height: 585, overflowX: 'hidden' }}>
        {data.map((queryItem, index) => {
          return (
            <TweetListItem
              dataLength={data.length}
              key={queryItem.message.messageId}
              queryItem={queryItem}
              index={index}
              tokenPrice={tokenPrice}
              mintedAt={mintedAt}
            />
          );
        })}
      </List>
      <Stack
        p={1}
        direction={'row'}
        alignItems={'center'}
        gap={2}
        justifyContent={'center'}
      >
        <IconButton
          size="small"
          onClick={() => changePage(page.currentPage - 1)}
          disabled={page.currentPage <= 1 || isLoading}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
        {page.currentPage}
        <IconButton
          size="small"
          onClick={() => changePage(page.currentPage + 1)}
          disabled={!page.hasNextPage || isLoading}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Stack>
    </>
  );
};
