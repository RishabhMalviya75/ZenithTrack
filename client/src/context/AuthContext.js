'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('zenith_token');
        const savedUser = localStorage.getItem('zenith_user');
        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch {
                localStorage.removeItem('zenith_token');
                localStorage.removeItem('zenith_user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await authAPI.login({ email, password });
        localStorage.setItem('zenith_token', data.token);
        localStorage.setItem('zenith_user', JSON.stringify(data.user));
        setUser(data.user);
        return data;
    };

    const register = async (name, email, password, type) => {
        const { data } = await authAPI.register({ name, email, password, type });
        localStorage.setItem('zenith_token', data.token);
        localStorage.setItem('zenith_user', JSON.stringify(data.user));
        setUser(data.user);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('zenith_token');
        localStorage.removeItem('zenith_user');
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
