'use client';

import { Stack, useTheme } from '@mui/system';
import { MemePaper } from '@/components/MemePaper';
import {
  Avatar,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import { useActionState } from 'react';
import { useAuth, useFetch } from '@/hooks';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

type TEditProfile = {
  username: string;
};

const Edit = () => {
  const auth = useAuth();
  const { address } = useAccount();
  const router = useRouter();
  const { fetchData } = useFetch();

  const data = auth.user?.user;

  useEffect(() => {
    if (!data) {
      router.push('/profile');
    }
  }, [data, router]);

  const [state, formAction, isPending] = useActionState<TEditProfile, FormData>(
    async (_previousState, payload: FormData) => {
      try {
        const username = payload.get('username');

        if (!username || username === '') {
          throw new Error('Please enter a username');
        }

        const { data, error } = await fetchData<{ data: { username: string } }>(
          '/users/me',
          {
            method: 'PATCH',
            body: {
              username,
            },
          },
        );

        if (error) {
          throw new Error(error.message);
        }

        if (data?.data) {
          toast.success('Success');
          return {
            username: data?.data.username ?? '',
          };
        }

        return {
          username: '',
        };
      } catch (error) {
        const typedError = error as Error;
        toast.error(typedError.message);
        return {
          username: '',
        };
      }
    },
    { username: data?.username ?? '' },
  );

  const cancelHandler = () => {
    router.push('/profile');
  };

  const theme = useTheme();

  return (
    <Stack flex={1} alignItems={'center'}>
      <Stack
        sx={{
          maxWidth: 800,
          width: '100%',
        }}
      >
        <MemePaper title={'My profile data'}>
          <form action={formAction}>
            <Stack
              sx={{
                textAlign: 'left',
              }}
              gap={2}
              mb={2}
              mt={1}
            >
              <Stack direction={'row'} alignItems={'center'} gap={2}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: theme.palette.primary.dark,
                    color: 'white',
                    fontWeight: 700,
                    textTransform: 'none',
                  }}
                >
                  {address?.toString().slice(0, 5)}
                </Avatar>
                <Button variant={'contained'} disabled={true}>
                  Change avatar
                </Button>
              </Stack>
              <Stack gap={2}>
                <Typography variant={'h6'}>Username</Typography>
                <TextField
                  placeholder={'Enter username'}
                  label={'Enter username'}
                  defaultValue={state.username}
                  autoComplete="username"
                  autoFocus={true}
                  name={'username'}
                />
              </Stack>
            </Stack>
            <Stack direction={'row'} spacing={2}>
              <Button
                onClick={cancelHandler}
                sx={{ flex: 1 }}
                variant={'outlined'}
              >
                Cancel
              </Button>
              <Button
                sx={{ flex: 1 }}
                type={'submit'}
                variant={'contained'}
                disabled={isPending}
              >
                {!isPending ? (
                  'Submit'
                ) : (
                  <Stack
                    sx={{
                      svg: {
                        width: 20,
                      },
                    }}
                  >
                    <CircularProgress color={'inherit'} size={'small'} />
                  </Stack>
                )}
              </Button>
            </Stack>
          </form>
        </MemePaper>
      </Stack>
    </Stack>
  );
};

export { Edit };
