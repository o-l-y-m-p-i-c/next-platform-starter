'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header/index';
import { useAppGlobal, useAuth, useFetch } from '../../hooks';
import { Footer } from '@/components/Footer';
import { Stack } from '@mui/system';
import { useEffect, useMemo, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { Preloader } from '@/components/Preloader';
import { BackgroundMask } from '@/components/BackgroundMask';

export interface UserData {
    data: {
        username: string;
        blockchains: [];
        whiteListNums: number;
        createdAt: string;
        credit: number;
        referralCode: string;
        invitations: {
            current: number;
            max: number;
        };
    };
}

// Component that handles search params logic
const SearchParamsHandler = () => {
    const { setReferralCode } = useAppGlobal();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useAuth();
    const referral = searchParams?.get('referral');

    useEffect(() => {
        if (referral && !user) {
            setReferralCode(referral);
            const updatedParams = new URLSearchParams(searchParams?.toString());
            updatedParams.delete('referral');
            const newPath = `${pathname}?${updatedParams.toString()}`;
            router.replace(newPath);
        }
    }, [referral, user, setReferralCode, searchParams, pathname, router]);

    return null;
};

const Layout = ({ theme, children }: { theme?: string; children?: React.ReactNode }) => {
    const { setReferralCode } = useAppGlobal();
    const { user } = useAuth();
    const { isConnected } = useAccount();
    const { fetchData } = useFetch();

    const { data: userData } = useQuery<UserData>({
        queryKey: ['/users/me'],
        queryFn: async () => {
            const { data, error } = await fetchData<UserData>('/users/me');
            if (error) throw error;
            return data as UserData;
        },
        enabled: !!user && isConnected
    });

    useEffect(() => {
        if (user && isConnected && userData?.data) {
            setReferralCode(userData?.data?.referralCode ?? null);
        }
    }, [user, isConnected, userData, setReferralCode]);

    return (
        <Stack flex={1}>
            <Preloader />
            <Suspense fallback={null}>
                <SearchParamsHandler />
            </Suspense>

            <Stack data-tag={theme} flex={1} position={'relative'}>
                <BackgroundMask />
                <Header />
                <Stack
                    sx={{
                        width: '100%',
                        alignSelf: 'center',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: 2,
                        flex: 1
                    }}
                >
                    {children}
                    <Footer />
                </Stack>
            </Stack>
        </Stack>
    );
};

export { Layout };
