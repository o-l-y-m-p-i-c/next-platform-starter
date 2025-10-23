'use client';

import { Card, Chip, IconButton, Typography } from '@mui/material';
import { Stack, useTheme } from '@mui/system';
import { ImageWithFallback } from '../ImageWithFallback';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TokenAddresses from '../TokenAddresses';
import { formatNumber } from '../../helpers/formatNumber';
import TokenUSDPrice from '../TokenUSDPrice';
import { TToken } from '@/types/responces/Token';
import { renderSocial } from '../../helpers/renderSocial';
import Link from 'next/link';
import { MyWatchListToggl } from '../MyWatchlist';

export const TokenInfoCard = ({
  data,
  index,
  isAnimated = false,
  delta,
  currentPosition,
}: {
  delta?: number;
  data: TToken;
  index?: number;
  currentPosition?: number;
  isAnimated?: boolean;
}) => {
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

  const updateTime: string | null = data.stats?.updatedAt ?? null;

  const messagTime = updateTime ? new Date(updateTime).getTime() : 0;

  const currentTime = new Date().getTime();

  const getAgoTime = currentTime - messagTime;

  const convertedAgoTime = convertMsToTime(Math.abs(getAgoTime));

  const lineHeight = 96;

  const gap = 12;

  const theme = useTheme();

  const renderTokenName = data.name;

  const isRanked = currentPosition && currentPosition < 4;

  const showAdds = false;

  return (
    <Card
      sx={{
        textAlign: 'left',
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          opacity: 0.9,
          background: theme.palette.primary.dark,
        },
        ...(currentPosition &&
          isRanked && {
            backgroundColor:
              currentPosition === 1
                ? '#fdd91b70'
                : currentPosition === 2
                  ? '#c8c5c570'
                  : '#cc840070',
            // '*:not(svg):not(path)': {
            //   color: '#fff!important',
            // },
          }),
        // mixBlendMode: 'color-dodge',
        ...(isAnimated &&
          index !== undefined && {
            width: '100%',
            position: 'absolute',
            transform: `translateY(${index * lineHeight + gap * index}px)`,
            animation: 'slide 0.2s ease-in-out',
            transition: 'all 0.2s ease-in-out',
          }),
      }}
      variant="outlined"
      // variant={
      //   currentPosition && currentPosition < 4 ? 'elevation' : 'outlined'
      // }
    >
      <Link
        href={`/token/${data.slug}`}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          left: 0,
          top: 0,
        }}
      />

      <Stack
        sx={{
          p: 1,
          overflow: 'hidden',
          ...(isAnimated && {
            animation: 'shake 0.35s ease-in-out',
            transition: 'all 0.2s ease-in-out',
          }),
        }}
        gap={2}
      >
        <Stack gap={0.5} overflow={'hidden'}>
          <Stack direction={'row'} gap={1} overflow={'hidden'}>
            <ImageWithFallback
              key={data.slug}
              style={{
                width: 80,
                minWidth: 80,
                height: 80,
                objectFit: 'cover',
                borderRadius: 12,
              }}
              src={data.imageURL ?? ''}
              alt=""
            />
            <Stack flex={1} overflow={'hidden'} pt={1} mt={-1}>
              <Stack
                direction={'row'}
                alignItems={'flex-start'}
                overflow={'hidden'}
              >
                {/* TOKEN TITLE */}
                <Typography
                  variant={'h6'}
                  sx={{
                    overflowWrap: 'anywhere',
                    display: '-webkit-box',
                    WebkitLineClamp: '3',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    flex: 1,
                    fontSize: 15,
                  }}
                  fontWeight={'bold'}
                >
                  {renderTokenName}{' '}
                  <Typography
                    fontWeight={'normal'}
                    sx={{ fontSize: 15 }}
                    variant={'caption'}
                    color={isRanked ? 'textPrimary' : 'textDisabled'}
                  >
                    ${data.symbol}
                  </Typography>
                </Typography>
                {/* TAGS */}
                <Stack
                  direction={'row'}
                  justifyContent={'flex-end'}
                  gap={0.5}

                  // mt={0}
                >
                  {data?.addresses &&
                    data?.addresses.map((item) => (
                      <Chip
                        key={item.blockchainId}
                        size="small"
                        variant={'filled'}
                        sx={{
                          textTransform: 'uppercase',
                          fontWeight: 'bold',
                        }}
                        label={item.blockchainId}
                      />
                    ))}
                  <Stack
                    sx={{
                      button: {},
                      svg: {
                        width: 14,
                        height: 14,
                      },
                    }}
                  >
                    <MyWatchListToggl
                      token={{ slug: data.slug, name: data.name }}
                      isInMyWatchlist={data.isInMyWatchlist}
                    />
                  </Stack>
                </Stack>
              </Stack>
              <Typography
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontSize: 15,
                  minHeight: 22.5,
                }}
                color={isRanked ? 'textPrimary' : 'textDisabled'}
              >
                {data.description}
              </Typography>
              <Stack
                flexWrap={'wrap'}
                direction={'row'}
                alignItems={'flex-start'}
                justifyContent={'space-between'}
                gap={1}
                sx={{
                  '*': {
                    overflow: 'hidden',
                  },
                }}
                mt={0.5}
              >
                {data?.addresses && data?.addresses.length > 0 && (
                  <TokenAddresses
                    addresses={[
                      {
                        blockchainAddress: data.addresses[0].blockchainAddress,
                        blockchainId: data.addresses[0].blockchainId,
                      },
                    ]}
                    canCopy
                  />
                )}

                <Stack
                  sx={{
                    display: 'inline-flex',
                  }}
                  direction={'row'}
                  mt={-0.5}
                  alignItems={'center'}
                >
                  {data?.socials &&
                    data?.socials.map((social, index) => (
                      <IconButton
                        key={index}
                        color={'primary'}
                        size={'small'}
                        sx={{
                          '&:hover': {
                            color: theme.palette.primary.main,
                          },
                          position: 'relative',
                          zIndex: 2,
                        }}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {renderSocial(social.type)}
                      </IconButton>
                    ))}
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          {!isAnimated && showAdds && (
            <Stack
              direction={'row'}
              flexWrap={'wrap'}
              gap={2}
              rowGap={0}
              alignItems={'center'}
            >
              {(delta || currentPosition) && (
                <Stack
                  direction={'row'}
                  flexWrap={'wrap'}
                  gap={2}
                  alignItems={'center'}
                >
                  {currentPosition && (
                    <Stack direction={'row'} gap={0.5}>
                      <Typography sx={{ fontSize: 15 }} fontWeight={'bold'}>
                        Top:{' '}
                      </Typography>
                      <Stack direction={'row'}>
                        <Typography sx={{ fontSize: 15 }}>
                          #{currentPosition}
                        </Typography>
                      </Stack>
                    </Stack>
                  )}
                  {delta !== undefined && delta !== 0 && (
                    <Stack direction={'row'} gap={0.5}>
                      <Typography sx={{ fontSize: 15 }} fontWeight={'bold'}>
                        Change:{' '}
                      </Typography>
                      <Stack direction={'row'}>
                        {delta > 0 ? (
                          <TrendingUpIcon color="success" />
                        ) : (
                          <TrendingDownIcon color="error" />
                        )}

                        <Typography sx={{ fontSize: 15 }}>{delta}</Typography>
                      </Stack>
                    </Stack>
                  )}
                </Stack>
              )}
              {data.stats?.updatedAt && (
                <Stack>
                  <Typography sx={{ fontSize: 15 }} fontWeight={'bold'}>
                    Updated:{' '}
                    {convertedAgoTime.days > 0
                      ? `${convertedAgoTime.days}d `
                      : convertedAgoTime.hours > 0
                        ? `${convertedAgoTime.hours}h `
                        : `${convertedAgoTime.minutes}m`}{' '}
                    ago
                  </Typography>
                </Stack>
              )}
              {data.stats?.tokenUSDPrice && (
                <Stack direction={'row'} gap={0.4}>
                  <Typography sx={{ fontSize: 15 }} fontWeight={'bold'}>
                    Price:
                  </Typography>
                  <Typography sx={{ fontSize: 15 }}>
                    $
                    <TokenUSDPrice
                      price={data.stats?.tokenUSDPrice}
                      showUSD={false}
                    />
                  </Typography>
                </Stack>
              )}
              {data.stats?.USDMarketCap && (
                <Stack>
                  <Typography sx={{ fontSize: 15 }} fontWeight={'bold'}>
                    Market Cap:{' '}
                    <Typography
                      variant={'caption'}
                      fontWeight={'bold'}
                      sx={{ color: theme.palette.primary.main, fontSize: 15 }}
                    >
                      ${formatNumber(data.stats?.USDMarketCap)}
                    </Typography>
                  </Typography>
                </Stack>
              )}
            </Stack>
          )}
        </Stack>
      </Stack>
    </Card>
  );
};
