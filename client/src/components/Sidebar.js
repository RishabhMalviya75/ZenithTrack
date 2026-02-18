'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import SettingsPanel from '@/components/SettingsPanel';

const navItems = [
    { href: '/dashboard', icon: '🏰', label: 'Command Center' },
    { href: '/tasks', icon: '⚔️', label: 'Quests' },
    { href: '/calendar', icon: '📜', label: 'Quest Log' },
    { href: '/analytics', icon: '📊', label: 'Stats' },
    { href: '/consistency', icon: '🎯', label: 'Consistency' },
];

const bottomItems = [
    { href: '/team', icon: '👥', label: 'The Guild' },
    { href: '/settings', icon: '🛠', label: 'The Forge' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user } = useAuth();
    const [settingsOpen, setSettingsOpen] = useState(false);

    const initials = user?.name
        ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase()
        : '?';

    // Calculate XP & Level from user stats (simulated here)
    const totalXP = (user?.completedTasks || 0) * 25;
    const level = Math.floor(totalXP / 100) + 1;
    const xpInLevel = totalXP % 100;

    return (
        <>
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <div className="sidebar-brand-icon">⚔️</div>
                    <span className="sidebar-brand-text">ZenithTrack</span>
                </div>

                {/* XP Progress */}
                <div className="sidebar-xp-section">
                    <div className="sidebar-level">
                        <div className="sidebar-level-badge">
                            <span className="level-icon">{level}</span>
                            Level {level}
                        </div>
                        <span className="sidebar-xp-label">{xpInLevel}/100 XP</span>
                    </div>
                    <div className="xp-bar">
                        <div className="xp-bar-fill" style={{ width: `${xpInLevel}%` }}></div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <div className="sidebar-section-label">Quest Hub</div>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
                        >
                            <span className="sidebar-link-icon">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}

                    <div className="sidebar-section-label">System</div>
                    {bottomItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
                        >
                            <span className="sidebar-link-icon">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-user" onClick={() => setSettingsOpen(true)} title="Open settings">
                        <div className="sidebar-avatar">{initials}</div>
                        <div className="sidebar-user-info">
                            <div className="sidebar-user-name">{user?.name || 'Adventurer'}</div>
                            <div className="sidebar-user-type">🛡 {user?.type || 'Explorer'}</div>
                        </div>
                    </div>
                </div>
            </aside>

            <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
        </>
    );
}
