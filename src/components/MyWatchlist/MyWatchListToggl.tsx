'use client';

import { FC, useMemo } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import type { TToken } from '@/types/responces/Token';
import { useAuth } from '@/hooks/useAuth';
import { useFetch } from '../../hooks';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';

interface MyWatchListTogglProps {
  token: Pick<TToken, 'slug' | 'name'>;
  isInMyWatchlist?: boolean;
  mode?: 'watchlist' | 'token';
  queryKeys?: string[];
}

const MyWatchListToggl: FC<MyWatchListTogglProps> = ({
  token,
  isInMyWatchlist = false,
  mode = 'watchlist',
  queryKeys = [],
}) => {
  const { user } = useAuth();
  const { fetchData } = useFetch();
  const queryClient = useQueryClient();

  const handleClick = async () => {
    try {
      const request = await fetchData('/users/whatchlist', {
        method: isInMyWatchlist ? 'DELETE' : 'PUT',
        body: { tokenSlug: token.slug },
      });

      if (request) {
        const keysToInvalidate = [
          '/users/whatchlist',
          '/token/search',
          '/tokentag',
          ...queryKeys,
        ];

        queryClient.invalidateQueries({
          predicate: (query) => {
            const keyString = query.queryKey.join('/');
            return keysToInvalidate.some((prefix) =>
              keyString.startsWith(prefix),
            );
          },
        });

        toast.success(
          isInMyWatchlist
            ? 'Token successfully removed from favorites'
            : 'Token successfully added to favorites',
        );
      }
    } catch (error) {
      const typedError = error as Error;
      toast.error(typedError?.message || 'Error starting session.');
    }
  };

  const modeStyle = useMemo(() => {
    switch (mode) {
      case 'watchlist':
        return {
          p: 0.5,
          // m: -0.5,
          position: 'relative',
          zIndex: 2,
          fontSize: 22,
        };

      default:
        return {};
    }
  }, [mode]);

  if (!user) {
    return null;
  }

  return (
    <Tooltip
      title={isInMyWatchlist ? 'Remove from favorites' : 'Add to favorites'}
    >
      <IconButton
        sx={{
          ...modeStyle,
          ...{
            '&>*:nth-of-type(2)': {
              display: 'none',
            },
            '&:hover>:nth-of-type(2)': {
              display: 'block',
            },
            '&:hover>:nth-of-type(1)': {
              display: 'none',
            },
          },
          border: '1px solid',
        }}
        onClick={handleClick}
      >
        {!isInMyWatchlist ? (
          <>
            <BookmarkIcon fontSize={'inherit'} />
            <BookmarkAddIcon fontSize={'inherit'} />
          </>
        ) : (
          <>
            <BookmarkAddedIcon fontSize={'inherit'} />
            <BookmarkRemoveIcon fontSize={'inherit'} />
          </>
        )}
      </IconButton>
    </Tooltip>
  );
};

export { MyWatchListToggl };
