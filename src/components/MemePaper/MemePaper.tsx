import { Box, Divider, Paper, Stack, Typography } from '@mui/material';
import React, { ReactNode } from 'react';

const MemePaper = ({
  children,
  title = '',
  helpText = '',
  topBarIcons,
  headerComponent,
}: {
  headerComponent?: ReactNode;
  children?: ReactNode;
  title?: string | ReactNode;
  topBarIcons?: ReactNode;
  p?: number;
  helpText?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <Paper
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Stack
        sx={{
          flex: 1,
          p: 2,
        }}
        gap={2}
      >
        {(title || helpText || topBarIcons || headerComponent) && (
          <>
            <Stack direction={'row'} gap={1}>
              {(title || helpText || topBarIcons) && (
                <>
                  <Stack direction={'row'} alignItems={'center'} gap={0.5}>
                    {title && (
                      <Typography
                        whiteSpace={'nowrap'}
                        variant="h2"
                        fontWeight={'bold'}
                        align="left"
                      >
                        {title}
                      </Typography>
                    )}
                    <Stack direction={'row'} gap={1} mt={-1}>
                      {topBarIcons}
                    </Stack>
                  </Stack>
                </>
              )}
              {headerComponent}
            </Stack>
            <Divider />
          </>
        )}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
        </Box>
      </Stack>
    </Paper>
  );
};

export { MemePaper };
