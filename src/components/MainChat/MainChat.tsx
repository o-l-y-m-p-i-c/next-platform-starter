import { IconButton, Typography } from '@mui/material';
import { DrawerComponent } from '../DrawerComponent';
import { Stack, useMediaQuery } from '@mui/system';
import { useState } from 'react';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import Chat from '../../modules/chat/components/ChatList';

export const MainChat = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const isTablet = useMediaQuery('(min-width:600px)');

  return (
    <>
      <IconButton title={'Live chat'} size="medium" onClick={handleOpen}>
        <QuestionAnswerIcon fontSize={isTablet ? 'medium' : 'small'} />
      </IconButton>
      <DrawerComponent
        drawerProps={{
          open,
        }}
        headerComponent={
          <Stack direction={'row'} gap={1}>
            <QuestionAnswerIcon />
            <Typography
              variant="h2"
              fontWeight={'bold'}
              whiteSpace={'nowrap'}
              overflow={'hidden'}
              textOverflow={'ellipsis'}
            >
              Chat
            </Typography>
          </Stack>
        }
        handleClose={handleClose}
      >
        <Stack
          sx={{
            p: 2,
            flex: 1,
          }}
        >
          <Chat />
        </Stack>
      </DrawerComponent>
    </>
  );
};
