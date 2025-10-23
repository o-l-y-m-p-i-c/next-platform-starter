'use client';

import { useEffect, useRef, useState } from 'react';
import * as styled from './StreamMessages.styled';
import StreamMessagesVideo from './StreamMessagesVideo';
import { Box, Stack, useMediaQuery } from '@mui/system';
import { CircularProgress, Typography } from '@mui/material';
import { shortenAddress } from '../../utils/shortenAddress';
import { useAppGlobal } from '@/hooks';
import { useSocket } from '../../hooks/useSocket';
import type { TokenTransactionSnipers } from '@/types/responces/TokenTransaction';
import { ImageWithFallback } from '../ImageWithFallback';
import EastIcon from '@mui/icons-material/East';
import Link from 'next/link';
import skull_1 from '@/assets/snipers/skull_1.svg';
import skull_2 from '@/assets/snipers/skull_2.svg';
import fire from '@/assets/snipers/fire.svg';
import eyes from '@/assets/snipers/eyes.svg';
import wow from '@/assets/snipers/suprised.svg';

type Color = {
  color: string;
};

type UpdatedSnipersTransactions = Color & TokenTransactionSnipers;

type RGB = [number, number, number];

const StreamMessages = ({ isPreview = true }: { isPreview?: boolean }) => {
  const socket = useSocket();

  const [messages, setMessages] = useState<UpdatedSnipersTransactions[]>([]);
  const { animations } = useAppGlobal();

  const colorMap = useRef<{ [key: string]: string }>({});
  const existingColors: RGB[] = [];

  useEffect(() => {
    if (!socket) {
      return;
    }
    const event = 'feed:snipers';

    const handleNewSnipers = (transactions: TokenTransactionSnipers[]) => {
      const updatedTrasnactions = transactions as UpdatedSnipersTransactions[];
      if (transactions) {
        setMessages((messages) => {
          const final: UpdatedSnipersTransactions[] = assignColorsToGroups([
            ...updatedTrasnactions,
            ...messages,
          ]);
          return final.slice(0, 100);
        });
      }
    };

    socket.on(event, handleNewSnipers);
    socket.emit('subscribe', event);

    return () => {
      socket.off(event, handleNewSnipers);
      socket.emit('unsubscribe', event);
    };
  }, [socket]);

  function assignColorsToGroups(
    array: UpdatedSnipersTransactions[],
  ): UpdatedSnipersTransactions[] {
    array.forEach((item) => {
      const address = item.tokenAddress;
      if (!colorMap.current[address]) {
        colorMap.current[address] = generateDistinctColor(existingColors);
      }
      item.color = colorMap.current[address];
    });

    return array;
  }

  function colorDistance(rgb1: RGB, rgb2: RGB): number {
    return Math.sqrt(
      Math.pow(rgb1[0] - rgb2[0], 2) +
        Math.pow(rgb1[1] - rgb2[1], 2) +
        Math.pow(rgb1[2] - rgb2[2], 2),
    );
  }

  function generateBrightColor(attempt: number): RGB {
    const base = (attempt * 137.5) % 360;

    let r = 0,
      g = 0,
      b = 0;

    if (base < 60) {
      r = 200 + Math.floor(Math.random() * 55);
      g = 100 + Math.floor(Math.random() * 155);
      b = 50 + Math.floor(Math.random() * 50);
    } else if (base < 120) {
      r = 150 + Math.floor(Math.random() * 105);
      g = 180 + Math.floor(Math.random() * 75);
      b = 50 + Math.floor(Math.random() * 50);
    } else {
      r = 50 + Math.floor(Math.random() * 100);
      g = 180 + Math.floor(Math.random() * 75);
      b = 50 + Math.floor(Math.random() * 50);
    }

    return [r, g, b];
  }

  function generateDistinctColor(
    existingColors: RGB[],
    minDistance: number = 60,
    maxAttempts: number = 100,
  ): string {
    let distinctRGB: RGB = generateBrightColor(existingColors.length);
    let attempts = 0;
    const baseAttempt = existingColors.length;

    while (attempts < maxAttempts) {
      const newColor = generateBrightColor(baseAttempt + attempts);

      const isDistinct = existingColors.every(
        (existingRgb) => colorDistance(existingRgb, newColor) > minDistance,
      );

      if (isDistinct) {
        distinctRGB = newColor;
        existingColors.push(newColor);
        break;
      }
      attempts++;
    }

    if (attempts === maxAttempts) {
      console.warn('Reached max attempts to find a distinct color');
      distinctRGB = generateBrightColor(existingColors.length * 13);
    }

    return `rgb(${distinctRGB[0]}, ${distinctRGB[1]}, ${distinctRGB[2]})`;
  }

  return (
    <styled.Container>
      {animations && isPreview && <StreamMessagesVideo />}
      {animations && isPreview ? (
        <styled.MessagesContainer>
          <SnipersContent messages={messages} />
        </styled.MessagesContainer>
      ) : (
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            p: 1,
          }}
        >
          <Box
            sx={{
              overflowX: 'hidden',
              display: 'flex',
              flex: 1,
              p: 1,
              pt: 0,
              pb: 0,
              flexDirection: 'column',
            }}
          >
            <SnipersContent messages={messages} />
          </Box>
        </Box>
      )}
    </styled.Container>
  );
};

function SnipersContent({
  messages,
}: {
  messages: UpdatedSnipersTransactions[];
}) {
  const isDesktop = useMediaQuery('(min-width:600px)');

  const isTable = useMediaQuery('(max-width:900px)');
  function formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toFixed(2);
  }
  return (
    <Box
      // layout
      style={{
        alignItems: 'self-start',
        height: '100%',
        width: '100%',
      }}
    >
      <Box>
        {messages.map(
          (
            {
              color,
              transactionHash,
              tokenAddress,
              tokenAmount,
              isBuy,
              from,
              transactionTime,
              tokenUSDPrice,
              tokenData,
            },
            i,
          ) => {
            const volume =
              (tokenAmount / 10 ** tokenData.decimals) * tokenUSDPrice;

            const formatedVolume = formatNumber(volume);

            const coinCount = formatNumber(
              tokenAmount / 10 ** tokenData.decimals,
            );

            // Tier #1 0 - 100 =  default
            // Tier #2 101 - 300 = fontSize 16 + color #fff
            // Tier #3 301 - 800 = fontSize 18 + emoji Eyes + redSkull + fontColor: yellow (bold)
            // Tier #4 801 - 1200 = fontSize 18 + emoji Fire + redSkull + fontColor: yellow (bold)
            // Tier #5 1201+ = fontSize 20 + emoji Wow + redSkull + fontColor: yellow (bold)

            const limits = [100, 300, 800, 1200];

            const is16Size = volume > limits[0] && volume <= limits[1];
            const is18Size = volume > limits[1] && volume <= limits[3];
            const is20Size = volume > limits[3];

            const isWhite = volume > limits[0] && volume <= limits[1];
            const isYellow = volume > limits[1];

            const isBold = volume > limits[1];

            const showWow = volume > limits[3];
            const showFire = !showWow && volume > limits[2];
            const showEyes = !showWow && !showFire && volume > limits[1];

            const showRedSkull = volume > limits[1];

            const getFontSize = () => {
              if (is20Size) return isDesktop ? 22 : 18;
              if (is18Size) return isDesktop ? 20 : 16;
              if (is16Size) return isDesktop ? 16 : 13;
              return isDesktop ? 14 : 12;
            };

            const getTextColor = () => {
              if (isYellow) return 'yellow';
              if (isWhite) return '#fff';
              return 'inherit';
            };

            return (
              <styled.MessageListItem key={`${transactionHash}-${i}`}>
                <Stack
                  p={1}
                  pl={0}
                  pr={0}
                  borderBottom={'1px dashed #FFFFFF'}
                  gap={0.25}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: isDesktop
                      ? '1.3fr 54px 1fr'
                      : 'auto auto',
                    justifyContent: 'space-between',
                    fontFamily: 'Roboto, sans-serif',
                    '*': {
                      fontFamily: '"Roboto", sans-serif!important',
                    },
                    '& span': {
                      textShadow: '2px 2px #000 ',
                    },
                  }}
                >
                  <Stack
                    direction={!isTable ? 'row' : 'column'}
                    alignItems={!isTable ? 'center' : 'flex-start'}
                    flexWrap={'wrap'}
                    gap={0.25}
                  >
                    {/* Time and address */}
                    <Stack sx={{ width: 80, textAlign: 'left' }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: 14,
                        }}
                        textAlign={'left'}
                      >
                        {new Intl.DateTimeFormat('default', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false,
                        }).format(new Date(transactionTime))}
                      </Typography>
                      <Link
                        style={{
                          color: 'pink',
                        }}
                        href={`https://solscan.io/account/${from}`}
                        target={'_blank'}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            whiteSpace: 'nowrap',
                            width: 80,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {shortenAddress(from, 4)}
                        </Typography>
                      </Link>
                    </Stack>

                    {/* Emojis and transaction info */}
                    <Stack
                      direction={'row'}
                      alignItems={'center'}
                      flexWrap={'wrap'}
                      gap={0.5}
                    >
                      {/* Buy/Sell indicator */}
                      <Box>
                        <Typography
                          variant={'caption'}
                          sx={{
                            fontSize: '12px!important',
                            minWidth: 16,
                            width: 16,
                            height: 16,
                            fontWeight: 'bold',
                            borderRadius: 1,
                            display: 'inline-flex',
                            alignItems: 'center',
                            textAlign: 'center',
                            color: 'white',
                            lineHeight: 0,
                            justifyContent: 'center',
                            background: isBuy ? 'green' : 'red',
                            textShadow: 'none!important',
                          }}
                        >
                          {isBuy ? 'B' : 'S'}
                        </Typography>
                      </Box>

                      {showEyes && (
                        <ImageWithFallback
                          style={{
                            width: 'auto',
                            height: isDesktop ? 30 : 24,
                            marginRight: 5,
                            scale: '-1 1',
                          }}
                          src={eyes}
                          alt=""
                        />
                      )}

                      {showFire && (
                        <ImageWithFallback
                          style={{
                            width: 'auto',
                            height: isDesktop ? 30 : 24,
                            marginRight: 5,
                          }}
                          src={fire}
                          alt=""
                        />
                      )}

                      {showWow && (
                        <ImageWithFallback
                          style={{
                            width: 'auto',
                            height: isDesktop ? 30 : 24,
                            marginRight: 5,
                          }}
                          src={wow}
                          alt=""
                        />
                      )}

                      {/* Volume and amount display */}
                      <Stack
                        direction={'row'}
                        alignItems={'center'}
                        flexWrap={'wrap'}
                        gap={0.5}
                        sx={{
                          '& *': {
                            fontSize: `${getFontSize()}px!important`,
                            fontWeight: isBold
                              ? 'bold!important'
                              : 'normal!important',
                          },
                        }}
                      >
                        {isBuy ? (
                          <>
                            <Box>
                              <Typography
                                variant="caption"
                                color={getTextColor()}
                              >
                                ${formatedVolume}
                              </Typography>
                            </Box>
                            <EastIcon sx={{ height: 13 }} />
                            <Box>
                              <Typography variant="caption">
                                {coinCount}
                              </Typography>
                            </Box>
                          </>
                        ) : (
                          <>
                            <Box>
                              <Typography variant="caption">
                                {coinCount}
                              </Typography>
                            </Box>
                            <EastIcon sx={{ height: 13 }} />
                            <Box>
                              <Typography
                                variant="caption"
                                color={getTextColor()}
                              >
                                ${formatedVolume}
                              </Typography>
                            </Box>
                          </>
                        )}
                      </Stack>
                    </Stack>
                  </Stack>

                  {/* Skull column */}
                  <Stack
                    alignItems={'center'}
                    ml={'auto'}
                    justifyContent={'center'}
                    sx={{
                      '& img': {
                        scale: 1,
                        transition: 'all 0.1s',
                      },
                      '& img:hover': {
                        scale: 1.1,
                      },
                    }}
                  >
                    <Link
                      href={`https://solscan.io/tx/${transactionHash}`}
                      target={'_blank'}
                    >
                      {showRedSkull ? (
                        <ImageWithFallback
                          style={{
                            width: isDesktop ? 54 : 34,
                            height: isDesktop ? 54 : 34,
                          }}
                          src={skull_1}
                          alt=""
                        />
                      ) : (
                        <ImageWithFallback
                          style={{
                            width: isDesktop ? 54 : 34,
                            height: isDesktop ? 30 : 24,
                          }}
                          src={skull_2}
                          alt=""
                        />
                      )}
                    </Link>
                  </Stack>
                  <Stack
                    gridColumn={isDesktop ? 'auto' : 'span 2'}
                    direction={'row'}
                    alignItems={'center'}
                    justifyContent={isDesktop ? 'flex-end' : 'flex-start'}
                    gap={0.3}
                    overflow={'hidden'}
                  >
                    <Stack
                      direction={'row'}
                      alignItems={'center'}
                      flexWrap={'wrap'}
                      justifyContent={isDesktop ? 'flex-end' : 'flex-start'}
                      gap={0.3}
                      overflow={'hidden'}
                      textAlign={isDesktop ? 'right' : 'left'}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: 12,
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {tokenData.name}
                      </Typography>
                      <Link href={`/token/${tokenData.slug}`}>
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          ${tokenData.symbol}
                        </Typography>
                      </Link>

                      <Typography
                        variant="caption"
                        sx={{
                          width: isDesktop ? '100%' : 'auto',
                          order: -1,
                          fontSize: 12,
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        <Link
                          style={{
                            color: 'white',
                          }}
                          href={`/token/${tokenData.slug}`}
                        >
                          ({shortenAddress(tokenAddress, isDesktop ? 7 : 4)})
                        </Link>
                      </Typography>
                    </Stack>
                    {isDesktop && (
                      <Box
                        sx={{
                          pl: 0.5,
                        }}
                      >
                        <ImageWithFallback
                          style={{
                            border: '1px solid #fff',
                            width: 26,
                            height: 26,
                            borderRadius: '100%',
                          }}
                          src={tokenData.imageURL}
                          alt=""
                        />
                      </Box>
                    )}
                  </Stack>
                </Stack>
              </styled.MessageListItem>
            );
          },
        )}
      </Box>
      {messages.length === 0 && (
        <Box
          sx={{
            flex: 1,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              p: 2,
            }}
          >
            <Typography>Loading on-chain data</Typography>
            <CircularProgress />
          </Box>
        </Box>
      )}
    </Box>
  );
}

export { StreamMessages };
