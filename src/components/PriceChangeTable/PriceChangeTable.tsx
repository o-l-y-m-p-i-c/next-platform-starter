import { Tab, Tabs, Typography } from '@mui/material';
import { Box, Stack, useTheme } from '@mui/system';
import { formatNumber } from '../../helpers/formatNumber';
import { FC, useEffect, useMemo, useState } from 'react';
import { InfoBlock, TabDexContent } from '../TokenMetrics/TokenMetrics';
import { DexScreenerPair } from '../TokenInfo/types';
import { useQuery } from '@tanstack/react-query';
import {
  ITwitterResponse,
  ITwitterTweet,
} from '@/modules/twitter/twitter.interfaces';
import { getTimestampsByThreshold } from '@/modules/twitter/twitter.utils';
import { TToken } from '@/types/responces/Token';
import { MemePaper } from '../MemePaper';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  );
}

export const PriceChangeTable: FC<{
  dexData: DexScreenerPair;
  tokenInfo: TToken;
}> = ({ dexData, tokenInfo }) => {
  const { priceChange, volume, txns } = dexData;

  const [value, setValue] = useState(3);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const theme = useTheme();

  const currentData = new Date();

  const periods = {
    '5M': 5 * 60 * 1000,
    '1H': 60 * 60 * 1000,
    '6H': 6 * 60 * 60 * 1000,
    '24H': 24 * 60 * 60 * 1000,
  } as const;

  const periodKeys = Object.keys(periods) as (keyof typeof periods)[];

  const { start_date, end_date } = useMemo(() => {
    const selectedKey = periodKeys[value];
    return getTimestampsByThreshold(0, [
      new Date(currentData.getTime() - periods[selectedKey]).toISOString(),
      new Date(currentData.getTime()).toISOString(),
    ]);
  }, [value]);

  const {
    data: TwitterResponse,
    refetch: TwitterRefetch,
    // error,
  } = useQuery<ITwitterResponse<ITwitterTweet[]>>({
    queryKey: [
      `/token/${tokenInfo.slug}/twitter`,
      {
        page: '1',
        limit: 10000,
        minFollowers: 1000,
        from: new Date(start_date * 1000).toISOString(),
        to: new Date(end_date * 1000).toISOString(),
      },
    ],
    enabled: false,
  });

  useEffect(() => {
    TwitterRefetch();
  }, [value]);

  const TwitterData = TwitterResponse?.data ?? [];

  const positiveTweetCount = TwitterData.filter(
    (item) => item.sentiment === 'positive' || item.sentiment === 'neutral',
  ).length;

  const negativeTweetCount = TwitterData.filter(
    (item) => item.sentiment === 'negative',
  ).length;

  return (
    <MemePaper>
      <Stack
        // p={1}
        sx={{
          border: 1,
          borderColor: 'divider',
        }}
      >
        <Stack sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            sx={{
              flexDirection: 'column',
              '.Mui-selected': {
                backgroundColor: 'rgba(255,255,255,0.05)',
              },
              '.MuiTab-root:hover': {
                backgroundColor: 'rgba(255,255,255,0.02)',
              },
            }}
            variant="fullWidth"
            allowScrollButtonsMobile
          >
            <Tab
              sx={{
                p: 1,
                borderRight: 0.5,
                borderColor: 'divider',
                minHeight: 0,
                minWidth: 0,
                '.MuiTab-icon': {
                  mt: 0.4,
                },
              }}
              icon={
                <Typography
                  variant={'subtitle1'}
                  fontWeight={'bold'}
                  sx={{
                    fontSize: 16,
                    lineHeight: 1,
                    color:
                      priceChange.m5 < 0
                        ? theme.palette.error.main
                        : priceChange.m5
                          ? theme.palette.success.main
                          : '',
                  }}
                >
                  {priceChange.m5 ? `${formatNumber(priceChange.m5)}%` : '-'}
                </Typography>
              }
              label="5M"
              iconPosition="bottom"
              {...a11yProps(0)}
            />
            <Tab
              sx={{
                p: 1,
                borderRight: 0.5,
                borderLeft: 0.5,
                borderColor: 'divider',
                minHeight: 0,
                minWidth: 0,
                '.MuiTab-icon': {
                  mt: 0.4,
                },
              }}
              icon={
                <Typography
                  variant={'subtitle1'}
                  fontWeight={'bold'}
                  sx={{
                    fontSize: 16,
                    lineHeight: 1,
                    color:
                      priceChange.h1 < 0
                        ? theme.palette.error.main
                        : priceChange.h1
                          ? theme.palette.success.main
                          : '',
                  }}
                >
                  {priceChange.h1 ? `${formatNumber(priceChange.h1)}%` : '-'}
                </Typography>
              }
              label="1H"
              iconPosition="bottom"
              {...a11yProps(1)}
            />
            <Tab
              sx={{
                p: 1,
                borderRight: 0.5,
                borderLeft: 0.5,
                borderColor: 'divider',
                minHeight: 0,
                minWidth: 0,
                '.MuiTab-icon': {
                  mt: 0.4,
                },
              }}
              icon={
                <Typography
                  variant={'subtitle1'}
                  fontWeight={'bold'}
                  sx={{
                    fontSize: 16,
                    lineHeight: 1,
                    color:
                      priceChange.h6 < 0
                        ? theme.palette.error.main
                        : priceChange.h6
                          ? theme.palette.success.main
                          : '',
                  }}
                >
                  {priceChange.h6 ? `${formatNumber(priceChange.h6)}%` : '-'}
                </Typography>
              }
              label="6H"
              iconPosition="bottom"
              {...a11yProps(2)}
            />
            <Tab
              sx={{
                p: 1,
                borderLeft: 0.5,
                borderColor: 'divider',
                minHeight: 0,
                minWidth: 0,
                '.MuiTab-icon': {
                  mt: 0.4,
                },
              }}
              icon={
                <Typography
                  variant={'subtitle1'}
                  fontWeight={'bold'}
                  sx={{
                    fontSize: 16,
                    lineHeight: 1,
                    color:
                      priceChange.h24 < 0
                        ? theme.palette.error.main
                        : priceChange.h24
                          ? theme.palette.success.main
                          : '',
                  }}
                >
                  {priceChange.h24 ? `${formatNumber(priceChange.h24)}%` : '-'}
                </Typography>
              }
              label="24H"
              iconPosition="bottom"
              {...a11yProps(3)}
            />
          </Tabs>
        </Stack>
        <CustomTabPanel value={value} index={0}>
          <Stack gap={1}>
            <Stack gap={1} direction={'row'}>
              <InfoBlock hasBottomBorder={false}>
                <Typography variant={'subtitle1'}>Volume</Typography>
                <Typography
                  variant={'subtitle1'}
                  sx={{
                    fontWeight: 'bold!important',
                    '*': {
                      fontWeight: 'bold!important',
                    },
                  }}
                  color="#fff"
                >
                  ${formatNumber(volume.m5)}
                </Typography>
              </InfoBlock>
            </Stack>
            <TabDexContent
              txns={txns.m5}
              tweets={{
                positive: positiveTweetCount,
                negative: negativeTweetCount,
              }}
            />
          </Stack>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Stack gap={1}>
            <Stack gap={1} direction={'row'}>
              <InfoBlock hasBottomBorder={false}>
                <Typography variant={'subtitle1'}>Volume</Typography>
                <Typography variant={'subtitle1'} color="#fff">
                  ${formatNumber(volume.h1)}
                </Typography>
              </InfoBlock>
            </Stack>
            <TabDexContent
              txns={txns.h1}
              tweets={{
                positive: positiveTweetCount,
                negative: negativeTweetCount,
              }}
            />
          </Stack>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <Stack gap={1}>
            <Stack gap={1} direction={'row'}>
              <InfoBlock hasBottomBorder={false}>
                <Typography variant={'subtitle1'}>Volume</Typography>
                <Typography variant={'subtitle1'} color="#fff">
                  ${formatNumber(volume.h6)}
                </Typography>
              </InfoBlock>
            </Stack>
            <TabDexContent
              txns={txns.h6}
              tweets={{
                positive: positiveTweetCount,
                negative: negativeTweetCount,
              }}
            />
          </Stack>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <Stack gap={1}>
            <Stack gap={1} direction={'row'}>
              <InfoBlock hasBottomBorder={false}>
                <Typography variant={'subtitle1'}>Volume</Typography>
                <Typography variant={'subtitle1'} color="#fff">
                  ${formatNumber(volume.h24)}
                </Typography>
              </InfoBlock>
            </Stack>
            <TabDexContent
              txns={txns.h24}
              tweets={{
                positive: positiveTweetCount,
                negative: negativeTweetCount,
              }}
            />
          </Stack>
        </CustomTabPanel>
      </Stack>
    </MemePaper>
  );
};
