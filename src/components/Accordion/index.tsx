import {
  Card,
  CardContent,
  Collapse,
  IconButton,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import { ReactNode, useState } from 'react';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';

export const Accordion = ({
  title,
  content,
  isCustomContent = false,
}: {
  title: string;
  content: ReactNode;
  isCustomContent?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    return setOpen(!open);
  };
  return (
    <Card variant={'outlined'}>
      <Stack
        direction={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Typography
          sx={{
            cursor: 'pointer',
            fontWeight: 700,
          }}
          p={2}
          onClick={handleClick}
        >
          {title}
        </Typography>
        <IconButton
          sx={{
            mr: 1,
          }}
          onClick={handleClick}
        >
          {!open ? <AddOutlinedIcon /> : <RemoveOutlinedIcon />}
        </IconButton>
      </Stack>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <CardContent
          sx={{
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          {isCustomContent ? content : <Typography>{content}</Typography>}
        </CardContent>
      </Collapse>
    </Card>
  );
};
