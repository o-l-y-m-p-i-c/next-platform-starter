'use client';

import { Button, Typography } from '@mui/material';
import { Grid, Stack, useTheme } from '@mui/system';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import { ReactNode, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

const Warning = ({
  warning,
  onClick,
  showCloseButton = true,
}: {
  warning: {
    showIcon?: boolean;
    type: 'Info' | 'Warning' | 'Error' | 'Success';
    title: string;
    message: string | ReactNode;
  };
  onClick?: () => void;
  showCloseButton?: boolean;
}) => {
  const [checked, setChecked] = useState(true);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  const renderIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'warning':
        return <WarningAmberIcon />;
      case 'success':
        return <CheckCircleOutlineIcon />;
      case 'error':
        return <ErrorIcon />;
      case 'info':
        return <InfoIcon />;
      default:
        return;
    }
  };
  const theme = useTheme();
  return (
    checked && (
      <Grid size={12} onClick={onClick}>
        <Stack
          sx={{
            background: theme.palette[warning.type.toLowerCase()].light,
            p: 2,
            borderRadius: 1,
            gap: 1,
          }}
        >
          <Stack direction={'row'} gap={1}>
            {warning.showIcon && (
              <Typography
                color={theme.palette[warning.type.toLowerCase()].contrastText}
              >
                {renderIcon({
                  type: warning.type.toLowerCase(),
                })}
              </Typography>
            )}
            <Typography
              variant="h2"
              fontWeight={'bold'}
              color={theme.palette[warning.type.toLowerCase()].contrastText}
            >
              {warning.title}
            </Typography>
            {showCloseButton && (
              <Button
                variant={'contained'}
                sx={{
                  ml: 'auto',
                  mr: -1,
                  mt: -1,
                  mb: 1,
                  minWidth: 0,
                  minHeight: 0,
                  display: 'flex',
                  p: 0.25,
                  background: theme.palette[warning.type.toLowerCase()].light,
                  color: theme.palette[warning.type.toLowerCase()].contrastText,
                  border: '1px solid',
                }}
                onClick={handleChange}
              >
                <CloseIcon />
              </Button>
            )}
          </Stack>

          <Typography
            color={theme.palette[warning.type.toLowerCase()].contrastText}
          >
            {warning.message}
          </Typography>
        </Stack>
      </Grid>
    )
  );
};

export { Warning };
