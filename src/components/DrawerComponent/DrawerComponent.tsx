import {
  Dialog,
  DialogContent,
  DialogProps,
  Drawer,
  DrawerProps,
  IconButton,
} from '@mui/material';
import { Box, Stack, useTheme } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import { ReactNode } from 'react';

export const DrawerComponent = ({
  children,
  headerComponent,
  drawerProps,
  handleClose,
}: {
  drawerProps: DrawerProps & { maxWidth?: 'xs' | 'sm' | 'md' | 'lg' };
  headerComponent?: ReactNode;
  children?: ReactNode;
  handleClose: () => void;
}) => {
  const theme = useTheme();

  const maxWidth: DialogProps['maxWidth'] = drawerProps.maxWidth ?? 'sm';

  return (
    <Dialog
      fullWidth
      maxWidth={maxWidth}
      open={true}
      onClose={handleClose}
      {...drawerProps}
    >
      <Box>
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          gap={1}
          alignItems={'flex-start'}
        >
          {headerComponent && (
            <Stack
              sx={{
                p: 3,
                pb: 0,
              }}
            >
              {headerComponent}
            </Stack>
          )}
          <IconButton
            aria-label="Close"
            onClick={handleClose}
            size="small"
            sx={{
              ml: 'auto',
              // position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon fontSize={'large'} />
          </IconButton>
        </Stack>

        <DialogContent>{children}</DialogContent>
      </Box>
    </Dialog>
  );

  return (
    <Drawer
      sx={{
        zIndex: 1201,
      }}
      // anchor="right"
      {...drawerProps}
      onClose={handleClose}
    >
      <Stack
        flex={1}
        sx={{
          maxWidth: '100%',
          width: {
            xs: '100vw',
            sm: 500,
          },
        }}
      >
        {headerComponent && (
          <Box
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 3,
              background: theme.palette.background.paper,
            }}
          >
            <Stack
              sx={{
                position: 'relative',
                p: 3,
                pr: 7,
              }}
            >
              {headerComponent}
              <IconButton
                aria-label="Close"
                onClick={handleClose}
                size="small"
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                }}
              >
                <CloseIcon fontSize={'large'} />
              </IconButton>
            </Stack>
          </Box>
        )}
        {children}
      </Stack>
    </Drawer>
  );
};
