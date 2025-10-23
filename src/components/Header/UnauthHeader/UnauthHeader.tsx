import { Box, useMediaQuery } from '@mui/system';
import * as styled from '../Header.styled';
import Link from 'next/link';
import TheThinDesktopLogo from '../../../assets/LogoTest.svg';
import TheThinMobileLogo from '../../../assets/LogoTest.svg';
import { config } from '@/config/config';

export const UnauthHeader = () => {
  const isTablet = useMediaQuery('(min-width:600px)');

  return (
    <>
      <styled.Toolbar>
        <styled.Brand>
          <Box
            sx={{
              display: 'flex',
              gap: { xs: 2, sm: 2 },
            }}
          >
            <Link style={{ display: 'flex' }} href="/">
              <Box
                sx={{
                  display: 'flex',
                  '& img': { maxWidth: '100%', height: 37 },
                }}
              >
                <img
                  src={isTablet ? TheThinDesktopLogo : TheThinMobileLogo}
                  style={{
                    objectFit: 'contain',
                  }}
                  alt={`${config.APP_NAME} Logo`}
                />
              </Box>
            </Link>
          </Box>
        </styled.Brand>
      </styled.Toolbar>
    </>
  );
};
