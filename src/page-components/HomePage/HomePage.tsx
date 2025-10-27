import { Suspense } from 'react';
import { HomePageSearchForm } from '@/components/HomePageSearchForm';

export const HomePage = () => {
    return (
        <>
            <main>
                <Suspense fallback={null}>
                    <HomePageSearchForm />
                </Suspense>
            </main>
        </>
    );
};
