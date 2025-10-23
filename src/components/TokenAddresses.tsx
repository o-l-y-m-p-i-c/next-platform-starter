import { FC } from 'react';
import Typography from '@mui/material/Typography';
import Link, { LinkProps } from '@mui/material/Link';
import Stack, { StackProps } from '@mui/material/Stack';
import Box from '@mui/material/Box';

import { shortenAddress } from '../utils/shortenAddress';
import { TTokenAddress } from '@/types/responces/Token';
import { makeAddressObj } from './ChainIcon';
import { Button } from '@mui/material';
import { handleCopy } from '../helpers/handleCopy';
import LaunchIcon from '@mui/icons-material/Launch';
import NextLink from 'next/link';

interface TokenAddressesProp {
  addresses: TTokenAddress[];
  shortAddress?: number;
  asLink?: boolean;
  size?: number;
  canCopy?: boolean;
  canExplore?: boolean;
}

const TokenAddresses: FC<TokenAddressesProp> = ({
  addresses,
  size = 12,
  asLink = true,
  canCopy,
  canExplore,
  shortAddress, // undefined or more then 4 symbols
}) => {
  if (!addresses.length) {
    return null;
  }

  return (
    <Stack direction={'column'} gap={0.5}>
      {addresses.map((address) => {
        const linkAdditionalProps: StackProps & LinkProps = {};
        const renderObject = makeAddressObj(address);

        if (!renderObject) {
          return null;
        }

        if (asLink) {
          linkAdditionalProps.rel = 'noopener';
          linkAdditionalProps.component = Link;
          linkAdditionalProps.href = renderObject.href;
          linkAdditionalProps.target = '_blank';
        }

        return (
          <Stack
            direction={'row'}
            position={'relative'}
            key={address.blockchainId}
            lineHeight={`${size}px`}
            alignItems={'center'}
            minWidth={0}
            gap={1}
            sx={{
              textDecoration: 'none',
              color: 'white',
              ':hover': { color: 'white' },
            }}
          >
            {canCopy && (
              <Button
                variant={'text'}
                sx={{
                  // pl: `${size + 4 + 5}px`,
                  pt: '4px',
                  pb: '4px',
                  color: 'white',
                  border: '1px solid',
                  opacity: 0.75,
                  lineHeight: 1,
                  textTransform: 'none',
                }}
                onClick={() => handleCopy({ text: address.blockchainAddress })}
              >
                <Typography
                  title={address.blockchainAddress}
                  textOverflow={'ellipsis'}
                  lineHeight={`${size}px`}
                  overflow={'hidden'}
                  maxWidth={'100%'}
                  fontSize={size}
                  sx={{
                    textDecoration: 'none',
                    lineHeight: 1,
                    transform: 'translateY(0px)',
                  }}
                  noWrap
                >
                  {shortAddress && shortAddress >= 4
                    ? shortenAddress(address.blockchainAddress, shortAddress)
                    : address.blockchainAddress}
                </Typography>
              </Button>
            )}
            {!canCopy && (
              <Box position={'relative'} sx={{ pl: `${size + 4 + 5}px` }}>
                <Box
                  width={size}
                  height={size}
                  overflow={'hidden'}
                  position={'absolute'}
                  left={5}
                  top={'50%'}
                  sx={{
                    display: 'flex',
                    transform: 'translateY(-50%)',
                    '> img': {
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    },
                  }}
                >
                  <img src={renderObject.image} alt={renderObject.label} />
                </Box>
                <Typography
                  title={address.blockchainAddress}
                  textOverflow={'ellipsis'}
                  lineHeight={`${size}px`}
                  overflow={'hidden'}
                  maxWidth={'100%'}
                  fontSize={size}
                  sx={{
                    textDecoration: 'none',
                    lineHeight: 1,
                    transform: 'translateY(0px)',
                  }}
                  noWrap
                >
                  {shortAddress && shortAddress >= 4
                    ? shortenAddress(address.blockchainAddress, shortAddress)
                    : address.blockchainAddress}
                </Typography>
              </Box>
            )}
            {canCopy &&
              canExplore &&
              asLink &&
              renderObject &&
              renderObject?.href && (
                <NextLink href={renderObject.href} target={'_blank'}>
                  <Button
                    sx={{
                      minWidth: 26,
                      height: 26,
                      // width: 26,
                      borderRadius: 1,
                      gap: 0.5,
                    }}
                    variant="text"
                  >
                    <Typography variant="caption" fontSize={13}>
                      EXP
                    </Typography>
                    <LaunchIcon
                      sx={{
                        width: 20,
                        height: 20,
                      }}
                    />
                  </Button>
                </NextLink>
              )}
          </Stack>
        );
      })}
    </Stack>
  );
};

export default TokenAddresses;
