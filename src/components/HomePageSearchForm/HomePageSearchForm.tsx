'use client';

import { ChangeEvent, useMemo, useState } from 'react';
import SearchList from '@/modules/search/components/SearchList';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { IBackendResponsePagination } from '@/types/Backend';
import { TToken } from '@/types/responces/Token';
import { Pagination, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useDebouncedValue } from '@mantine/hooks';
import { useFetch } from '@/hooks';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { FAQComponent } from '../FAQComponent';

export const HomePageSearchForm = () => {
    const limit = 5;
    const router = useRouter();
    const { fetchData } = useFetch();

    const [currentPage, setCurrentPage] = useState(1);

    const searchParams = useSearchParams();

    const params = new URLSearchParams(window.location.search);
    const searchFromUrl = params.get('search') || '';

    const _query = searchParams?.get('search') ?? searchFromUrl;
    
    // Debounce the search query to avoid too many requests
    const [debouncedQuery] = useDebouncedValue(_query, 500);

    const [includeInactive] = useState(() => {
        const storedValue = localStorage.getItem('search-include-inactive');
        return storedValue ? JSON.parse(storedValue) : true;
    });

    const {
        data: searchData,
        isLoading: searchIsLoading,
        isFetching: searchIsFetching
    } = useQuery<IBackendResponsePagination<TToken>>({
        queryKey: ['/token/search', { q: debouncedQuery, includeInactive, limit, page: currentPage || 1 }],
        enabled: !!debouncedQuery && debouncedQuery.trim() !== '', // Only fetch when there's a search query
        queryFn: async (): Promise<IBackendResponsePagination<TToken>> => {
            const queryParams = new URLSearchParams({
                q: debouncedQuery || '',
                includeInactive: String(includeInactive),
                limit: String(limit),
                page: String(currentPage || 1)
            });
            
            const { data, error } = await fetchData(`/token/search?${queryParams.toString()}`);
            
            if (error) {
                throw error;
            }
            
            return data as IBackendResponsePagination<TToken>;
        }
    });

    // const debouncedSendRequest = useDebouncedCallback(() => searchQuery(), 500);

    // useEffect(() => {
    //   if (!searchIsLoading && !searchIsFetching && _query && _query !== '') {
    //     if (currentPage === 1) {
    //       if (!isFirstLoad) {
    //         debouncedSendRequest();
    //       }
    //     } else {
    //       if (!isFirstLoad) {
    //         searchQuery();
    //       }
    //     }
    //   }
    //   setIsFirstLoad(false);
    // }, [_query, currentPage]);

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;

        const params = new URLSearchParams(searchParams?.toString());
        if (!query.trim()) {
            setCurrentPage(1);
            params.delete('search');
        } else {
            setCurrentPage(1);
            params.set('search', query);
        }
        router.replace(`?${params.toString()}`);
    };

    return (
        <>
            <Stack
                gap={2}
                pt={!_query ? 5 : 0}
                flex={1}
                maxWidth={700}
                justifyContent={'center'}
                sx={{
                    width: '100%',
                    margin: '0 auto'
                }}
                overflow={'hidden'}
            >
                <Stack gap={2} pt={10} pb={_query ? 2 : 10}>
                    <Typography
                        sx={{
                            fontSize: {
                                xs: 40,
                                sm: 54
                            }
                        }}
                        variant={'h1'}
                    >
                        Welcome back, Agent.
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: {
                                xs: 24,
                                sm: 32
                            }
                        }}
                        variant={'h2'}
                    >
                        Who’s on your radar today?
                    </Typography>

                    <Stack direction={'row'} alignItems={'flex-end'} gap={1}>
                        {/* {'>'} */}
                        <ArrowForwardIosIcon fontSize="small" sx={{ color: 'action.active', my: 0.75 }} />
                        <TextField
                            fullWidth
                            sx={{
                                fontSize: {
                                    xs: 13,
                                    sm: 16
                                }
                            }}
                            defaultValue={_query}
                            size={'medium'}
                            onChange={handleOnChange}
                            placeholder="Mission briefing: Enter contract address...🕵️‍♂️🔎"
                            variant={'standard'}
                        />
                    </Stack>
                </Stack>
                {!!_query && (
                    <Stack pb={10}>
                        <SearchList
                            list={searchData?.data ?? []}
                            currentValue={_query}
                            isLoading={searchIsLoading || searchIsFetching}
                            // showNotFoundComponent={false}
                        />

                        <Stack alignItems={'center'} mt={2}>
                            <Pagination
                                size="small"
                                page={currentPage}
                                color={'primary'}
                                onChange={(_, value) => {
                                    setCurrentPage(value);
                                }}
                                count={searchData?.data?.length === limit ? currentPage + 1 : currentPage}
                            />
                        </Stack>
                    </Stack>
                )}
            </Stack>
            {!_query && (
                <Stack direction={'row'} pb={2} justifyContent={'center'}>
                    <FAQComponent />
                </Stack>
            )}
        </>
    );
};
