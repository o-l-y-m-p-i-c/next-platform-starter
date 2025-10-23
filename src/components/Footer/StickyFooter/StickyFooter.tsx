import { IconButton, List, ListItem, Paper } from '@mui/material';
import { Box } from '@mui/system';
import Link from 'next/link';
import TheThingIcon from '../../../assets/LogoTest.svg';
import SearchIcon from '@mui/icons-material/Search';
import { useAppGlobal } from '@/hooks';
import { config } from '@/config/config';

const StickyFooter = () => {
  const { setSearchOpen } = useAppGlobal();
  const handleOnSearch = () => {
    setSearchOpen(true);
  };

  return <> </>;

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          p: 0,
          pl: 1,
          pr: 1,
          zIndex: 2,
          width: '100%',
          // maxWidth: 1600,
          alignSelf: 'center',
        }}
      >
        <Box
          sx={{
            p: 0,
            display: 'flex',
            pointerEvents: 'none',
          }}
        ></Box>
        <Paper
          sx={{
            borderEndEndRadius: 0,
            borderEndStartRadius: 0,
            boxShadow: 'none',
          }}
        >
          <Box
            sx={{
              p: 1,
              pt: 0.5,
              pb: 0.5,
              display: 'grid',
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <List
                sx={{
                  p: 0,
                  flex: 1,
                  gap: {
                    xs: 2,
                    md: 2,
                  },
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}
              >
                <ListItem
                  sx={{
                    width: 'auto',
                    p: 0,
                  }}
                >
                  <Link
                    style={{
                      display: 'flex',
                      width: 'auto',
                    }}
                    href="/"
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        '& img': {
                          height: 20,
                        },
                      }}
                    >
                      <img src={TheThingIcon} alt={`${config.APP_NAME} Logo`} />
                    </Box>
                  </Link>
                </ListItem>

                <ListItem sx={{ p: 0, width: 'auto' }}>
                  <IconButton
                    size={'small'}
                    aria-label={'search'}
                    onClick={handleOnSearch}
                    sx={{ display: { sm: 'inline-flex' } }}
                  >
                    <SearchIcon />
                  </IconButton>
                </ListItem>
              </List>
              {/* <Button
                variant={'contained'}
                onClick={() => {
                  setExpanded((prev) => !prev);
                }}
              >
                {expanded ? 'Close' : 'Open'}
              </Button> */}
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export { StickyFooter };
