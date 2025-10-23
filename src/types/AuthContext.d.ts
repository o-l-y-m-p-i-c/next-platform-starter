import type { TUser } from './responces/User';

export type TAuthContext = {
  isAuthenticated: boolean;
  setUser: (user?: TUser) => Promise<void>;
  user: TUser | null;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
};
