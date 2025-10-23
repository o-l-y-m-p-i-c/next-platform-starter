'use client';

import {
  Box,
  Button,
  CircularProgress,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import { SocketContext } from '../../context/Socket';
import type { TToken } from '@/types/responces/Token';

import { v4 as uuidv4 } from 'uuid';
import { TrandingCoinsList } from './TrandingCoinsList';
import { useQuery } from '@tanstack/react-query';
import { config } from '@/config';
import { Stack, styled } from '@mui/system';
// import SearchList from '@/modules/search/components/SearchList';
import { IBackendResponsePagination } from '@/types/Backend';
import Link from 'next/link';
import r from '@/constants/routes.constants';
import { TokenInfoCard } from '../TokenInfoCard';
// import { PaginatedList } from '../PaginatedList';

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    variant="scrollable"
    scrollButtons
    allowScrollButtonsMobile
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 40,
    width: '100%',
    backgroundColor: theme.palette.primary.main,
  },
}));

interface StyledTabProps {
  label: string;
}

const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: 'none',
  marginRight: theme.spacing(1),
  color: 'rgba(255, 255, 255, 0.7)',
  '&.Mui-selected': {
    color: '#fff',
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(100, 95, 228, 0.32)',
  },
}));

export type IFeedData = {
  _id: string;
  positive: number;
  negative: number;
  neutral: number;
  token: TToken;
  total: number;
  previousPlace: number;
};

export interface IFlyingCoin extends TToken {
  keyRow: string;
  left: string;
}

const TrandingCoins = ({ limit = 5 }: { limit?: number }) => {
  const socket = useContext(SocketContext);
  const [flyingCoins, setFlyingCoins] = useState<IFlyingCoin[]>([]);
  const flyingCoinsRef = useRef<IFlyingCoin[]>([]);

  const {
    data: featuredCoins,
    isLoading: isFeaturedCoinsLoading,
    error: errorFeaturedCoins,
  } = useQuery<{
    data: TToken[];
  }>({
    queryKey: [`${config.CORE_API_URL}/token/featured`],
  });

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on('feed:demoTrandingCoins2', (data) => {
      if (data.length > 0) {
        const newCoins =
          flyingCoinsRef?.current
            ?.filter((c) => c.symbol !== data[0].symbol)
            .slice(-2) || [];

        setFlyingCoins([
          ...newCoins,
          { ...data[0], keyRow: uuidv4(), left: `${Math.random() * 70}%` },
        ]);
      }
    });
    socket.emit('subscribe', 'feed:demoTrandingCoins2');

    return () => {
      socket.off('feed:demoTrandingCoins2');
      socket.emit('unsubscribe', 'feed:demoTrandingCoins2');
    };
  }, [socket]);

  useEffect(() => {
    if (flyingCoins.length > 0) {
      flyingCoinsRef.current = flyingCoins;
    }
  }, [flyingCoins]);

  const [currentTab, setCurrentTab] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const [currentPage, setCurrentPage] = useState(1);

  // const changePage = (arg: number) => {
  //   setCurrentPage(arg);
  // };

  const {
    data: tagTabs,
    isLoading: isLoadingTagTabs,
    error: errorTagTabs,
  } = useQuery<{
    data: {
      slug: string;
      name: string;
      feature: boolean;
    }[];
  }>({
    queryKey: ['/tokentag', { featured: true }],
  });

  const {
    data: tagData,
    isLoading: isLoadingTagData,
    error: errorTagData,
  } = useQuery<IBackendResponsePagination<TToken>>({
    queryKey: [
      `/tokentag/${tagTabs?.data[currentTab]?.slug}/data`,
      { limit, page: currentPage || 1 },
    ],
    enabled:
      !errorTagTabs && !!tagTabs?.data && currentTab < tagTabs?.data.length,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [currentTab]);

  return (
    <Box>
      <Box
        sx={{
          minHeight: {
            xs: 655,
          },
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ mt: -2, mb: 1, borderBottom: 1, borderColor: 'divider' }}>
          <StyledTabs value={currentTab} onChange={handleChange}>
            {tagTabs?.data.map((tab) => (
              <StyledTab label={tab.name} key={`source-tab-${tab.name}`} />
            ))}
            <StyledTab label="Featured" />
          </StyledTabs>
        </Box>
        {!errorTagTabs &&
          tagTabs?.data &&
          currentTab === tagTabs?.data.length &&
          !isFeaturedCoinsLoading &&
          featuredCoins && (
            <Stack flex={1} mt={0.5} position={'relative'}>
              <TrandingCoinsList
                animated={true}
                list={featuredCoins.data as TToken[]}
              />
            </Stack>
          )}
        {(errorTagTabs || errorTagData) && (
          <Stack flex={1}>
            <Typography>
              {errorTagTabs?.message ?? errorTagData?.message}
            </Typography>
          </Stack>
        )}
        {currentTab < (tagTabs?.data.length ?? 999) && (
          <>
            <Stack
              gap={1}
              mt={1}
              flex={1}
              sx={{
                overflowX: 'hidden',
                minHeight: 580,
                textAlign: 'left',
              }}
            >
              {(!isLoadingTagData || !isLoadingTagTabs) &&
                tagData?.data &&
                tagData?.data.map((tagItem) => (
                  <TokenInfoCard data={tagItem} />
                ))}
            </Stack>
            {!isLoadingTagData && !isLoadingTagTabs && (
              <Stack pt={1} pb={0}>
                <Link
                  href={`${r.tags}/${tagTabs?.data[currentTab]?.slug}`}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                >
                  <Button variant={'contained'} size="small">
                    View all
                  </Button>
                </Link>
              </Stack>
            )}
            {/* <Stack
              direction={'row'}
              alignItems={'center'}
              justifyContent={'center'}
              mt={1}
              gap={1}
            >
              <IconButton
                sx={{
                  p: '0!important',
                }}
                color={'primary'}
                disabled={currentPage <= 1}
                onClick={() => {
                  changePage(currentPage - 1);
                }}
              >
                <NavigateBeforeIcon />
              </IconButton>
              <Button
                variant={'contained'}
                sx={{
                  minWidth: 0,
                  p: 0.5,
                  pt: 0.2,
                  pb: 0.2,
                  pointerEvents: 'none',
                }}
              >
                {currentPage}
              </Button>
              <IconButton
                size="small"
                sx={{
                  p: '0!important',
                }}
                color={'primary'}
                onClick={() => {
                  changePage(currentPage + 1);
                }}
              >
                <NavigateNextIcon fontSize={'small'} />
              </IconButton>
            </Stack> */}
          </>
        )}
        {isFeaturedCoinsLoading && (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        )}
        {errorFeaturedCoins && !isFeaturedCoinsLoading && (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            We are collecting data
          </Box>
        )}
      </Box>
    </Box>
  );
};

export { TrandingCoins };
