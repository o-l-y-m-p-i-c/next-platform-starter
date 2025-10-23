'use client';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Stack, styled } from '@mui/system';
import { Checkbox, Typography } from '@mui/material';
import { useAppGlobal } from '@/hooks';
import { useState } from 'react';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
export const LegalDisclaimer = () => {
  const { showLegalDisclaimer, setShowLegalDisclaimer } = useAppGlobal();

  const closeModal = () => {
    setShowLegalDisclaimer(true);
  };

  const [checked, setChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <>
      <BootstrapDialog
        disableEscapeKeyDown
        aria-labelledby="customized-dialog-title"
        open={showLegalDisclaimer}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Legal Disclaimer
        </DialogTitle>
        {/* <IconButton
          aria-label="close"
          onClick={closeModal}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton> */}
        <DialogContent dividers>
          <Stack direction={'row'} spacing={1} alignItems={'flex-start'}>
            <Checkbox
              size={'medium'}
              checked={checked}
              onChange={handleChange}
              {...label}
            />
            <Typography gutterBottom>
              You agree and understand that all investment, staking and trading
              decisions are made solely by you. You agree and understand that
              under no circumstances will your use of the Platform be deemed to
              create a relationship that includes the provision of or tendering
              of investment advice.{' '}
              <b>
                NO FINANCIAL, INVESTMENT, TAX, LEGAL OR SECURITIES ADVICE IS
                GIVEN THROUGH OR IN CONNECTION WITH THE PLATFORM
              </b>
              . No content found on the Platform, whether created by us, a third
              party, or another user is or should be considered as investment
              advice. You agree and understand that we accept no responsibility
              whatsoever for, and shall in no circumstances be liable in
              connection with, your decisions or your use of the Platform.
              Nothing contained on the Platform constitutes a solicitation,
              recommendation, endorsement, or offer by us or any third party to
              transact in any digital assets, securities, or other financial
              instruments. Neither us nor any of our affiliates has endorsed or
              sponsored any digital assets that can be transacted through the
              Platform.
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant={'contained'}
            autoFocus
            disabled={!checked}
            onClick={closeModal}
          >
            Agree and Continue
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
};
