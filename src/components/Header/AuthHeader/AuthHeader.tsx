import Link from 'next/link';
import {
  AppBar,
  Box,
  Toolbar,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import * as styled from '../Header.styled';
import { Sidebar } from '../components/Sidebar';
import { AuthButton } from '../../AuthButton';
import { useAppGlobal } from '@/hooks';
import { useRef } from 'react';
import Lottie from 'lottie-react';
import eyeLottoe from '../../../assets/Lotties/eyes_horizontal.json';

export const AuthHeader = () => {
  const { isMenuOpen, setMenuOpen } = useAppGlobal();
  const header = useRef(null);
  const theme = useTheme();

  const isTablet = useMediaQuery('(min-width:600px)');

  return (
    <>
      <Toolbar />
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
          }}
          ref={header}
        >
          <styled.Brand>
            <Link style={{ display: 'flex' }} href="/">
              <Box
                sx={{
                  display: 'flex',
                  gap: { xs: 2, sm: 2 },
                  height: 40,
                  width: 160,
                }}
              >
                <Lottie animationData={eyeLottoe} loop={true} />
              </Box>
            </Link>
          </styled.Brand>

          <Stack direction="row" alignItems="center" gap={1}>
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              gap={isTablet ? 1 : 0.5}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: isTablet ? 1 : 0.5,
                }}
              >
                <AuthButton
                  isOnlyDesktopVersion={true}
                  sx={{ borderRadius: 100 }}
                />
              </Box>
            </Stack>
          </Stack>
        </Toolbar>

        {header.current && (
          <Sidebar
            open={isMenuOpen}
            setOpen={setMenuOpen}
            header={header.current}
          />
        )}
      </AppBar>
    </>
  );
};
