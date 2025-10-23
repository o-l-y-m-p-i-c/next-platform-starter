'use client';

import React, { ReactNode, useState } from 'react';
import { Pagination, Stack } from '@mui/material';
import { TToken } from '@/types/responces/Token';

type PaginationItem = {
  data: TToken;
  delta?: number;
  currentPosition?: number;
};

type PaginationProps<T> = {
  items: T[];
  itemsPerPage: number;
  renderItem: (item: T & PaginationItem) => ReactNode;
  hasPosition?: boolean;
  callback?: (arg: number) => void;
};

export const PaginatedList = <T,>({
  items,
  hasPosition = false,
  itemsPerPage,
  renderItem,
  callback,
}: PaginationProps<T>) => {
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    if (callback) {
      callback(value);
    }
  };

  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Stack gap={1}>
      <Stack gap={1}>
        {currentItems.map((item, index) =>
          renderItem({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(item as any),
            data: item,
            ...(hasPosition && {
              delta: (item as PaginationItem).delta,
              currentPosition: itemsPerPage * (page - 1) + index + 1,
            }),
          }),
        )}
      </Stack>
      <Stack mt={1} alignItems={'center'}>
        <Pagination
          count={pageCount}
          page={page}
          size="small"
          onChange={handleChange}
          color="primary"
        />
      </Stack>
    </Stack>
  );
};
