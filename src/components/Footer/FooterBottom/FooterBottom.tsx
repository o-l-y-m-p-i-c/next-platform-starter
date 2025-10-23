import { Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Socials } from '../../Socials';

const FooterBottom = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      sx={{
        mb: {
          // xs: 7,
          // md: 0,
        },
        width: '100%',
        alignSelf: 'center',
      }}
    >
      <Paper>
        <Box
          sx={{
            p: 2,
            gap: 1,
            columnGap: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: {
              xs: 'center',
              md: 'flex-start',
            },

            // 'space-between',
            flexWrap: 'wrap',
            // flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              flex: 1,
              minWidth: '50%',
              justifyContent: {
                xs: 'center',
                md: 'flex-start',
              },
            }}
          >
            <Typography>
              © {currentYear} Trench Spy. All rights reserved.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                minWidth: {
                  xs: '100%',
                  md: 0,
                },
                justifyContent: {
                  xs: 'center',
                  md: 'flex-start',
                },
              }}
            ></Box>
          </Box>
          <Box>
            <Socials />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export { FooterBottom };
