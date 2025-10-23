import { toast } from 'react-toastify';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  EmailShareButton,
  FacebookShareButton,
  HatenaShareButton,
  LineShareButton,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  ViberShareButton,
  VKShareButton,
  WhatsappShareButton,
  WorkplaceShareButton,
} from 'react-share';
import {
  EmailIcon,
  FacebookIcon,
  HatenaIcon,
  LineIcon,
  LivejournalIcon,
  MailruIcon,
  OKIcon,
  PocketIcon,
  RedditIcon,
  TelegramIcon,
  ViberIcon,
  VKIcon,
  WhatsappIcon,
  WorkplaceIcon,
  XIcon,
} from 'react-share';
import { ReactNode, useState } from 'react';
import { Stack, styled } from '@mui/system';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundImage: 'none',
    background: theme.palette.background.paper,
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const ShareButton = ({
  btnTitle = 'Share',
  disabled = false,
  url,
  variant = 'outlined',
  // title = 'Check this out!',
  text = 'I found something interesting:',
}: {
  btnTitle?: ReactNode;
  disabled?: boolean;
  url: string;
  variant?: 'outlined' | 'contained';
  // title?: string;
  text?: string;
}) => {
  const shareLink = async () => {
    try {
      const copyText = text + '\n\n' + url;

      await navigator.clipboard.writeText(copyText);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Error copying the link.');
      console.error('Error copying the link:', error);
    }
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button onClick={handleOpen} variant={variant}>
        Share
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        maxWidth={'xs'}
        aria-labelledby="get-premuim-title"
        open={open}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, pr: 8 }}
          fontWeight={'bold'}
          id="get-premuim-title"
        >
          Choose share method
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          sx={{
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Stack
            direction={'row'}
            gap={2}
            flexWrap={'wrap'}
            justifyContent={'center'}
          >
            <Button
              sx={{
                minWidth: 0,
                p: 1.5,
                borderRadius: 100,
              }}
              disabled={disabled}
              variant={'outlined'}
              onClick={shareLink}
            >
              {btnTitle}
            </Button>
            <EmailShareButton title={text} url={url}>
              <Stack>
                <EmailIcon size={46} borderRadius={100} />
              </Stack>
            </EmailShareButton>
            <TwitterShareButton title={`${text}\n\n`} url={url}>
              <Stack>
                <XIcon size={46} borderRadius={100} />
              </Stack>
            </TwitterShareButton>
            <TelegramShareButton title={text} url={url}>
              <Stack>
                <TelegramIcon size={46} borderRadius={100} />
              </Stack>
            </TelegramShareButton>
            <FacebookShareButton hashtag={url} url={url}>
              <Stack>
                <FacebookIcon size={46} borderRadius={100} />
              </Stack>
            </FacebookShareButton>
            <VKShareButton title={text} url={url}>
              <Stack>
                <VKIcon size={46} borderRadius={100} />
              </Stack>
            </VKShareButton>
            {/* <LinkedinShareButton
              title={url}
              summary={text}
              source={url}
              url={url}
            >
              <Stack>
                <LinkedinIcon size={46} borderRadius={100} />
              </Stack>
            </LinkedinShareButton> */}
            {/* <InstapaperShareButton title={text} url={url}>
              <Stack>
                <InstapaperIcon size={46} borderRadius={100} />
              </Stack>
            </InstapaperShareButton> */}
            {/* <TumblrShareButton title={text} url={url}>
              <Stack>
                <TumblrIcon size={46} borderRadius={100} />
              </Stack>
            </TumblrShareButton> */}
            <ViberShareButton title={`${text}\n\n`} url={url}>
              <Stack>
                <ViberIcon size={46} borderRadius={100} />
              </Stack>
            </ViberShareButton>
            <WhatsappShareButton title={`${text}\n\n`} url={url}>
              <Stack>
                <WhatsappIcon size={46} borderRadius={100} />
              </Stack>
            </WhatsappShareButton>
            {/* <GabShareButton title={text} url={url}>
              <Stack>
                <GabIcon size={46} borderRadius={100} />
              </Stack>
            </GabShareButton> */}
            <HatenaShareButton title={text} url={url}>
              <Stack>
                <HatenaIcon size={46} borderRadius={100} />
              </Stack>
            </HatenaShareButton>
            <LineShareButton title={text} url={url}>
              <Stack>
                <LineIcon size={46} borderRadius={100} />
              </Stack>
            </LineShareButton>
            <LivejournalShareButton title={url} description={text} url={url}>
              <Stack>
                <LivejournalIcon size={46} borderRadius={100} />
              </Stack>
            </LivejournalShareButton>
            <MailruShareButton title={text} url={url}>
              <Stack>
                <MailruIcon size={46} borderRadius={100} />
              </Stack>
            </MailruShareButton>
            <OKShareButton title={url} description={text} url={url}>
              <Stack>
                <OKIcon size={46} borderRadius={100} />
              </Stack>
            </OKShareButton>
            <PocketShareButton title={text} url={url}>
              <Stack>
                <PocketIcon size={46} borderRadius={100} />
              </Stack>
            </PocketShareButton>
            <RedditShareButton title={text} url={url}>
              <Stack>
                <RedditIcon size={46} borderRadius={100} />
              </Stack>
            </RedditShareButton>
            <WorkplaceShareButton hashtag={`${text}\n\n${url}`} url={url}>
              <Stack>
                <WorkplaceIcon size={46} borderRadius={100} />
              </Stack>
            </WorkplaceShareButton>
          </Stack>
        </DialogContent>
      </BootstrapDialog>
      {/* <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal> */}
    </>
  );
};

export { ShareButton };
