'use client';

import { createContext } from 'react';

import type { TAppGlobalContext } from '@/types/AppGlobalContext';

const AppGlobalContext = createContext<TAppGlobalContext | null>(null);

export { AppGlobalContext };
