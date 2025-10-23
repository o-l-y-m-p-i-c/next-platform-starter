'use client';

import {
  Button,
  CircularProgress,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ImageWithFallback } from '../ImageWithFallback';
import TelegramIcon from '@mui/icons-material/Telegram';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { DrawerContent } from './DrawerContent';
import { DrawerComponent } from '../DrawerComponent';
import { useAuth } from '../../hooks';
import { useAccount } from 'wagmi';

export type TTgData = {
  title: string;
  description: string;
  handle: string;
  icon: string;
};
const TgChannels = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDrawerOpen, setDrawerFlag] = useState(false);
  const [drawerData, setDrawerData] = useState<TTgData | null>(null);
  const { user } = useAuth();
  const { isConnected } = useAccount();

  const isAuthUser = user && isConnected;

  const limit = 26;

  const {
    data,
    isLoading,
    //  error, refetch
  } = useQuery<{
    data: {
      title: string;
      description: string;
      handle: string;
      icon: string;
    }[];
    total: number;
    page: number;
    limit: number;
  }>({
    queryKey: [`/telegram?page=${currentPage}&limit=${limit}`],
  });

  const setCurrentPageFn = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const openDrawerFn = (data: TTgData) => {
    setDrawerFlag(true);
    setDrawerData(data);
  };

  const closeDrawerFn = () => {
    setDrawerFlag(false);
  };

  const getPageNumbers = ({
    currentPage,
    totalPages,
  }: {
    currentPage: number;
    totalPages: number;
  }) => {
    const pageNumbers = [];

    if (currentPage > 1) {
      pageNumbers.push(currentPage - 1);
    }

    if (currentPage > 2) {
      pageNumbers.push('...');
    }

    if (currentPage > 1) {
      pageNumbers.push(currentPage - 1);
    }

    pageNumbers.push(currentPage);

    if (currentPage < totalPages) {
      pageNumbers.push(currentPage + 1);
    }

    if (currentPage < totalPages - 1) {
      pageNumbers.push('...');
    }

    if (currentPage < totalPages) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const fullLength = data?.data ? data?.data.length : 0;
  const croppedLength = fullLength - 5;

  if (!data) {
    return;
  }

  return (
    <Stack>
      <List>
        {data?.data.slice(0, croppedLength - 1).map((data_item) => (
          <ListItemButton onClick={() => openDrawerFn(data_item)}>
            <Stack direction={'row'} alignItems={'center'} gap={2}>
              <Stack>
                <ImageWithFallback
                  src={data_item.icon}
                  alt=""
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Stack>
              <Stack>
                <Typography variant={'h6'}>{data_item.title}</Typography>
                <Typography
                  sx={{
                    display: '-webkit-box',
                    '-webkit-line-clamp': '1',
                    '-webkit-box-orient': 'vertical',
                    overflow: 'hidden',
                  }}
                  variant={'caption'}
                >
                  {data_item.description}
                </Typography>
                <Stack
                  direction={'row'}
                  alignItems={'center'}
                  gap={1}
                  sx={{
                    svg: {
                      width: 15,
                      height: 'auto',
                    },
                  }}
                >
                  <TelegramIcon />
                  <Typography color="#fff" variant={'caption'}>
                    @{data_item.handle}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </ListItemButton>
        ))}
        {isLoading && (
          <ListItem
            sx={{
              minHeight: 500,
              display: 'flex',
            }}
          >
            <Stack flex={1} justifyContent={'center'} alignItems={'center'}>
              <CircularProgress />
            </Stack>
          </ListItem>
        )}
      </List>
      {!isLoading && (
        <List
          sx={{
            position: 'relative',
            minHeight: 455,
          }}
        >
          {isAuthUser ? (
            <>
              <Stack
                sx={{
                  position: 'absolute',
                  zIndex: 1,
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
                flex={1}
                justifyContent={'center'}
                alignItems={'center'}
              >
                <Typography>Telegram call analysis coming soon...</Typography>
              </Stack>
              {data?.data
                .slice(croppedLength - 1, fullLength - 1)
                .map((data_item) => (
                  <ListItem
                    sx={{
                      filter: 'blur(10px)',
                    }}
                  >
                    <Stack direction={'row'} alignItems={'center'} gap={2}>
                      <Stack>
                        <ImageWithFallback
                          src={data_item.icon}
                          alt=""
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: '100%',
                            objectFit: 'contain',
                          }}
                        />
                      </Stack>
                      <Stack>
                        <Typography variant={'h6'}>
                          {data_item.title}
                        </Typography>
                        <Typography
                          sx={{
                            display: '-webkit-box',
                            '-webkit-line-clamp': '1',
                            '-webkit-box-orient': 'vertical',
                            overflow: 'hidden',
                          }}
                          variant={'caption'}
                        >
                          {data_item.description}
                        </Typography>
                        <Stack
                          direction={'row'}
                          alignItems={'center'}
                          gap={1}
                          sx={{
                            svg: {
                              width: 15,
                              height: 'auto',
                            },
                          }}
                        >
                          <TelegramIcon />
                          <Typography color="#fff" variant={'caption'}>
                            @{data_item.handle}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </ListItem>
                ))}
            </>
          ) : (
            <>
              <Stack
                sx={{
                  position: 'absolute',
                  zIndex: 1,
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
                flex={1}
                justifyContent={'center'}
                alignItems={'center'}
              >
                <Typography>
                  Sign up to get early access to this feature
                </Typography>
              </Stack>
              {data?.data
                .slice(croppedLength - 1, fullLength - 1)
                .map((data_item) => (
                  <ListItem
                    sx={{
                      filter: 'blur(10px)',
                    }}
                  >
                    <Stack direction={'row'} alignItems={'center'} gap={2}>
                      <Stack>
                        <ImageWithFallback
                          src={data_item.icon}
                          alt=""
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: '100%',
                            objectFit: 'contain',
                          }}
                        />
                      </Stack>
                      <Stack>
                        <Typography variant={'h6'}>
                          {data_item.title}
                        </Typography>
                        <Typography
                          sx={{
                            display: '-webkit-box',
                            '-webkit-line-clamp': '1',
                            '-webkit-box-orient': 'vertical',
                            overflow: 'hidden',
                          }}
                          variant={'caption'}
                        >
                          {data_item.description}
                        </Typography>
                        <Stack
                          direction={'row'}
                          alignItems={'center'}
                          gap={1}
                          sx={{
                            svg: {
                              width: 15,
                              height: 'auto',
                            },
                          }}
                        >
                          <TelegramIcon />
                          <Typography color="#fff" variant={'caption'}>
                            @{data_item.handle}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </ListItem>
                ))}
            </>
          )}
        </List>
      )}
      <Stack
        display={'none'}
        direction={'row'}
        justifyContent={'center'}
        gap={0.5}
      >
        <IconButton
          sx={{
            p: 0,
          }}
          color={'primary'}
          onClick={() => setCurrentPageFn(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <NavigateBeforeIcon />
        </IconButton>

        {getPageNumbers({
          currentPage: currentPage,
          totalPages: data.total,
        }).map((pageNumber) =>
          pageNumber !== '...' ? (
            <Button
              sx={{
                p: 0.5,
                pt: 0,
                pb: 0,
                width: 'auto',
                minWidth: 0,
                fontWeight: pageNumber === currentPage ? 'bold' : 'normal',
              }}
              key={`page-number-${pageNumber}`}
              variant={pageNumber === currentPage ? 'contained' : 'text'}
              //   onClick={() => setPage({ page: Number(pageNumber) })}
              onClick={() => setCurrentPageFn(Number(pageNumber))}
            >
              {pageNumber}
            </Button>
          ) : (
            pageNumber
          ),
        )}
        <IconButton
          sx={{
            p: 0,
          }}
          onClick={() => setCurrentPageFn(currentPage + 1)}
          //   disabled={data.total / (limit * )}
          color={'primary'}
        >
          <NavigateNextIcon />
        </IconButton>
      </Stack>
      <DrawerComponent
        drawerProps={{
          open: isDrawerOpen,
        }}
        handleClose={closeDrawerFn}
        headerComponent={
          drawerData && (
            <Stack direction={'row'} alignItems={'center'} gap={2}>
              <Stack>
                <ImageWithFallback
                  src={drawerData.icon}
                  alt=""
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Stack>
              <Stack>
                <Typography variant={'h6'}>{drawerData.title}</Typography>

                <Stack
                  direction={'row'}
                  alignItems={'center'}
                  gap={1}
                  sx={{
                    svg: {
                      width: 15,
                      height: 'auto',
                    },
                  }}
                >
                  <TelegramIcon />
                  <Link
                    target={'_blank'}
                    sx={{
                      lineHeight: 1,
                    }}
                    href={`https://t.me/${drawerData.handle}`}
                  >
                    <Typography variant={'caption'}>
                      @{drawerData.handle}
                    </Typography>
                  </Link>
                </Stack>
              </Stack>
            </Stack>
          )
        }
      >
        {drawerData && <DrawerContent tg_data={drawerData} />}
      </DrawerComponent>
    </Stack>
  );
};

export { TgChannels };
