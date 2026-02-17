'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState('dark'); // 'light' | 'dark' | 'system'

    // On mount, read from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('zenith_theme');
        if (saved && ['light', 'dark', 'system'].includes(saved)) {
            setThemeState(saved);
        }
    }, []);

    // Apply the resolved theme class to <html>
    useEffect(() => {
        const applyTheme = (resolved) => {
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(resolved);
        };

        if (theme === 'system') {
            const mq = window.matchMedia('(prefers-color-scheme: light)');
            const resolved = mq.matches ? 'light' : 'dark';
            applyTheme(resolved);

            const handler = (e) => applyTheme(e.matches ? 'light' : 'dark');
            mq.addEventListener('change', handler);
            return () => mq.removeEventListener('change', handler);
        } else {
            applyTheme(theme);
        }
    }, [theme]);

    const setTheme = (newTheme) => {
        setThemeState(newTheme);
        localStorage.setItem('zenith_theme', newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};
