import { Stack } from '@mui/system';
import {
  Button,
  Card,
  CircularProgress,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { TTgData } from '../TgChannels';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import TelegramIcon from '@mui/icons-material/Telegram';

const DrawerContent = ({ tg_data }: { tg_data: TTgData }) => {
  const { data, refetch, isFetching, isLoading } = useQuery<{
    data: {
      messageURL: string;
      message: string;
      messageTime: string;
    }[];
  }>({
    queryKey: [`/telegram/${tg_data.handle}`],
    enabled: false,
  });

  useEffect(() => {
    if (tg_data && tg_data.handle) {
      refetch();
    }
  }, [tg_data]);

  const dateFormatter = new Intl.DateTimeFormat('ru', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <>
      <Stack flex={1} p={2}>
        {!isLoading && !isFetching && data?.data && data?.data.length > 0 && (
          <List
            sx={{
              li: {
                p: 0,
                mb: 4,
              },
            }}
          >
            {data?.data.map((data_item) => (
              <ListItem>
                <Stack gap={1} flex={1} mb={1}>
                  <Stack direction={'row'} gap={0.5} alignItems={'center'}>
                    <TelegramIcon fontSize={'small'} />
                    <Typography variant={'body2'}>Message</Typography>
                  </Stack>
                  <Card
                    variant={'outlined'}
                    sx={{
                      p: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {data_item.message}
                    </Typography>

                    <Typography
                      mt={2}
                      textAlign={'right'}
                      variant={'caption'}
                      sx={{
                        display: 'block',
                      }}
                    >
                      {dateFormatter.format(
                        new Date(data_item.messageTime).getTime(),
                      )}{' '}
                      {timeFormatter.format(
                        new Date(data_item.messageTime).getTime(),
                      )}
                    </Typography>
                  </Card>

                  <Button
                    variant={'outlined'}
                    target={'_blank'}
                    color={'primary'}
                    sx={{
                      '&:hover': {
                        color: 'primary.main',
                      },
                      borderRadius: 10,
                    }}
                    href={`${data_item.messageURL}`}
                  >
                    View in Telegram
                  </Button>
                </Stack>
              </ListItem>
            ))}
          </List>
        )}
        {!isFetching && !isLoading && data?.data.length === 0 && (
          <Stack flex={1} justifyContent={'center'} alignItems={'center'}>
            <Typography
              sx={{
                fontWeight: 'bold',
              }}
            >
              No data
            </Typography>
          </Stack>
        )}
        {(isLoading || isFetching) && (
          <Stack justifyContent={'center'} alignItems={'center'} flex={1}>
            <CircularProgress size={35} />
          </Stack>
        )}
      </Stack>
    </>
  );
};

export { DrawerContent };
