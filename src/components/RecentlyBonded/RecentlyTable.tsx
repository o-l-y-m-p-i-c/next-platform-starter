import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TToken } from '@/types/responces/Token';
import { getShortTimeSinceWithTimer } from '../TopbarTicker/utils';
import { ImageWithFallback } from '../ImageWithFallback';
import { Box, Stack } from '@mui/system';
import { Typography } from '@mui/material';
import { formatNumber } from '../../helpers/formatNumber';
import TokenUSDPrice from '../TokenUSDPrice';
import TokenAddresses from '../TokenAddresses';
import { useRouter } from 'next/navigation';

interface Column {
  id:
    | 'image'
    | 'tokenData'
    | 'mc'
    | 'tokenPrice'
    | 'addresses'
    | 'graduatedTime'
    | 'mintedAt';
  label: string;
  minWidth?: number;
  width?: number;
  align?: 'right';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  format?: (value: any) => any;
}

const columns: Column[] = [
  {
    id: 'image',
    label: '',
    minWidth: 70,
    width: 70,
    format: ({ imageURL, symbol }) => {
      return (
        <Box position={'relative'}>
          <ImageWithFallback
            style={{
              border: '#FBFBFB solid 2px',
              borderRadius: '10px',
              objectFit: 'cover',
              minWidth: 50,
              color: '#FFFFFF00',
              lineHeight: 0,
            }}
            containerstyleprops={{ width: 50, height: 50 }}
            src={imageURL}
            alt={symbol}
            width={50}
            height={50}
          />
        </Box>
      );
    },
  },
  {
    id: 'tokenData',
    label: 'Token',
    minWidth: 100,
    format: ({ name, symbol }) => {
      return (
        <Stack
          direction={'column'}
          sx={{
            overflow: 'hidden',
            maxWidth: 'calc(100vw - 166px)',
          }}
          spacing={0.25}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              textOverflow: 'unset',
              overflow: 'visible',
            }}
            color={'white'}
            noWrap
          >
            ${symbol}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              opacity: 0.5,
            }}
            color={'white'}
            noWrap
          >
            {name}
          </Typography>
        </Stack>
      );
    },
  },
  {
    id: 'mc',
    label: 'MC',
    minWidth: 100,
    format: (value) => (
      <Box
        sx={{
          color: 'success.main',
          fontWeight: 'bold',
          '*': {
            fontWeight: 'bold',
          },
        }}
      >
        ${formatNumber(value ?? 0, 2)}
      </Box>
    ),
  },
  {
    id: 'tokenPrice',
    label: 'Token Price',
    minWidth: 100,
    format: (value) => {
      return (
        <Box>
          $
          <TokenUSDPrice price={value ?? 0} showUSD={false} />
        </Box>
      );
    },
  },
  {
    id: 'addresses',
    label: 'Address',
    minWidth: 100,
    format: (value) => (
      <TokenAddresses addresses={[value[0]]} shortAddress={7} />
    ),
  },
  {
    id: 'graduatedTime',
    label: 'Graduated Time',
    minWidth: 100,
    // format: (value) => value,
  },
  {
    id: 'mintedAt',
    label: 'Minted ago',
    minWidth: 100,
    // format: () => 'this',
  },
];

export function RecentlyTable({ data }: { data: TToken[] }) {
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

  const newRows = data.map((row) => {
    if (!row?.pumpFunGraduatedAt || !row?.mintedAt) return {};

    const graduatedTime =
      new Date(row.pumpFunGraduatedAt).getTime() -
      new Date(row.mintedAt).getTime();

    const timeNeeded = convertMsToTime(graduatedTime);

    const { getFullString, time } = getShortTimeSinceWithTimer(
      new Date(row.pumpFunGraduatedAt),
    );

    return {
      slug: row.slug,
      image: {
        imageURL: row.imageURL ?? '',
        symbol: row.symbol ?? '',
      },
      tokenData: {
        name: row.name,
        symbol: row.symbol,
      },
      mc: row.stats?.USDMarketCap,
      tokenPrice: row.stats?.tokenUSDPrice,
      addresses: row.addresses,

      mintedAt: (
        <>
          {timeNeeded.days !== 0 && timeNeeded.days + 'd'} {timeNeeded.hours}h{' '}
          {timeNeeded.minutes}m
        </>
      ),
      graduatedTime: getFullString(time),
    };
  });

  const router = useRouter();

  const handleClick = (slug: string) => {
    router.push(`/token/${slug}`);
  };

  return (
    <>
      <TableContainer
        sx={{
          flex: 1,
          mt: 1,
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={`${column.id}-head`}
                  align={column.align}
                  style={{
                    top: 0,
                    minWidth: column.minWidth,
                    width: column.width,
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {newRows.map((row) => {
              return (
                <TableRow
                  onClick={() => row?.slug && handleClick(row.slug)}
                  hover={!!row?.slug}
                  sx={{ ...(row?.slug && { cursor: 'pointer' }) }}
                  tabIndex={-1}
                  key={row.slug}
                >
                  {columns.map((column, index) => {
                    const value = row[column.id];
                    return (
                      <TableCell
                        sx={{
                          ...(index === 0 && { p: 1 }),
                          ...(index === 1 && { pl: 1 }),
                        }}
                        key={`${column.id}-body`}
                        align={column.align}
                      >
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
    </>
  );
}
