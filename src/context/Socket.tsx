'use client';

import { createContext } from 'react';
import type { TSocketContext } from '@/types/SocketContext';

const SocketContext = createContext<TSocketContext | null>(null);

export { SocketContext };
