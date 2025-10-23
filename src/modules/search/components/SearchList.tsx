import { FC } from 'react';
import { CircularProgress, Grid, Stack, Typography } from '@mui/material';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import { usePrevious } from '@mantine/hooks';
import { TToken } from '../../../types/responces/Token';
import { TokenInfoCard } from '../../../components/TokenInfoCard';

interface SearchListProp {
    currentValue: string;
    isLoading: boolean;
    colCount?: number;
    list: TToken[];
    showLoadingLabel?: boolean;
    showNotFoundComponent?: boolean;
}

const SearchList: FC<SearchListProp> = ({
    list,
    colCount = 1,
    isLoading,
    currentValue,
    showLoadingLabel = true,
    showNotFoundComponent = true
}) => {
    const previousValue = usePrevious(currentValue);
    // list in state loading

    if (isLoading || previousValue !== currentValue) {
        return (
            <Stack
                alignItems={'center'}
                justifyContent={'center'}
                gap={2}
                sx={{
                    p: 2
                    // margin: 'auto',
                }}
            >
                <CircularProgress color={'inherit'} />
                {showLoadingLabel && <Typography variant={'h6'}>Search results</Typography>}
            </Stack>
        );
    }

    // list is empty and not state loading
    if (!list.length && !isLoading) {
        if (!showNotFoundComponent) {
            return;
        }

        return (
            <Stack
                alignItems={'center'}
                justifyContent={'center'}
                sx={{
                    p: 2,
                    margin: 'auto'
                }}
                gap={1}
                flex={1}
            >
                <TroubleshootIcon fontSize={'large'} />
                <Typography variant={'h6'}>Not Found</Typography>
            </Stack>
        );
    }

    return (
        <Grid container spacing={2}>
            {list.map((token) => (
                <Grid
                    key={token.slug}
                    size={12 / colCount}
                    sx={{
                        '&>a': {
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                        },
                        '&>a>div': {
                            height: '100%'
                        }
                    }}
                >
                    <TokenInfoCard data={token} />
                </Grid>
            ))}
        </Grid>
    );
};

export default SearchList;
