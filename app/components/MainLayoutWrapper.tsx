'use client';

import { MainLayout } from '../../src/layouts';
import { useAppGlobal } from '../../src/hooks';

export function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useAppGlobal();

  return <MainLayout theme={theme}>{children}</MainLayout>;
}
