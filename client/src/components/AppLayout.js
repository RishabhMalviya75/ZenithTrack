'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function AppLayout({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="auth-page">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-area">
                {children}
            </div>
        </div>
    );
}
