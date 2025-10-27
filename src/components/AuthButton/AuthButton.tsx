'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect, ReactNode } from 'react';
import { useConfig } from 'wagmi';
import { signMessage } from '@wagmi/core';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { toast } from 'react-toastify';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogProps,
    DialogTitle,
    IconButton,
    MenuItem,
    Typography,
    useMediaQuery
} from '@mui/material';
import { ProfileMenuSelect } from '../ProfileMenuSelect';
import { useDisconnect } from 'wagmi';
import { useFetch } from '../../hooks/useFetch';
import type { TUser } from '@/types/responces/User';
import LoginIcon from '@mui/icons-material/Login';
import { Stack, styled, SxProps } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import { useAppGlobal } from '@/hooks';
import { useRouter } from 'next/navigation';
import { config } from '@/config/config';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2)
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1)
    }
}));
const AuthButton = ({
    showShortVariant = false,
    btnLabel = 'Connect',
    disabled = false,
    size = 'small',
    authWithRefCode = true,
    isToggleButton = false,
    sx = {},
    isOnlyDesktopVersion = false
}: {
    btnLabel?: string | ReactNode;
    disabled?: boolean;
    showShortVariant?: boolean;
    size?: 'small' | 'medium' | 'large';
    isToggleButton?: boolean;
    isOnlyDesktopVersion?: boolean;
    sx?: SxProps;
    authWithRefCode?: boolean;
}) => {
    const { disconnect } = useDisconnect();
    const { referralCode, setReferralCode } = useAppGlobal();
    const { fetchData } = useFetch();
    const isDesktop = useMediaQuery('(min-width:768px)');
    const [mounted, setMounted] = useState(false);

    const router = useRouter();

    const { user } = useAuth();

    const [open, setOpen] = useState(false);
    const [isNewUserWithRef, setNewUserWithRef] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleDialogOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    // Don't render ConnectButton until RainbowKit is mounted
    if (!mounted) {
        return (
            <Button variant="contained" size={size} disabled sx={sx}>
                {typeof btnLabel === 'string' ? btnLabel : 'Connect'}
            </Button>
        );
    }

    return (
        <>
            <ConnectButton.Custom>
                {({
                    account,
                    chain,
                    mounted,
                    authenticationStatus,
                    openChainModal,
                    openConnectModal,
                    connectModalOpen
                }) => {
                    const { setUser, isAuthenticated, isLoading, setLoading } = useAuth();
                    const config = useConfig();

                    const [openDialog, setOpenDialog] = useState(false);
                    const [fullWidth] = useState(true);
                    const [stage, setStage] = useState(-1);
                    const [maxWidth] = useState<DialogProps['maxWidth']>('xs');
                    const [modalIsOpen, setModalIsOpen] = useState(false);
                    const [clickedButton, setClickedButton] = useState(false);

                    const ready = mounted && authenticationStatus !== 'loading';
                    const connected =
                        ready &&
                        account &&
                        chain &&
                        (!authenticationStatus || authenticationStatus === 'authenticated');

                    // case when wallet connection is from modal
                    useEffect(() => {
                        if (modalIsOpen && !connectModalOpen) {
                            if (account?.address && !chain?.unsupported) {
                                setStage(0);
                                if (clickedButton) {
                                    getSessionID();
                                }
                            }
                        }

                        // case when wallet is connected from "modal chain change"
                        setModalIsOpen(connectModalOpen); // || chainModalOpen
                    }, [connectModalOpen, modalIsOpen, account, chain]); //, chainModalOpen

                    useEffect(() => {
                        if (connectModalOpen === false && stage === -1) {
                            setClickedButton(false);
                        }
                    }, [connectModalOpen, stage]);

                    useEffect(() => {
                        if (!isAuthenticated && !connected) {
                            setStage(-1);
                        }
                    }, [chain]);

                    function resetAll() {
                        setLoading(false);
                        setModalIsOpen(false);
                    }

                    const getSessionID = async () => {
                        handleClickOpen();
                        setLoading(true);
                        // init
                        setStage(1);
                        try {
                            if (!connected) {
                                throw new Error('Wallet is not connected');
                            }
                            // getting session data
                            setStage(2);
                            const { data, error } = await getMessage();
                            if (data) {
                                // when session data is available
                                setStage(3);
                                // when sending message to user
                                setStage(4);
                                const signature = await signMessage(config, {
                                    message: data.message
                                });

                                // sending signature to log in
                                setStage(6);

                                loginWallet({
                                    signature: signature,
                                    sessionId: data.sessionId,
                                    chainId: chain.id
                                });
                            } else if (error) {
                                throw new Error(error);
                            }
                        } catch (error) {
                            const typedError = error as Error;
                            toast.error(typedError?.message || 'Error starting session.');
                            resetAll();
                            setUser();
                        }
                    };

                    const getMessage = async () => {
                        try {
                            const response = await fetchData<{
                                data: { sessionId: string; message: string };
                                message: string;
                            }>('/auth/sendWalletSessionChallenge', { method: 'POST' });
                            return {
                                data: response.data?.data,
                                error: response.data?.message || null
                            };
                        } catch (error) {
                            const typedError = error as Error;
                            toast.error('Error fetching session data.');
                            resetAll();
                            setUser();
                            return { data: null, message: typedError?.message };
                        }
                    };

                    async function loginWallet({
                        sessionId,
                        signature,
                        chainId
                    }: {
                        sessionId: string;
                        signature: string;
                        chainId: number;
                    }) {
                        try {
                            if (!connected) {
                                throw new Error('Wallet is not connected');
                            }
                            const namespace = getChainNamespace(chainId || 0);

                            if (namespace === 'unknown') throw new Error('Wrong network. Use Ethereum or BNB Chain');

                            const loginData = await fetchData<{
                                data: TUser;
                            }>('/auth/walletLogin', {
                                method: 'POST',
                                body: {
                                    sessionId,
                                    signature,
                                    chainId: `${getChainNamespace(chainId || 0)}-${chainId}`,
                                    ...(authWithRefCode && referralCode && { referralCode })
                                }
                            });

                            if (loginData?.data && loginData.data?.data) {
                                // done
                                setStage(7);
                                setClickedButton(false);
                                setUser(loginData.data?.data);
                                handleClose();
                                resetAll();
                                const currentTime = new Date();
                                const createdAt = new Date(loginData.data?.data.user.createdAt);
                                const timeLimit = 30000; // 30 sec

                                if (currentTime.getTime() - createdAt.getTime() <= timeLimit) {
                                    // TODO: need to ask about logic, because after this step will be rendered dialog with some content
                                    if (referralCode) {
                                        setNewUserWithRef(true);
                                    }
                                    handleDialogOpen();
                                }

                                setReferralCode(loginData.data?.data.user.referralCode);
                            }

                            if (loginData?.error) {
                                throw loginData.error;
                            }

                            resetAll();
                        } catch (error) {
                            const typedError = error as Error;
                            toast.error(typedError?.message || 'Error when connecting the wallet');
                            console.error(error);
                            resetAll();
                            setUser();
                        }
                    }

                    function getChainNamespace(chainId: number) {
                        switch (chainId) {
                            case 1:
                            case 56:
                            case 97:
                                return 'eip155';
                            default:
                                return 'unknown';
                        }
                    }

                    function handleClickOpen() {
                        setOpenDialog(true);
                    }

                    const handleClose = () => {
                        setOpenDialog(false);
                    };

                    function getStatus(stage: number, isLoading: boolean): string {
                        if (isLoading) {
                            switch (stage) {
                                case 0:
                                    return 'Connecting to wallet...';
                                case 1:
                                    return 'Initializing connection...';
                                case 2:
                                    return 'Generating session data...';
                                case 3:
                                    return 'Saving session information...';
                                case 4:
                                    return 'Sending request to wallet. Please sign the message...';
                                case 5:
                                    return 'Signing request...';
                                case 6:
                                    return 'Processing login with wallet. Please wait...';
                                case 7:
                                    return 'Process complete';
                                default:
                                    return 'Not processed';
                            }
                        }

                        switch (stage) {
                            case 0:
                                return 'Connection lost. Please reconnect.';
                            case 1:
                                return 'Initialization failed.';
                            case 2:
                                return 'Failed to generate session data.';
                            case 3:
                                return 'Failed to save session information.';
                            case 4:
                                return 'Request sent but not approved by the wallet.';
                            case 5:
                                return 'Lost connection while obtaining signature.';
                            case 6:
                                return 'Invalid data received during login process.';
                            case 7:
                                return '';

                            default:
                                return 'Failed';
                        }
                    }

                    return (
                        <>
                            <div
                                className="ssssss"
                                {...(!ready
                                    ? {
                                          'aria-hidden': true,
                                          style: {
                                              opacity: 0,
                                              display: 'flex',
                                              flexDirection: 'column',
                                              pointerEvents: 'none',
                                              userSelect: 'none'
                                          }
                                      }
                                    : {
                                          style: {
                                              display: 'flex',
                                              flexDirection: 'column'
                                          }
                                      })}
                            >
                                {(() => {
                                    if (!connected) {
                                        return (
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                size={size}
                                                disabled={isLoading || disabled}
                                                onClick={() => {
                                                    disconnect();
                                                    openConnectModal();
                                                    setClickedButton(true);
                                                }}
                                                sx={{
                                                    minWidth: 0,
                                                    ...sx
                                                }}
                                                type="button"
                                            >
                                                {isDesktop || isOnlyDesktopVersion ? btnLabel : <LoginIcon />}
                                            </Button>
                                        );
                                    }

                                    if (chain.unsupported) {
                                        return (
                                            <Button
                                                fullWidth
                                                onClick={() => {
                                                    disconnect();
                                                    openChainModal();
                                                    setClickedButton(true);
                                                }}
                                                sx={{
                                                    minWidth: 0,
                                                    ...sx
                                                }}
                                                disabled={isLoading || disabled}
                                                size={size}
                                                variant="contained"
                                                type="button"
                                            >
                                                {isDesktop || isOnlyDesktopVersion ? btnLabel : <LoginIcon />}
                                            </Button>
                                        );
                                    }

                                    if (connected && !isAuthenticated) {
                                        return (
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                size={size}
                                                disabled={isLoading || disabled}
                                                sx={{
                                                    minWidth: 0,
                                                    ...sx
                                                }}
                                                onClick={() => {
                                                    getSessionID();
                                                    setClickedButton(true);
                                                }}
                                                type="button"
                                            >
                                                {isDesktop || isOnlyDesktopVersion ? btnLabel : <LoginIcon />}
                                            </Button>
                                        );
                                    }

                                    return (
                                        <ProfileMenuSelect
                                            isToggleButton={isToggleButton}
                                            showShortVariant={showShortVariant}
                                            listItems={[
                                                <MenuItem
                                                    key="logout"
                                                    onClick={() => {
                                                        disconnect();
                                                        setUser();
                                                        resetAll();
                                                        setClickedButton(false);
                                                        setReferralCode(null);
                                                        router.push('/');
                                                    }}
                                                >
                                                    Log out
                                                </MenuItem>
                                            ]}
                                        />
                                    );
                                })()}
                            </div>
                            <Dialog
                                fullWidth={fullWidth}
                                maxWidth={maxWidth}
                                PaperProps={{
                                    style: {
                                        background: '#1A1B1F', // Change this to your desired color
                                        boxShadow: 'none', // Optional: Adjust box shadow or other styles
                                        borderRadius: '16px',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                        padding: '10px 0'
                                    }
                                }}
                                open={openDialog}
                                onClose={() => {
                                    handleClose();
                                    resetAll();
                                    setUser();
                                }}
                            >
                                <DialogTitle
                                    sx={{
                                        textAlign: 'center',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Authorization status
                                </DialogTitle>
                                <DialogContent
                                    sx={
                                        {
                                            // pb: 0,
                                        }
                                    }
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            m: 'auto',
                                            width: 'fit-content',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            gap: 4,
                                            pt: 4,
                                            pb: 4
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                '&:empty': {
                                                    display: 'none'
                                                },
                                                textAlign: 'center'
                                            }}
                                        >
                                            {getStatus(stage, isLoading)}
                                        </Box>
                                        <Box
                                            sx={{
                                                '&:empty': {
                                                    display: 'none'
                                                }
                                            }}
                                        >
                                            {isLoading && <CircularProgress />}
                                        </Box>
                                    </Box>
                                </DialogContent>
                                <DialogActions
                                    sx={{
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Button
                                        variant={'contained'}
                                        sx={{
                                            minWidth: 200
                                        }}
                                        onClick={() => {
                                            handleClose();
                                            resetAll();
                                            setUser();
                                            setClickedButton(false);
                                            disconnect();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </>
                    );
                }}
            </ConnectButton.Custom>
            <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                {!isNewUserWithRef ? (
                    <>
                        <DialogTitle sx={{ m: 0, p: 2, pr: 8 }} id="customized-dialog-title">
                            Welcome to “{config.APP_NAME}!”
                        </DialogTitle>
                        <IconButton
                            aria-label="close"
                            onClick={handleClose}
                            sx={() => ({
                                position: 'absolute',
                                right: 8,
                                top: 12
                                // color: theme.palette.grey[500],
                            })}
                        >
                            <CloseIcon />
                        </IconButton>
                        <DialogContent dividers>
                            <Stack justifyContent={'center'} alignItems={'center'} spacing={2}>
                                <Typography variant="h5">
                                    Your account was successfully created, and your waitlist position is #
                                    {user?.user?.whiteListNumber}
                                </Typography>
                                <Typography>You signed up without a referral link.</Typography>

                                <Button variant={'outlined'} onClick={handleClose}>
                                    Explore {config.APP_NAME}
                                </Button>
                            </Stack>
                        </DialogContent>
                    </>
                ) : (
                    <>
                        <DialogTitle sx={{ m: 0, p: 2, pr: 8 }} id="customized-dialog-title">
                            Welcome to {config.APP_NAME}!”
                        </DialogTitle>
                        <IconButton
                            aria-label="close"
                            onClick={handleClose}
                            sx={() => ({
                                position: 'absolute',
                                right: 8,
                                top: 12
                                // color: theme.palette.grey[500],
                            })}
                        >
                            <CloseIcon />
                        </IconButton>
                        <DialogContent dividers>
                            <Stack justifyContent={'center'} alignItems={'center'} spacing={2}>
                                <Typography variant="h5">
                                    Thanks for signing up using an exclusive referral link!
                                </Typography>
                                <Typography>
                                    Your account was successfully created, and your waitlist position is #
                                    {user?.user?.whiteListNumber}
                                </Typography>
                                <Typography>You just received a bonus! </Typography>
                                <Typography>Get private access to our Telegram AI-Bot!</Typography>
                                <Stack width={'100%'} gap={1} justifyContent={'center'} direction={'row'}>
                                    <Button
                                        href={`https://t.me/thing_fun_bot?start=${referralCode}`}
                                        variant={'contained'}
                                        target={'_blank'}
                                    >
                                        Try Telegram Bot
                                    </Button>
                                    {/* <Typography>Your referral link:</Typography>
                  <OutlinedInput
                    fullWidth
                    disabled
                    value={
                      'https://' +
                      window.location.hostname +
                      '?referral=' +
                      referralCode
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <ShareButton
                          btnTitle={<ContentCopyIcon fontSize="small" />}
                          disabled={!referralCode}
                          // title="Referral"
                          text="Find the next big token with ${config.APP_NAME}! Here’s my referral link:"
                          url={
                            'https://' +
                            window.location.hostname +
                            '?referral=' +
                            referralCode
                          }
                        />
                        {/* <IconButton
                          onClick={() =>
                            handleClickCopy(
                              'https://' +
                                window.location.hostname +
                                '?referral=' +
                                referralCode,
                            )
                          }
                          edge="end"
                        >
                          <ContentCopyIcon />
                        </IconButton> 
                      </InputAdornment>
                    }
                  /> */}
                                </Stack>
                                <Button variant={'outlined'} onClick={handleClose}>
                                    Explore {config.APP_NAME}
                                </Button>
                            </Stack>
                        </DialogContent>
                    </>
                )}

                {/* <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Save changes
          </Button>
        </DialogActions> */}
            </BootstrapDialog>
        </>
    );
};

export { AuthButton };
