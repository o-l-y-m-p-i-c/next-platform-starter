import {
  Pagination,
  Paper,
  SortDirection,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { ITwitterTweet } from '../../twitter.interfaces';
import { ImageWithFallback } from '../../../../components/ImageWithFallback';
import { DrawerComponent } from '../../../../components/DrawerComponent';
import TokenTwitterSentimentsModal from './TokenTwitterSentimentsModal';
import { Box, Stack, useTheme } from '@mui/system';
import PriceGrain from './TokenTwitterSentimentsModal/PriceGrain';

import PeopleIcon from '@mui/icons-material/People';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

import { ETweetSentiment } from '../../twitter.enums';

import { visuallyHidden } from '@mui/utils';

interface Column {
  id:
    | 'name'
    | 'image'
    | 'sentiment'
    | 'message'
    | 'tweetCount'
    | 'followers'
    | 'posted'
    | 'priceGain';
  label: string;
  minWidth?: number;
  isSortable?: boolean;
  width?: number | string;
  align?: 'right' | 'center';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  format?: (value: any) => any;
}

const columns: readonly Column[] = [
  {
    id: 'image',
    label: '',
    minWidth: 70,
    width: 70,

    format: (url: string) => {
      return (
        <ImageWithFallback
          style={{
            width: 70,
            minWidth: 70,
            height: 70,
            objectFit: 'cover',
            borderRadius: 12,
          }}
          src={url}
          alt=""
        />
      );
    },
  },
  { id: 'name', label: 'Name', minWidth: 150 },
  {
    id: 'message',
    label: 'Message',
    width: '100%',
    minWidth: 250,
    format: ({ message }) => {
      return (
        <Stack
          sx={{
            position: 'relative',
          }}
          alignItems={'center'}
        >
          <Typography
            color="textDisabled"
            variant={'inherit'}
            sx={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              position: 'absolute',
              overflow: 'hidden',
              width: '100%',
              transform: 'translateY(-50%)',
            }}
          >
            {message}
          </Typography>
        </Stack>
      );
    },
  },
  {
    id: 'sentiment',
    label: 'Sentiment',
    align: 'center',
    isSortable: true,
    minWidth: 150,
    format: (sentiment: ETweetSentiment) => {
      const theme = useTheme();
      const Icon =
        sentiment === ETweetSentiment.POSITIVE
          ? SentimentVerySatisfiedIcon
          : sentiment === ETweetSentiment.NEUTRAL
            ? SentimentNeutralIcon
            : SentimentVeryDissatisfiedIcon;

      const color =
        sentiment === ETweetSentiment.POSITIVE
          ? theme.palette.success.main
          : sentiment === ETweetSentiment.NEGATIVE
            ? theme.palette.error.main
            : theme.palette.text.main;

      return (
        <Icon
          sx={{
            fill: color,
          }}
        />
      );
    },
  },
  {
    id: 'posted',
    label: 'Posted',
    minWidth: 170,
    align: 'center',
    isSortable: true,
    format: (postedTime) => {
      const messagTime = new Date(postedTime).getTime();

      const currentTime = new Date().getTime();

      const getAgoTime = currentTime - messagTime;

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

      const convertedAgoTime = convertMsToTime(Math.abs(getAgoTime));
      return (
        <Typography>
          {convertedAgoTime.days > 0
            ? `${convertedAgoTime.days}d `
            : convertedAgoTime.hours > 0
              ? `${convertedAgoTime.hours}h `
              : `${convertedAgoTime.minutes}m`}{' '}
          ago
        </Typography>
      );
    },
  },
  {
    id: 'priceGain',
    isSortable: true,
    label: 'Price Gain',
    minWidth: 170,
    align: 'right',
    format: (priceGain: { tokenPrice: number; priceInTime: number }) => {
      if (!priceGain?.tokenPrice || !priceGain?.priceInTime) return <></>;

      return (
        <Stack
          sx={{
            position: 'relative',
          }}
          direction={'row'}
          justifyContent={'flex-end'}
        >
          <PriceGrain
            isAbsolute={false}
            priceGain={
              ((priceGain.tokenPrice - priceGain.priceInTime) /
                priceGain.priceInTime) *
              100
            }
          >
            ${priceGain.tokenPrice.toFixed(4)} → $
            {priceGain.priceInTime.toFixed(4)}
          </PriceGrain>
        </Stack>
      );
    },
  },
];

export const TokenTwitterSentimentsTable = ({
  data: sourceData,
  tokenPrice,
}: {
  data: ITwitterTweet[];
  rootNode: { tokenAddress: string; tokenImage: string; tokenSymbol: string };
  tokenPrice: number;
  setNewTweetCount: (count: number) => void;
  customDates: [string, string] | undefined;
}) => {
  const [tweets, setTweet] = useState<ITwitterTweet[] | null>(null);
  const [opened, setOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleOpen = (nodes: ITwitterTweet[]) => {
    setTweet([...nodes].reverse());
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTweet(null);
  };

  const followerCounterFormatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2,
  });

  const [orderBy, setOrderBy] = useState<{
    byParam: Pick<Column, 'id'> | null;
    direction: SortDirection;
  }>({
    byParam: {
      id: 'sentiment',
    },
    direction: 'asc',
  });

  const createSortHandler = (id: Pick<Column, 'id'> | null) => {
    if (orderBy.byParam?.id === id?.id) {
      const direction: SortDirection =
        !orderBy.direction || orderBy.direction === 'asc' ? 'desc' : 'asc';
      setOrderBy({
        byParam: id,
        direction,
      });
    } else {
      setOrderBy({
        byParam: id,
        direction: 'asc',
      });
    }
    setPage(1);
  };

  const rows = useMemo(() => {
    const data = sourceData.map((row_item) => ({
      image: row_item.author?.avatarURL,
      name: row_item.author?.name,
      message: {
        id: row_item.author?.id,
        message: row_item.message.message,
      },
      tweetCount: 0,
      sentiment: row_item.sentiment,
      followers: row_item.author?.followers ?? 0,
      posted: row_item.message.messageTime,
      priceGain: {
        tokenPrice: tokenPrice ?? 0,
        priceInTime: row_item.tokenPriceUSDOnMessageTime,
      },
      node: row_item,
    }));

    // sorted by date - default (from new to latest)
    let sortedData = data;

    if (orderBy.byParam?.id === 'sentiment') {
      sortedData = [];

      const positiveData = data.filter(
        (row_item) => row_item.sentiment === ETweetSentiment.POSITIVE,
      );
      const negativeData = data.filter(
        (row_item) => row_item.sentiment === ETweetSentiment.NEGATIVE,
      );
      const neutralData = data.filter(
        (row_item) => row_item.sentiment === ETweetSentiment.NEUTRAL,
      );

      if (orderBy.direction === 'desc') {
        sortedData = [...positiveData, ...neutralData, ...negativeData];
      } else {
        sortedData = [...negativeData, ...neutralData, ...positiveData];
      }
    }

    if (orderBy.byParam?.id === 'posted') {
      sortedData = [];
      if (orderBy.direction === 'asc') {
        sortedData = data.sort((a, b) => {
          return new Date(a.posted).getTime() - new Date(b.posted).getTime();
        });
      } else {
        sortedData = data.sort((a, b) => {
          return new Date(b.posted).getTime() - new Date(a.posted).getTime();
        });
      }

      sortedData = sortedData.reverse();
    }

    if (orderBy.byParam?.id === 'priceGain') {
      sortedData = [];

      const filledData = data.filter((_data) => {
        const value =
          ((_data.priceGain.tokenPrice - _data.priceGain.priceInTime) /
            _data.priceGain.priceInTime) *
          100;
        return value > -99 && value < 500000;
      });

      const unfilledData = data.filter((_data) => {
        const value =
          ((_data.priceGain.tokenPrice - _data.priceGain.priceInTime) /
            _data.priceGain.priceInTime) *
          100;
        return value < -99 || value > 500000;
      });

      if (orderBy.direction === 'asc') {
        sortedData = filledData.sort((a, b) => {
          const valueA =
            ((a.priceGain.tokenPrice - a.priceGain.priceInTime) /
              a.priceGain.priceInTime) *
            100;

          const valueB =
            ((b.priceGain.tokenPrice - b.priceGain.priceInTime) /
              b.priceGain.priceInTime) *
            100;

          return valueA - valueB;
        });
      } else {
        sortedData = filledData.sort((a, b) => {
          const valueA =
            ((a.priceGain.tokenPrice - a.priceGain.priceInTime) /
              a.priceGain.priceInTime) *
            100;

          const valueB =
            ((b.priceGain.tokenPrice - b.priceGain.priceInTime) /
              b.priceGain.priceInTime) *
            100;

          return valueB - valueA;
        });
      }

      sortedData = [...sortedData, ...unfilledData];
    }

    return sortedData.slice(
      (page - 1) * rowsPerPage,
      (page - 1) * rowsPerPage + rowsPerPage,
    );
  }, [sourceData, tokenPrice, orderBy, page, rowsPerPage]);

  return (
    <>
      <DrawerComponent
        drawerProps={{
          open: !!tweets && opened,
        }}
        handleClose={handleClose}
        headerComponent={
          tweets &&
          tweets.length > 0 && (
            <>
              <Typography
                variant="h2"
                fontWeight={'bold'}
                whiteSpace={'nowrap'}
                overflow={'hidden'}
                textOverflow={'ellipsis'}
              >
                {tweets[0].author.name}
              </Typography>
              {/* HERE ARE FOLLOWERS TO TWEET */}
              <Stack mt={1} direction={'row'} gap={1}>
                <PeopleIcon />
                {tweets[0].author.followers ? (
                  <Typography>
                    {followerCounterFormatter.format(
                      tweets[0].author.followers,
                    )}{' '}
                    {/* Followers */}
                  </Typography>
                ) : null}
              </Stack>
            </>
          )
        }
      >
        {tweets && (
          <TokenTwitterSentimentsModal
            tokenPrice={tokenPrice}
            tweets={tweets}
            opened={opened}
          />
        )}
      </DrawerComponent>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer
        // sx={{ maxHeight: 640 }}
        >
          <Table stickyHeader size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{
                      minWidth: column.minWidth,
                      width: column.width ?? 'auto',
                    }}
                    // 'asc' | 'desc' | false;
                    sortDirection={'asc'}
                  >
                    {column?.isSortable ? (
                      <TableSortLabel
                        active={
                          !!orderBy.byParam && orderBy.byParam.id === column.id
                        }
                        {...(orderBy.byParam &&
                          orderBy.byParam.id === column.id &&
                          !!orderBy.direction && {
                            direction: orderBy.direction,
                          })}
                        onClick={() => createSortHandler({ id: column.id })}
                      >
                        {column.label}
                        {orderBy.byParam && orderBy.byParam.id === column.id ? (
                          <Box component="span" sx={visuallyHidden}>
                            {orderBy.direction === 'desc'
                              ? 'sorted descending'
                              : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    sx={{
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      handleOpen([row.node]);
                    }}
                    tabIndex={-1}
                    key={index}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format ? column.format(value) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack alignItems={'center'} p={2}>
          <Pagination
            color={'primary'}
            count={Math.ceil(sourceData.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
          />
        </Stack>
      </Paper>
    </>
  );
};
