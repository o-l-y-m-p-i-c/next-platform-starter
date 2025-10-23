import { IconButton, List, ListItem, Paper } from '@mui/material';
import { Box } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import { useAppGlobal } from '@/hooks';
import { mobileMenuTopList } from '../../../constants/routes.constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MobileFixedFooter = () => {
  const { setSearchOpen } = useAppGlobal();
  const pathname = usePathname();
  
  const handleOnSearch = () => {
    setSearchOpen(true);
  };

  const activeColor = 'var(--IconButton-hoverBg)';
  const defaultColor = 'transparent';

  const leftSideMenu = mobileMenuTopList.filter(
    (item) => item.content === 'Home' || item.content === 'Hype Detector',
  );
  const rightSideMenu = mobileMenuTopList.filter(
    (item) => item.content === 'Profile' || item.content === 'Recently Bonded',
  );

  return;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        left: 0,
        zIndex: 2,
      }}
    >
      <Paper
        sx={{
          p: 0,
          borderEndStartRadius: 0,
          borderEndEndRadius: 0,
          boxShadow: '0px -1px 5px rgba(0,0,0,0.2)',
        }}
      >
        <Box
          sx={{
            p: 0.5,
            // pb: 1,
            // pt: 1,
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box>
            <List
              sx={{
                p: 0,
                pl: 1,
                pr: 1,
                display: 'flex',
                justifyContent: 'space-evenly',
              }}
            >
              {leftSideMenu.map((menu_item) => (
                <ListItem
                  key={menu_item.key}
                  sx={{
                    p: 0,
                    width: 'auto',
                  }}
                >
                  <Link href={menu_item.props.href}>
                    <IconButton
                      sx={{
                        ...(menu_item.props.href && {
                          background:
                            pathname === menu_item.props.href
                              ? activeColor
                              : defaultColor,
                        }),
                      }}
                    >
                      {menu_item.icon}
                    </IconButton>
                  </Link>
                </ListItem>
              ))}
            </List>
          </Box>
          <Box>
            <Paper
              sx={{
                mt: -3,
                borderRadius: '100%',
              }}
            >
              <IconButton
                size={'small'}
                aria-label={'search'}
                onClick={handleOnSearch}
                sx={{ p: 2 }}
                // sx={{ display: { sm: 'inline-flex' }, mt: -6 }}
              >
                <SearchIcon />
              </IconButton>
            </Paper>
          </Box>
          <Box>
            <List
              sx={{
                p: 0,
                pl: 1,
                pr: 1,
                display: 'flex',
                justifyContent: 'space-evenly',
              }}
            >
              {rightSideMenu.map((menu_item) => (
                <ListItem
                  sx={{
                    p: 0,
                    width: 'auto',
                  }}
                >
                  <Link href={menu_item.props.href}>
                    <IconButton
                      sx={{
                        ...(menu_item.props.href && {
                          background:
                            pathname === menu_item.props.href
                              ? activeColor
                              : defaultColor,
                        }),
                      }}
                    >
                      {menu_item.icon}
                    </IconButton>
                  </Link>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export { MobileFixedFooter };
