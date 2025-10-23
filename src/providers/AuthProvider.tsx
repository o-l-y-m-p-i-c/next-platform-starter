'use client';

import { useState, useCallback, useEffect } from 'react';

import type { TUser } from '@/types/responces/User';
import { AuthContext } from '../context';

const localStorageKey = 'user';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<TUser | null>(null);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        // Check if we're on the client side
        if (typeof window === 'undefined') return;

        const storedUser = localStorage.getItem(localStorageKey);
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const setUserFn = useCallback(async (user?: TUser) => {
        if (typeof window !== 'undefined') {
            if (user) {
                localStorage.setItem(localStorageKey, JSON.stringify(user));
            } else {
                localStorage.removeItem(localStorageKey);
            }
        }

        setUser(user || null);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser: setUserFn,
                isAuthenticated: !!user,
                isLoading,
                setLoading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider };
