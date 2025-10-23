import { useContext } from 'react';
import { SocketContext } from '../context';
import type { TSocketContext } from '@/types/SocketContext';

const useSocket = () => {
  return useContext(SocketContext) as TSocketContext;
};

export { useSocket };
