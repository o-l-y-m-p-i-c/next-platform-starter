import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { FC, ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import r from '../../../constants/routes.constants';
import SearchSocial from './SearchSocial';
import { TToken } from '../../../types/responces/Token';
import { ImageWithFallback } from '../../../components/ImageWithFallback';
import TokenUSDPrice from '../../../components/TokenUSDPrice';
import TokenAddresses from '../../../components/TokenAddresses';
import { useMintedTime } from '../../../components/TopbarTicker/utils';
import { makeAddressObj } from '../../../components/ChainIcon';
import { formatNumber } from '../../../helpers/formatNumber';
import { FeaturedIcon } from '../../../assets/FeaturedIcon';
import { MyWatchListToggl } from '../../../components/MyWatchlist';
import { useNavigate } from 'react-router-dom';
import { useAppGlobal } from '../../../hooks';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
  color: theme.palette.text.secondary,
  background: theme.palette.background.default,
  borderRadius: 4,
  '&:hover': {
    backgroundColor: '#28282d',
  },
}));

export const StatsItem = ({
  children,
  color,
}: {
  color?: string;
  children?: ReactNode | string;
}) => {
  return (
    <Box
      component={'span'}
      sx={{
        p: 0.5,
        pt: 0,
        pb: 0,
        borderRadius: 1,
        // flex: 1,
        textAlign: 'center',
        whiteSpace: 'nowrap',
        background: color ?? 'rgba(255,255,255,0.1)',
        // border: '1px solid',
      }}
    >
      {children}
    </Box>
  );
};

const SearchListElement: FC<TToken> = ({
  name,
  slug,
  symbol,
  imageURL,
  addresses,
  mintedAt,
  socials,
  stats,
  featured,
  description,
  isInMyWatchlist,
}) => {
  const tokenTitle = `${symbol} (${name})`;

  const { setSearchOpen } = useAppGlobal();

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`${r.token}/${slug}`);
    setSearchOpen(false);
  };

  return (
    <Item
      sx={{
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      <div
        onClick={handleClick}
        // to={`${r.token}/${slug}`}
        style={{
          textDecoration: 'none',
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />

      <Stack
        sx={{
          position: 'relative',
          flexDirection: {
            xs: 'column',
            sm: 'row',
          },
          gap: {
            xs: 1,
            sm: 2,
          },
        }}
      >
        <Stack
          sx={{
            position: {
              xs: 'absolute',
              sm: 'static',
            },
            right: 0,
            gap: 0.4,
          }}
        >
          <ImageWithFallback
            src={makeAddressObj(addresses[0])?.image}
            alt={makeAddressObj(addresses[0])?.label || ''}
            style={{
              width: 22,
              minWidth: 22,
              height: 22,
              marginBottom: featured ? 0 : 5,
            }}
          />
          {featured ? (
            <Box height={22}>
              <FeaturedIcon size={22} />
            </Box>
          ) : null}
          <MyWatchListToggl
            token={{ slug, name }}
            isInMyWatchlist={isInMyWatchlist}
          />
        </Stack>

        <Stack direction={'row'} gap={1}>
          <ImageWithFallback
            width={70}
            height={70}
            style={{
              borderRadius: 4,
              objectFit: 'cover',
            }}
            src={imageURL}
            alt={tokenTitle}
          />
          <Stack
            sx={{
              display: {
                xs: 'flex',
                sm: 'none',
              },
              maxWidth: 'calc(100% - 110px)',
              gap: 0.5,
              // mt: 'auto',
              overflow: 'hidden',
            }}
          >
            <Typography
              title={tokenTitle}
              variant={'subtitle2'}
              textOverflow={'ellipsis'}
              overflow={'hidden'}
              fontWeight={'bold'}
              maxWidth={'100%'}
              color={'white'}
              pr={4}
              fontSize={12}
              lineHeight={1}
              noWrap
            >
              {symbol}
              <Typography
                variant="caption"
                sx={{
                  opacity: 0.5,
                }}
              >
                {' '}
                /{makeAddressObj(addresses[0])?.label || ''}{' '}
              </Typography>
              {name}
            </Typography>
            {/* {stats?.tokenUSDPrice && (
              <Box
                fontSize={12}
                height={16}
                sx={{
                  '*': {
                    fontWeight: 'bold',
                  },
                }}
              >
                <TokenUSDPrice price={stats.tokenUSDPrice} />
              </Box>
            )} */}
            {description ? (
              <Typography
                mt={0.3}
                whiteSpace={'nowrap'}
                overflow={'hidden'}
                textOverflow={'ellipsis'}
                variant={'caption'}
              >
                {description}
              </Typography>
            ) : null}
          </Stack>
        </Stack>

        <Stack
          gap={0.5}
          minWidth={0}
          flex={1}
          sx={{
            display: {
              xs:
                stats?.USDMarketCap || mintedAt || stats?.updatedAt
                  ? 'flex'
                  : 'none',
              sm: 'flex',
            },
          }}
        >
          <Stack
            sx={{
              display: {
                xs: 'none',
                sm: 'flex',
              },
            }}
            direction={'row'}
            // alignItems={'flex-end'}
            justifyContent={'space-between'}
          >
            <Typography
              title={tokenTitle}
              variant={'subtitle2'}
              textOverflow={'ellipsis'}
              overflow={'hidden'}
              fontWeight={'bold'}
              maxWidth={'100%'}
              color={'white'}
              fontSize={15}
              lineHeight={1}
              noWrap
            >
              {symbol}
              <Typography
                variant="caption"
                fontSize={15}
                sx={{
                  opacity: 0.5,
                }}
              >
                {' '}
                /{makeAddressObj(addresses[0])?.label || ''}{' '}
              </Typography>
              {name}
            </Typography>
          </Stack>
          <Stack
            sx={{
              display: {
                xs: 'none',
                sm: 'flex',
              },
            }}
          >
            {description ? (
              <Typography
                mt={-0.4}
                whiteSpace={'nowrap'}
                overflow={'hidden'}
                textOverflow={'ellipsis'}
                variant={'caption'}
              >
                {description}
              </Typography>
            ) : null}
          </Stack>
          {(stats?.USDMarketCap || mintedAt || stats?.updatedAt) && (
            <Stack
              direction={'row'}
              mt={'auto'}
              flexWrap={'wrap'}
              gap={1}
              rowGap={1}
            >
              {stats?.USDMarketCap && (
                <StatsItem>
                  <Typography variant="caption">
                    MC:{' '}
                    <Typography
                      variant="caption"
                      fontWeight={'bold'}
                      fontSize={13}
                    >
                      ${formatNumber(stats.USDMarketCap)}
                    </Typography>
                  </Typography>
                </StatsItem>
              )}

              {stats?.tokenUSDPrice && (
                <StatsItem>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: 13,
                      '*': {
                        fontWeight: 'bold!important',
                        fontSize: 13,
                      },
                    }}
                  >
                    $
                    <TokenUSDPrice
                      price={stats.tokenUSDPrice}
                      showUSD={false}
                    />
                  </Typography>
                </StatsItem>
              )}
              {mintedAt && (
                <StatsItem>
                  <Typography variant="caption">
                    Minted:{' '}
                    <Typography variant="caption" fontWeight={'bold'}>
                      {useMintedTime(new Date(mintedAt))}
                    </Typography>
                  </Typography>
                </StatsItem>
              )}
              {/* {stats?.updatedAt && (
                <StatsItem>
                  <Typography variant="caption">
                    Last update:{' '}
                    <Typography
                      variant="caption"
                      fontWeight={'bold'}
                      fontSize={13}
                    >
                      {new Date(stats.updatedAt).toLocaleDateString('en-US', {
                        // weekday: 'short',
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                      })}
                    </Typography>
                  </Typography>
                </StatsItem>
              )} */}
            </Stack>
          )}
        </Stack>

        <Stack minWidth={140} gap={0.25}>
          <Stack
            direction={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
            gap={2}
            sx={{
              fontSize: 15,
              lineHeight: {
                md: 1.5,
              },
              '*': {
                fontSize: {
                  xs: 12,
                  md: 15,
                },
                lineHeight: 1.5,
              },
            }}
          >
            {/* <Typography variant="caption">Address:</Typography> */}
            <TokenAddresses
              addresses={addresses}
              shortAddress={7}
              asLink={false}
            />
          </Stack>
          {socials && socials.length > 0 && (
            <Stack
              mt={'auto'}
              direction={'row'}
              justifyContent={'flex-end'}
              alignItems={'center'}
              gap={2}
            >
              {/* <Typography variant="caption">Socials:</Typography> */}
              <SearchSocial socials={socials} />
            </Stack>
          )}
        </Stack>
      </Stack>
    </Item>
  );
};

export default SearchListElement;
