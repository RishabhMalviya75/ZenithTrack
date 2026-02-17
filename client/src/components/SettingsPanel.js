'use client';

import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function SettingsPanel({ isOpen, onClose }) {
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();

    const initials = user?.name
        ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase()
        : '?';

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div className="settings-overlay" onClick={onClose} />

            {/* Panel */}
            <div className="settings-panel">
                {/* Header */}
                <div className="settings-header">
                    <h3>Settings</h3>
                    <button className="settings-close" onClick={onClose}>✕</button>
                </div>

                {/* User Info */}
                <div className="settings-user">
                    <div className="settings-avatar">{initials}</div>
                    <div className="settings-user-info">
                        <div className="settings-user-name">{user?.name || 'Adventurer'}</div>
                        <div className="settings-user-email">{user?.email || ''}</div>
                    </div>
                </div>

                {/* Appearance */}
                <div className="settings-section">
                    <div className="settings-section-title">✨ Appearance</div>
                    <div className="settings-theme-buttons">
                        <button
                            className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                            onClick={() => setTheme('light')}
                        >
                            <span className="theme-option-icon">☀️</span>
                            Light
                        </button>
                        <button
                            className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                            onClick={() => setTheme('dark')}
                        >
                            <span className="theme-option-icon">🌙</span>
                            Dark
                        </button>
                        <button
                            className={`theme-option ${theme === 'system' ? 'active' : ''}`}
                            onClick={() => setTheme('system')}
                        >
                            <span className="theme-option-icon">🖥</span>
                            System
                        </button>
                    </div>
                </div>

                {/* Sign Out */}
                <div className="settings-section">
                    <button className="settings-signout" onClick={logout}>
                        <span>↪</span> Sign Out
                    </button>
                </div>
            </div>
        </>
    );
}
