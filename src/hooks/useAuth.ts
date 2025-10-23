import { useContext } from 'react';
import { AuthContext } from '../context';
import type { TAuthContext } from '@/types/AuthContext';

const useAuth = () => {
  return useContext(AuthContext) as TAuthContext;
};

export { useAuth };
