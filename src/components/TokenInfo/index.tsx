'use client';

import {
  Button,
  Card,
  IconButton,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { TToken } from '@/types/responces/Token';
import { ImageWithFallback } from '../ImageWithFallback';
import { useMintedTime } from '../TopbarTicker/utils';
import TokenAddresses from '../TokenAddresses';
import { Box, useMediaQuery } from '@mui/system';
import { renderSocial } from '../../helpers/renderSocial';
import { FC, ReactNode } from 'react';
import TokenTags from './TokenTags';
import { FeaturedIcon } from '@/assets/FeaturedIcon';
import TokenUSDPrice from '../TokenUSDPrice';
import { formatNumber } from '../../helpers/formatNumber';
import pumpfun_to_raydium from '@/assets/pumpfun_to_raydium.png';
import { DexScreenerPair } from './types';

const TokenInfoItemWrap = ({ children }: { children?: ReactNode | string }) => {
  return (
    <Card
      sx={{
        position: 'relative',
        flex: 1,
        p: 3,
        pl: 1,
        pr: 1,
        minWidth: 200,
        textAlign: 'left',
        '*': {
          lineHeight: {
            xs: 1,
            sm: 1.1,
          },
        },
        alignItems: {
          xs: 'center',
          sm: 'flex-start',
        },
        gap: 1,
        display: {
          xs: 'flex',
        },
        flexDirection: {
          xs: 'row',
          sm: 'column',
        },
        h5: {
          fontSize: {
            xs: '12px!important',
            sm: '22px!important',
          },
          '*': {
            fontSize: {
              xs: '12px!important',
              sm: '22px!important',
            },
            sub: {
              fontSize: {
                xs: '9px!important',
                sm: '13px!important',
              },
            },
          },
        },
      }}
      variant={'outlined'}
    >
      {children}
    </Card>
    // </Box>
  );
};

const TokenInfo: FC<
  Pick<DexScreenerPair, 'marketCap' | 'info' | 'priceUsd'> & TToken
> = ({
  name,
  description,
  imageURL,
  createdAt,
  addresses,
  symbol,
  mintedAt,
  stats,
  socials,
  tags,
  pumpFunGraduatedAt,
  featured,
  marketCap,
  info,
  priceUsd,
}) => {
  const { updatedAt, USDMarketCap, tokenUSDPrice } = stats || {
    tokenUSDPrice: 0,
    updatedAt: null,
    USDMarketCap: null,
  };

  const isMobile = useMediaQuery('(max-width:600px)');

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

  const graduatedTime =
    pumpFunGraduatedAt &&
    mintedAt &&
    new Date(pumpFunGraduatedAt).getTime() - new Date(mintedAt).getTime();

  const timeNeeded = graduatedTime ? convertMsToTime(graduatedTime) : null;

  return (
    <Stack p={2} pl={1} pr={1} pb={0} gap={1} overflow={'hidden'}>
      <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
        <Stack direction={'row'} gap={2}>
          <Box sx={{ position: 'relative' }}>
            {(imageURL && (
              <ImageWithFallback
                width={isMobile ? 80 : 100}
                height={isMobile ? 80 : 100}
                src={imageURL}
                alt={name}
                hideIfHasError
                style={{
                  border: '2px solid #fbfbfb',
                  borderRadius: '10px',
                  objectFit: 'cover',
                  flex: '0 0 66px',
                  color: '#fff',
                  lineHeight: 0,
                  minWidth: isMobile ? 80 : 100,
                }}
              />
            )) || // component / null with hideIfHasError property
              (info?.imageUrl && (
                <ImageWithFallback
                  width={isMobile ? 80 : 100}
                  height={isMobile ? 80 : 100}
                  src={info?.imageUrl}
                  alt={name}
                  style={{
                    border: '2px solid #fbfbfb',
                    borderRadius: '10px',
                    objectFit: 'cover',
                    flex: '0 0 66px',
                    color: '#fff',
                    lineHeight: 0,
                    minWidth: isMobile ? 80 : 100,
                  }}
                />
              ))}
            {featured && (
              <Box
                sx={{
                  position: 'absolute',
                  right: -15,
                  top: -15,
                }}
              >
                <FeaturedIcon size={30} />
              </Box>
            )}
          </Box>

          <Stack
            sx={{
              display: {
                xs: 'flex',
                sm: 'none',
              },
            }}
            gap={0.5}
          >
            <Typography
              variant={'h4'}
              fontWeight={'bold'}
              color={'white'}
              noWrap
            >
              ${symbol}
            </Typography>
            {socials && socials.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  gap: 0.75,
                }}
              >
                {/* <Typography variant="caption">Socials</Typography> */}
                <Stack gap={1} direction={'row'} flexWrap={'wrap'}>
                  {socials.map((social: { link: string; type: string }) => {
                    const icon = renderSocial(social.type);

                    return icon ? (
                      <Link
                        target={'_blank'}
                        key={social.link}
                        href={social.link}
                      >
                        <IconButton
                          color={'primary'}
                          sx={{
                            border: 2,
                            p: 0.75,
                            '& svg': {
                              height: 14,
                              width: 14,
                            },
                          }}
                        >
                          {icon}
                        </IconButton>
                      </Link>
                    ) : (
                      <Link target={'_blank'} href={social.link}>
                        <Button
                          sx={{
                            border: 2,
                            p: 0.75,
                            pl: 2,
                            pr: 2,
                            '& svg': {
                              height: 14,
                              width: 14,
                            },
                          }}
                          variant="contained"
                        >
                          {social.type}
                        </Button>
                      </Link>
                    );
                  })}
                </Stack>
              </Box>
            )}
          </Stack>
        </Stack>

        <Stack flex={1} gap={1} overflow={'hidden'}>
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            textAlign={'left'}
            flexWrap={'wrap'}
            gap={1}
          >
            <Stack gap={0.5}>
              <Typography variant={'h6'} fontWeight={'bold'}>
                {name}
              </Typography>
              <Typography
                variant={'h5'}
                fontWeight={'bold'}
                color={'white'}
                noWrap
                sx={{
                  display: {
                    xs: 'none',
                    sm: 'block',
                  },
                }}
              >
                ${symbol}
              </Typography>
            </Stack>
            <Stack gap={1}>
              <Stack
                direction={'row'}
                gap={1}
                pt={0.2}
                alignItems={'center'}
                flexWrap={'wrap'}
              >
                <TokenTags tags={tags} />
                {socials && socials.length > 0 && (
                  <Box
                    sx={{
                      display: {
                        xs: 'none',
                        sm: 'block',
                      },
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      gap: 0.75,
                    }}
                  >
                    {/* <Typography variant="caption">Socials</Typography> */}
                    <Stack gap={1} direction={'row'} flexWrap={'wrap'}>
                      {socials.map((social: { link: string; type: string }) => {
                        const icon = renderSocial(social.type);

                        return icon ? (
                          <Link
                            target={'_blank'}
                            key={social.link}
                            href={social.link}
                          >
                            <IconButton
                              color={'primary'}
                              sx={{
                                border: 2,
                                p: 0.75,
                                '& svg': {
                                  height: 14,
                                  width: 14,
                                },
                              }}
                            >
                              {icon}
                            </IconButton>
                          </Link>
                        ) : (
                          <Link target={'_blank'} href={social.link}>
                            <Button
                              sx={{
                                border: 2,
                                p: 0.75,
                                pl: 2,
                                pr: 2,
                                '& svg': {
                                  height: 14,
                                  width: 14,
                                },
                              }}
                              variant="contained"
                            >
                              {social.type}
                            </Button>
                          </Link>
                        );
                      })}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Stack>
          </Stack>
          <Stack overflow={'hidden'}>
            <TokenAddresses canCopy={true} addresses={addresses} size={15} />
          </Stack>
        </Stack>
      </Stack>
      <Typography
        variant={'subtitle1'}
        sx={{
          textAlign: 'left',
        }}
      >
        {description}
      </Typography>

      <Stack>
        <Box
          sx={{
            display: 'flex',
            // flexDirection: 'column',
            // alignItems: 'flex-start',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          <Stack
            mt={1}
            flex={1}
            direction={'row'}
            gap={2}
            flexWrap={'wrap'}
            justifyContent={'flex-end'}
          >
            {mintedAt && (
              <TokenInfoItemWrap>
                <Typography variant="caption">Minted</Typography>
                <Typography
                  variant={'h5'}
                  sx={{
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  {useMintedTime(new Date(mintedAt))}
                </Typography>
              </TokenInfoItemWrap>
            )}
            {createdAt && (
              <TokenInfoItemWrap>
                <Typography variant="caption">Discovered</Typography>
                <Typography
                  variant={'h5'}
                  sx={{
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  {useMintedTime(new Date(createdAt))}
                </Typography>
              </TokenInfoItemWrap>
            )}
            {/* Bonded */}
            {timeNeeded && (
              <TokenInfoItemWrap>
                <Stack
                  direction={'row'}
                  alignItems={'center'}
                  gap={1}
                  sx={{
                    img: {
                      objectFit: 'contain',
                      height: 14,
                    },
                  }}
                >
                  <img src={pumpfun_to_raydium.src} />
                  <Typography variant="caption">Bonded in</Typography>
                </Stack>

                <Typography
                  variant={'h5'}
                  sx={{
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  {timeNeeded?.days !== 0 && `${timeNeeded?.days}d`}{' '}
                  {timeNeeded?.hours}h {timeNeeded?.minutes}m
                </Typography>
              </TokenInfoItemWrap>
            )}
            {/*  */}
            {(marketCap || USDMarketCap) && (
              <TokenInfoItemWrap>
                <Typography variant="caption">Market Cap</Typography>
                <Typography
                  variant={'h5'}
                  sx={{
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  ${formatNumber(marketCap || USDMarketCap || 0)}
                </Typography>
              </TokenInfoItemWrap>
            )}
            <TokenInfoItemWrap>
              <Typography variant="caption">Token Price</Typography>
              <Typography
                variant={'h5'}
                sx={{
                  m: -0.4,
                  ml: 0,
                  mr: 0,
                  fontWeight: 'bold!important',
                  color: 'white',
                  '*': {
                    fontWeight: 'bold!important',
                    fontSize: '1.5rem',
                  },
                }}
              >
                $
                {Number(priceUsd) > 0 || Number(tokenUSDPrice) > 0 ? (
                  <TokenUSDPrice
                    price={Number(priceUsd ?? tokenUSDPrice)}
                    showUSD={false}
                  />
                ) : (
                  0
                )}
              </Typography>

              {priceUsd ? (
                <Typography
                  variant={'caption'}
                  sx={{
                    position: 'absolute',
                    fontSize: {
                      xs: 9,
                    },
                    bottom: 5,
                    right: {
                      xs: 9,
                    },
                  }}
                >
                  Updated just now
                </Typography>
              ) : (
                updatedAt && (
                  <Typography
                    variant={'caption'}
                    sx={{
                      position: 'absolute',
                      fontSize: {
                        xs: 9,
                      },
                      bottom: 5,
                      // left: {
                      //   xs: 'auto',
                      //   sm: 9,
                      // },
                      right: {
                        xs: 9,
                        // sm: 'auto',
                      },
                    }}
                  >
                    Updated at{' '}
                    {new Intl.DateTimeFormat('de-DE', {
                      hour: 'numeric',
                      minute: 'numeric',
                      second: 'numeric',
                      hour12: false,
                    }).format(new Date(updatedAt))}
                  </Typography>
                )
              )}
            </TokenInfoItemWrap>
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
};

export default TokenInfo;
