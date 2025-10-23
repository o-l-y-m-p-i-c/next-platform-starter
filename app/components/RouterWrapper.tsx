'use client';

import { useAccount } from 'wagmi';
import { useAuth } from '../../src/hooks';

export function Router({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();
  const { user } = useAuth();

  const isWorkingWithAuthRouting =
    process.env.NEXT_PUBLIC_AUTH_ROUTINGS === 'true';

  // If auth routing is enabled and user is not authenticated, could redirect
  // For now, we'll just render children as Next.js handles routing differently
  if (isWorkingWithAuthRouting && !isConnected && !user) {
    // You might want to redirect to a login page or show a different UI
    // For now, we'll just render the children
  }

  return <>{children}</>;
}
