import { Box, Grid, IconButton, List, ListItem, TextField, Typography } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { useAccount } from 'wagmi';
import { Stack } from '@mui/system';
import { useQuery } from '@tanstack/react-query';
import { useAppGlobal, useFetch } from '@/hooks';
import Link from 'next/link';
import { UserData } from '@/layouts/Layout/Layout';
import EditIcon from '@mui/icons-material/Edit';
import { AuthButton } from '@/components/AuthButton';
import logo from '@/assets/LogoTest.svg';
import { TelegramIcon } from '@/assets/socials/TelegramIcon';
import { MyWatchlist } from '@/components/MyWatchlist';
import TokenIcon from '@mui/icons-material/Token';

import Groups2Icon from '@mui/icons-material/Groups2';
import PersonIcon from '@mui/icons-material/Person';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SpeedIcon from '@mui/icons-material/Speed';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import InsightsIcon from '@mui/icons-material/Insights';
import { Card } from '@/components/Card';
import { config } from '@/config/config';

const Profile = () => {
    const { user } = useAuth();
    const { isConnected } = useAccount();
    const { referralCode, setReferralCode } = useAppGlobal();
    const { fetchData } = useFetch();

    const cardColor = '#1f222c';

    const { data: userData } = useQuery<UserData>({
        queryKey: ['/users/me'],
        queryFn: async () => {
            const { data, error } = await fetchData<UserData>('/users/me');
            if (error) throw error;
            return data as UserData;
        },
        enabled: !!user && isConnected
    });

    return (
        <Box
            className="sss"
            sx={{
                pb: 2,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Stack maxWidth={700} width={'100%'} m={'auto'}>
                {user && isConnected && (
                    <>
                        <Stack sx={{ textAlign: 'center', gap: 2 }} alignItems={'center'} p={1}>
                            <Stack direction={'row'} alignItems={'center'} gap={2}>
                                <Stack gap={1} alignItems={'center'}>
                                    <Typography variant="h6">Username</Typography>

                                    <Stack direction={'row'}>
                                        <Typography>
                                            {userData?.data.username ?? "You haven't set a username yet"}
                                        </Typography>
                                        <Link href={'/profile/edit'}>
                                            <Box
                                                sx={{
                                                    mt: -1,
                                                    svg: {
                                                        width: 15,
                                                        height: 15
                                                    }
                                                }}
                                            >
                                                <IconButton size="small">
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Link>
                                    </Stack>
                                </Stack>
                            </Stack>
                            <Stack
                                gap={1}
                                // alignItems={'flex-start'}
                                overflow={'hidden'}
                            >
                                <Typography variant="h6">Connected wallets</Typography>

                                {user.user.blockchains.length > 0 ? (
                                    user.user.blockchains.map((blokchain: { address: string; network: string }) => (
                                        <Grid size={12} overflow={'hidden'} key={blokchain.address}>
                                            <Stack direction={'row'} alignItems={'center'} gap={1} overflow={'hidden'}>
                                                <Typography
                                                    variant="body2"
                                                    overflow={'hidden'}
                                                    sx={{
                                                        textOverflow: 'ellipsis'
                                                    }}
                                                >
                                                    {blokchain.address}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                    ))
                                ) : (
                                    <Typography>No blockchains</Typography>
                                )}
                            </Stack>
                        </Stack>
                    </>
                )}
                {(!isConnected || !user) && (
                    <Stack
                        flex={1}
                        gap={3}
                        justifyContent={'center'}
                        maxWidth={1200}
                        sx={{
                            alignSelf: {
                                sm: 'center'
                            },
                            p: {
                                xs: 1,
                                sm: 4
                            }
                        }}
                    >
                        <Stack direction={'row'} justifyContent={'center'}>
                            <Stack direction={'row'} justifyContent={'center'}>
                                <img
                                    style={{
                                        maxWidth: '90%'
                                    }}
                                    src={logo}
                                />
                            </Stack>
                        </Stack>
                        <Typography color={'primary'} variant="h3">
                            Welcome to{' '}
                            <span
                                style={{
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {config.APP_NAME}!
                            </span>{' '}
                        </Typography>

                        <Stack alignItems={'center'} gap={2}>
                            <Typography color={'primary'} variant={'h5'}>
                                Your Referral Code
                            </Typography>
                            <TextField
                                sx={{
                                    input: {
                                        textAlign: 'center',
                                        minWidth: 200
                                    }
                                }}
                                id="Referral-Code"
                                placeholder="Referral code is missing"
                                defaultValue={referralCode}
                                onChange={(e) => {
                                    const valueLength = e.target.value.length;
                                    if (valueLength > 8 && valueLength < 12) {
                                        setReferralCode(e.target.value);
                                    } else {
                                        setReferralCode(null);
                                    }
                                }}
                                variant={'standard'}
                                size={'small'}
                            />

                            {/* {JSON.stringify(referralCode)} */}
                            <Stack mt={1}>
                                <Typography color={'primary'} variant={'h6'}>
                                    The referral code gives you:
                                </Typography>
                                <List
                                    sx={{
                                        li: {
                                            display: 'list-item',
                                            listStyle: 'inside',
                                            listStyleType: 'disc',
                                            p: 0
                                        }
                                    }}
                                >
                                    <ListItem>Early access to beta features;</ListItem>
                                    <ListItem>Personal Watchlist;</ListItem>
                                    <ListItem>Early Access to Telegram Bot;</ListItem>
                                    <ListItem>Skip Waitlist at launch;</ListItem>
                                    <ListItem>Limited free access to paid features.</ListItem>
                                </List>
                            </Stack>

                            <Typography>Please connect your wallet to register:</Typography>
                        </Stack>
                        <Stack direction={'row'} justifyContent={'center'}>
                            <AuthButton
                                size={'large'}
                                // commented because if user was connected before, he can't connect again - he hasn't referral code
                                // disabled={!referralCode}
                                isOnlyDesktopVersion={true}
                                btnLabel={'Connect Wallet'}
                            />
                        </Stack>
                        <Typography variant="caption">
                            Act fast! This referral code can only be used by the first 1000 people.
                        </Typography>

                        <Typography mt={4} color={'primary'} variant={'h3'}>
                            Join the biggest AI analysis platform in the world
                        </Typography>

                        <Grid mt={2} container spacing={2} justifyContent={'center'}>
                            <Grid
                                size={{
                                    md: 4
                                }}
                            >
                                <Stack direction={'row'} height={'100%'}>
                                    <Card
                                        {...{
                                            headerProps: {
                                                ml: {
                                                    xs: -7
                                                },
                                                pl: 7,
                                                pr: 7
                                            },
                                            paperProps: {
                                                background: cardColor,
                                                flex: 1,
                                                minWidth: '100%',
                                                maxWidth: '100%'
                                            },
                                            counterfixedAfterCount: 2,
                                            counter: 3860000,

                                            icon: <TokenIcon fontSize={'large'} />,
                                            description: (
                                                <Stack>
                                                    <Typography variant={'h5'} fontWeight={'bold'}>
                                                        Solana Tokens Tracked
                                                    </Typography>
                                                    <Typography mt={2}>
                                                        Every token is tracked from its minting moment, detecting
                                                        on-chain and social anomalies—rapid spikes in trades and
                                                        mentions across social media.
                                                    </Typography>
                                                </Stack>
                                            )
                                            // ',
                                        }}
                                    />
                                </Stack>
                            </Grid>
                            <Grid
                                size={{
                                    md: 4
                                }}
                            >
                                <Stack direction={'row'} height={'100%'}>
                                    <Card
                                        {...{
                                            headerProps: {
                                                ml: {
                                                    xs: -7
                                                },
                                                pl: 7,
                                                pr: 7
                                            },
                                            paperProps: {
                                                background: cardColor,
                                                flex: 1,
                                                minWidth: '100%',
                                                maxWidth: '100%'
                                            },
                                            counter: 2760000,
                                            counterfixedAfterCount: 2,
                                            description: (
                                                <Stack>
                                                    <Typography variant={'h5'} fontWeight={'bold'}>
                                                        Buy/Sell Calls with PNL
                                                    </Typography>
                                                    <Typography mt={2}>
                                                        We detect which coins are mentioned and what is being said about
                                                        them. We also determine where the token price goes right after
                                                        the call.
                                                    </Typography>
                                                </Stack>
                                            ),
                                            icon: <Groups2Icon fontSize={'large'} />
                                        }}
                                    />
                                </Stack>
                            </Grid>
                            <Grid
                                size={{
                                    md: 4
                                }}
                            >
                                <Stack direction={'row'} height={'100%'}>
                                    <Card
                                        {...{
                                            headerProps: {
                                                ml: {
                                                    xs: -7
                                                },
                                                pl: 7,
                                                pr: 7
                                            },
                                            paperProps: {
                                                background: cardColor,
                                                flex: 1,
                                                minWidth: '100%',
                                                maxWidth: '100%'
                                            },
                                            counter: 538000,
                                            description: (
                                                <Stack>
                                                    <Typography variant={'h5'} fontWeight={'bold'}>
                                                        Influencers Captured
                                                    </Typography>
                                                    <Typography mt={2}>
                                                        Every author is an account on X, Telegram, Discord, Reddit, etc.
                                                        Each public call is analyzed, and each influencer is ranked by
                                                        their PNL since the call.
                                                    </Typography>
                                                </Stack>
                                            ),
                                            icon: <PersonIcon fontSize={'large'} />
                                        }}
                                    />
                                </Stack>
                            </Grid>
                            <Grid
                                size={{
                                    md: 4
                                }}
                            >
                                <Stack direction={'row'} height={'100%'}>
                                    <Card
                                        {...{
                                            headerProps: {
                                                ml: {
                                                    xs: -7
                                                },
                                                pl: 7,
                                                pr: 7
                                            },
                                            paperProps: {
                                                background: cardColor,
                                                flex: 1,
                                                minWidth: '100%',
                                                maxWidth: '100%'
                                            },
                                            counterfixedAfterCount: 0,
                                            isFormated: false,
                                            counter: 3248,
                                            description: (
                                                <Stack>
                                                    <Typography variant={'h5'} fontWeight={'bold'}>
                                                        Top KOLs Live
                                                    </Typography>
                                                    <Typography mt={2}>
                                                        We track the top-performing KOLs even more closely. Everything
                                                        they say is reflected immediately. When these KOLs engage, they
                                                        can boost a token’s price very quickly.
                                                    </Typography>
                                                </Stack>
                                            ),
                                            icon: <TrendingUpIcon fontSize={'large'} />
                                        }}
                                    />
                                </Stack>
                            </Grid>
                            <Grid
                                size={{
                                    md: 4
                                }}
                            >
                                <Stack direction={'row'} height={'100%'}>
                                    <Card
                                        {...{
                                            headerProps: {
                                                ml: {
                                                    xs: -7
                                                },
                                                pl: 7,
                                                pr: 7
                                            },
                                            paperProps: {
                                                background: cardColor,
                                                flex: 1,
                                                minWidth: '100%',
                                                maxWidth: '100%'
                                            },
                                            title: '<350ms',

                                            description: (
                                                <Stack>
                                                    <Typography variant={'h5'} fontWeight={'bold'}>
                                                        Analysis and Reaction Time
                                                    </Typography>
                                                    <Typography mt={2}>
                                                        Every public call is analyzed by AI in a split second, ensuring
                                                        quick response. When a coin starts gaining traction, we see it
                                                        first.
                                                    </Typography>
                                                </Stack>
                                            ),
                                            icon: <SpeedIcon fontSize={'large'} />
                                        }}
                                    />
                                </Stack>
                            </Grid>
                        </Grid>
                        <Typography mt={4} color={'primary'} variant={'h3'}>
                            What else is coming:
                        </Typography>

                        <Stack mt={2} direction={'row'} gap={2} justifyContent={'center'} flexWrap={'wrap'}>
                            <Card
                                {...{
                                    paperProps: {
                                        background: cardColor,
                                        textAlign: 'left'
                                    },
                                    title: 'EVM Networks Support',
                                    description: 'Including Base, ETH, BNB and many other networks',
                                    icon: <RocketLaunchIcon />
                                }}
                            />
                            <Card
                                {...{
                                    paperProps: {
                                        background: cardColor,
                                        textAlign: 'left'
                                    },
                                    title: 'AI Calls Summary',
                                    description:
                                        'Track who calls the coin, previous gains/losses, and performance history',
                                    icon: <FaceRetouchingNaturalIcon />
                                }}
                            />
                            <Card
                                {...{
                                    paperProps: {
                                        background: cardColor,
                                        textAlign: 'left'
                                    },
                                    title: 'AI Risk Analysis',
                                    description: 'Smart analysis based on sentiment changes and community feedback',
                                    icon: <InsightsIcon />
                                }}
                            />
                            <Card
                                {...{
                                    paperProps: {
                                        background: cardColor,
                                        textAlign: 'left'
                                    },
                                    title: 'Virtuals Protocol Support',
                                    description: 'Live integration with Virtuals Protocol',
                                    icon: <TelegramIcon />
                                }}
                            />
                        </Stack>
                    </Stack>
                )}
                {user && isConnected && (
                    <Stack textAlign={'center'} mt={2}>
                        <Typography variant={'h2'}>Favorites</Typography>
                        <MyWatchlist />
                    </Stack>
                )}
            </Stack>
        </Box>
    );
};

export { Profile };
