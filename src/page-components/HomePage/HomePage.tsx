import { Suspense } from 'react';
import { HomePageSearchForm } from '@/components/HomePageSearchForm';

export const HomePage = () => {
  return (
    <>
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <HomePageSearchForm />
        </Suspense>
      </main>
    </>
  );
};
