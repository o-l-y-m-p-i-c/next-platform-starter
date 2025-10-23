'use client';

import { createContext } from 'react';

import type { TAuthContext } from '@/types/AuthContext';

const AuthContext = createContext<TAuthContext | null>(null);

export { AuthContext };
