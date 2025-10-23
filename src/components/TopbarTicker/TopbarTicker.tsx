import { Avatar, Box, Skeleton, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../../context';
import * as styled from './TopbarTicker.styled';
import { getTimeSince } from './utils';
import type { TRSSNews } from '@/types/responces/News';
import { ImageWithFallback } from '../ImageWithFallback';
import { removeDuplicatesByKey } from '../../utils/removeDuplicatesByKey';
import { Stack } from '@mui/system';

const TopbarTicker = () => {
  const socket = useContext(SocketContext);
  const [news, setNews] = useState<TRSSNews[]>([]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const event = 'feed:news';

    const handleNewNews = (news: TRSSNews[]) => {
      setNews((prev) => removeDuplicatesByKey<TRSSNews>([prev, news], 'id'));
    };
    socket.on(event, handleNewNews);
    socket.emit('subscribe', event);

    return () => {
      socket.off(event, handleNewNews);
      socket.emit('unsubscribe', event);
    };
  }, [socket]);

  return !news || news.length === 0 ? (
    <Stack
      direction={'row'}
      gap={1}
      justifyContent={'flex-start'}
      overflow={'hidden'}
      borderRadius={1}
    >
      <Skeleton
        animation="wave"
        variant="rectangular"
        width={'25%'}
        height={106}
        sx={{
          minWidth: 350,
          borderRadius: 1,
        }}
      />
      <Skeleton
        animation="wave"
        variant="rectangular"
        width={'25%'}
        height={106}
        sx={{
          borderRadius: 1,
          minWidth: 350,
        }}
      />
      <Skeleton
        animation="wave"
        variant="rectangular"
        width={'25%'}
        height={106}
        sx={{
          borderRadius: 1,
          minWidth: 350,
        }}
      />
      <Skeleton
        animation="wave"
        variant="rectangular"
        width={'25%'}
        height={106}
        sx={{
          borderRadius: 1,
          minWidth: 350,
        }}
      />
      <Skeleton
        animation="wave"
        variant="rectangular"
        width={'25%'}
        height={106}
        sx={{
          borderRadius: 1,
          minWidth: 350,
        }}
      />
    </Stack>
  ) : (
    <styled.MarqueeContainer>
      <styled.Marquee className={'marquee'}>
        {news.map((item) => (
          <styled.TickerItem
            key={item?.id}
            href={item?.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <styled.LeftSide>
              <ImageWithFallback
                style={{
                  width: 90,
                  height: 90,
                  textIndent: '-9999px',
                  objectFit: 'cover',
                  borderRadius: 4,
                }}
                alt="Remy Sharp"
                src={item?.imageLink}
              />
            </styled.LeftSide>

            <styled.RightSide>
              <Typography
                variant="subtitle2"
                style={{
                  lineHeight: '16px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {item?.messageTitle}
              </Typography>
              <Typography
                style={{
                  fontSize: 12,
                  lineHeight: '16px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {item?.message}
              </Typography>

              <styled.Footer>
                <styled.Source>
                  <Avatar
                    sx={{ width: 20, height: 20 }}
                    alt="Remy Sharp"
                    src={item?.source?.iconURL}
                  />
                  <Typography variant="caption">
                    {item?.source?.title}
                  </Typography>
                </styled.Source>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption">
                    {getTimeSince(item?.messageTime)}
                  </Typography>
                </Box>
              </styled.Footer>
            </styled.RightSide>
          </styled.TickerItem>
        ))}
      </styled.Marquee>
      <styled.Marquee className={'marquee'}>
        {news.map((item) => (
          <styled.TickerItem
            key={item?.id}
            href={item?.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <styled.LeftSide>
              <ImageWithFallback
                style={{
                  width: 90,
                  height: 90,
                  textIndent: '-9999px',
                  objectFit: 'cover',
                  borderRadius: 4,
                }}
                alt="Remy Sharp"
                src={item?.imageLink}
              />
            </styled.LeftSide>

            <styled.RightSide>
              <Typography
                variant="subtitle2"
                style={{
                  lineHeight: '16px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {item?.messageTitle}
              </Typography>
              <Typography
                style={{
                  fontSize: 12,
                  lineHeight: '16px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {item?.message}
              </Typography>

              <styled.Footer>
                <styled.Source>
                  <Avatar
                    sx={{ width: 20, height: 20 }}
                    alt="Remy Sharp"
                    src={item?.source?.iconURL}
                  />
                  <Typography variant="caption">
                    {item?.source?.title}
                  </Typography>
                </styled.Source>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption">
                    {getTimeSince(item?.messageTime)}
                  </Typography>
                </Box>
              </styled.Footer>
            </styled.RightSide>
          </styled.TickerItem>
        ))}
      </styled.Marquee>
    </styled.MarqueeContainer>
  );
};

export { TopbarTicker };
