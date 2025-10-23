'use client';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { darkTheme, getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { bsc, bscTestnet, mainnet } from 'viem/chains';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { WagmiProvider } from 'wagmi';
import '@rainbow-me/rainbowkit/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import * as Sentry from '@sentry/react';
import { useEffect, useState } from 'react';

import { AuthProvider } from '../src/providers/AuthProvider';
import { SocketProvider } from '../src/providers/SocketProvider';
import { AppGlobalProvider } from '../src/providers/AppGlobalProvider';
import { isProd } from '../src/constants/staking.constants';
import { useFetch } from '../src/hooks';
import { Router } from './components/RouterWrapper';

// Initialize Sentry
if (typeof window !== 'undefined') {
    Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
        tracesSampleRate: 1.0,
        tracePropagationTargets: ['localhost', /^https:\/\/trenchspy\.ai/],
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0
    });
}

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1DCED2'
        },
        secondary: {
            main: '#fff'
        },
        background: {
            default: '#040816',
            paper: '#101624'
        },
        success: {
            main: '#1DCED2'
        },
        error: {
            main: '#F83C3C'
        }
    },
    typography: {
        fontFamily: 'var(--font-red-hat-mono)',
        h1: {
            fontFamily: 'var(--font-doto)',
            fontSize: '1.75rem',
            fontWeight: '500'
        },
        h2: {
            fontFamily: 'var(--font-doto)',
            fontSize: '1.25rem'
        }
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none!important'
                }
            }
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    background: '#101624'
                }
            }
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    background: '#000000'
                },
                arrow: {
                    color: '#000000'
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 'bold'
                }
            }
        }
    }
});

const projectId = process.env.NEXT_PUBLIC_API_ID || '';

// Initialize wagmi config only on client side
let config: ReturnType<typeof getDefaultConfig> | undefined;
if (typeof window !== 'undefined') {
    config = getDefaultConfig({
        appName: 'The Thing',
        projectId,
        chains: isProd ? [mainnet, bsc] : [mainnet, bsc, bscTestnet],
        ssr: true
    });
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1
        }
    }
});

// Component to set up React Query defaults
function QueryDefaults() {
    const { fetchData } = useFetch();
    const queryClient = useQueryClient();

    useEffect(() => {
        queryClient.setDefaultOptions({
            queries: {
                refetchOnWindowFocus: false,
                queryFn: async ({ queryKey, signal }: any) => {
                    let queryData = {};
                    const partialUrls = [];
                    for (const val of queryKey) {
                        if (typeof val === 'string') {
                            partialUrls.push(val);
                        } else if (val && val.toString() === '[object Object]') {
                            if (Object.keys(val).length === 0) {
                                throw new Error('only one Search query is allowed');
                            }
                            queryData = val;
                        }
                    }
                    let processedPath = partialUrls
                        .map((part) => {
                            return part.replace(/^\/+|\/+$/g, '');
                        })
                        .join('/');

                    if (Object.keys(queryData).length !== 0) {
                        processedPath = `${processedPath}?${new URLSearchParams(queryData as any).toString()}`;
                    }

                    const { data, error } = await fetchData(processedPath, {
                        signal
                    });
                    if (error) {
                        throw error;
                    }

                    return data;
                }
            }
        });
    }, [fetchData, queryClient]);

    return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    // If wallet config is not available, render without wallet functionality
    if (!config) {
        console.warn('Wallet configuration not available. Running without wallet support.');
        return (
            <AuthProvider>
                <AppGlobalProvider>
                    <QueryClientProvider client={queryClient}>
                        <ThemeProvider theme={theme}>
                            <CssBaseline />
                            <SocketProvider>
                                <QueryDefaults />
                                <ReactQueryDevtools initialIsOpen={false} />
                                <Router>{children}</Router>
                            </SocketProvider>
                        </ThemeProvider>
                    </QueryClientProvider>
                </AppGlobalProvider>
                <ToastContainer theme="dark" />
            </AuthProvider>
        );
    }

    // Full app with wallet support
    return (
        <AuthProvider>
            <AppGlobalProvider>
                <QueryClientProvider client={queryClient}>
                    <WagmiProvider config={config}>
                        <ThemeProvider theme={theme}>
                            <CssBaseline />
                            <SocketProvider>
                                <RainbowKitProvider
                                    modalSize="wide"
                                    theme={darkTheme({
                                        accentColor: '#7b3fe4',
                                        accentColorForeground: 'white',
                                        borderRadius: 'medium'
                                    })}
                                >
                                    <QueryDefaults />
                                    <ReactQueryDevtools initialIsOpen={false} />
                                    <Router>{children}</Router>
                                </RainbowKitProvider>
                            </SocketProvider>
                        </ThemeProvider>
                    </WagmiProvider>
                </QueryClientProvider>
            </AppGlobalProvider>
            <ToastContainer theme="dark" />
        </AuthProvider>
    );
}
