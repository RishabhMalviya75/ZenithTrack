'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { tasksAPI } from '@/lib/api';

export default function Header({ title, subtitle }) {
    const { user } = useAuth();
    const router = useRouter();

    const now = new Date();
    const greeting = now.getHours() < 12 ? 'Morning' : now.getHours() < 17 ? 'Afternoon' : 'Evening';
    const streak = user?.streak || 3;

    // ── Search state ──
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const searchInputRef = useRef(null);

    // ── Notification state ──
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [notifLoading, setNotifLoading] = useState(false);
    const notifRef = useRef(null);

    // Focus search input when opened
    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchOpen]);

    // Close search on Escape
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') {
                setSearchOpen(false);
                setNotifOpen(false);
            }
            // Ctrl+K to open search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(true);
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    // Close notification dropdown on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setNotifOpen(false);
            }
        };
        if (notifOpen) {
            document.addEventListener('mousedown', handleClick);
        }
        return () => document.removeEventListener('mousedown', handleClick);
    }, [notifOpen]);

    // Search tasks
    const handleSearch = useCallback(async (query) => {
        setSearchQuery(query);
        if (query.trim().length < 2) {
            setSearchResults([]);
            return;
        }
        setSearchLoading(true);
        try {
            const { data } = await tasksAPI.getAll();
            const results = (Array.isArray(data) ? data : []).filter((task) =>
                task.title?.toLowerCase().includes(query.toLowerCase()) ||
                task.category?.toLowerCase().includes(query.toLowerCase()) ||
                task.description?.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(results.slice(0, 8));
        } catch (err) {
            console.error('Search error:', err);
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    }, []);

    // Load notifications (generated from recent tasks)
    const loadNotifications = useCallback(async () => {
        setNotifLoading(true);
        try {
            const { data } = await tasksAPI.getAll();
            const tasks = Array.isArray(data) ? data : [];
            const notifs = [];

            // Recent completed tasks
            const completed = tasks.filter(t => t.status === 'Complete').slice(0, 3);
            completed.forEach(t => {
                notifs.push({
                    id: `complete-${t._id}`,
                    icon: '✅',
                    text: `Quest "${t.title}" completed!`,
                    sub: `+${t.duration || 25} XP earned`,
                    type: 'success',
                });
            });

            // Overdue / pending high-priority tasks
            const urgent = tasks.filter(t =>
                t.status !== 'Complete' &&
                (t.priority === 'high' || t.priority === 'critical')
            ).slice(0, 3);
            urgent.forEach(t => {
                notifs.push({
                    id: `urgent-${t._id}`,
                    icon: '⚠️',
                    text: `"${t.title}" needs attention`,
                    sub: `Priority: ${t.priority}`,
                    type: 'warning',
                });
            });

            // General pending tasks
            const pending = tasks.filter(t => t.status === 'Pending').slice(0, 2);
            pending.forEach(t => {
                notifs.push({
                    id: `pending-${t._id}`,
                    icon: '📋',
                    text: `"${t.title}" is pending`,
                    sub: t.category || 'Uncategorized',
                    type: 'info',
                });
            });

            setNotifications(notifs.slice(0, 6));
        } catch (err) {
            console.error('Notification error:', err);
            setNotifications([]);
        } finally {
            setNotifLoading(false);
        }
    }, []);

    const openNotifications = () => {
        setNotifOpen(!notifOpen);
        setSearchOpen(false);
        if (!notifOpen) loadNotifications();
    };

    const openSearch = () => {
        setSearchOpen(true);
        setNotifOpen(false);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'critical': return 'var(--accent-xp-gold)';
            case 'high': return 'var(--accent-sunset)';
            case 'medium': return 'var(--accent-rare)';
            default: return 'var(--accent-frost)';
        }
    };

    return (
        <>
            <header className="header">
                <div className="header-left">
                    <h1>{title}</h1>
                    {subtitle && <p>{subtitle}</p>}
                </div>
                <div className="header-right">
                    <div className="streak-counter">
                        <span className="streak-flame">🔥</span>
                        {streak}-day streak
                    </div>

                    {/* Notification */}
                    <div ref={notifRef} style={{ position: 'relative' }}>
                        <button className="header-icon-btn" title="Notifications" onClick={openNotifications}>
                            🔔
                            <span className="notification-dot"></span>
                        </button>

                        {notifOpen && (
                            <div className="notif-dropdown">
                                <div className="notif-header">
                                    <span className="notif-title">Notifications</span>
                                    <span className="notif-count">{notifications.length}</span>
                                </div>
                                {notifLoading ? (
                                    <div className="notif-empty">
                                        <div className="loading-spinner" style={{ margin: '0 auto', width: 24, height: 24 }}></div>
                                    </div>
                                ) : notifications.length === 0 ? (
                                    <div className="notif-empty">
                                        <span>🔕</span>
                                        <p>No notifications</p>
                                    </div>
                                ) : (
                                    <div className="notif-list">
                                        {notifications.map((n) => (
                                            <div key={n.id} className={`notif-item notif-${n.type}`}>
                                                <span className="notif-icon">{n.icon}</span>
                                                <div className="notif-content">
                                                    <div className="notif-text">{n.text}</div>
                                                    <div className="notif-sub">{n.sub}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Search */}
                    <button className="header-icon-btn" title="Search (Ctrl+K)" onClick={openSearch}>
                        🔍
                    </button>

                    {/* Greeting */}
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '8px' }}>
                        {greeting}, <strong style={{ color: 'var(--accent-sunset)' }}>{user?.name?.split(' ')[0] || 'Adventurer'}</strong>
                    </div>
                </div>
            </header>

            {/* Search Overlay */}
            {searchOpen && (
                <div className="search-overlay" onClick={() => setSearchOpen(false)}>
                    <div className="search-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="search-input-wrapper">
                            <span className="search-input-icon">🔍</span>
                            <input
                                ref={searchInputRef}
                                className="search-input"
                                type="text"
                                placeholder="Search quests..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            <kbd className="search-kbd">ESC</kbd>
                        </div>

                        {searchQuery.trim().length >= 2 && (
                            <div className="search-results">
                                {searchLoading ? (
                                    <div className="search-empty">Searching...</div>
                                ) : searchResults.length === 0 ? (
                                    <div className="search-empty">No quests found for "{searchQuery}"</div>
                                ) : (
                                    searchResults.map((task) => (
                                        <div
                                            key={task._id}
                                            className="search-result-item"
                                            onClick={() => {
                                                setSearchOpen(false);
                                                setSearchQuery('');
                                                router.push('/tasks');
                                            }}
                                        >
                                            <div
                                                className="search-result-dot"
                                                style={{ background: getPriorityColor(task.priority) }}
                                            />
                                            <div className="search-result-info">
                                                <div className="search-result-title">{task.title}</div>
                                                <div className="search-result-meta">
                                                    <span>{task.category || 'Uncategorized'}</span>
                                                    <span>·</span>
                                                    <span style={{
                                                        color: task.status === 'Complete' ? 'var(--accent-emerald)' : 'var(--text-muted)'
                                                    }}>
                                                        {task.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="quest-xp-reward">+{task.duration || 25} XP</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {searchQuery.trim().length < 2 && (
                            <div className="search-hints">
                                <div className="search-hint">Type at least 2 characters to search</div>
                                <div className="search-hint">Search by quest name, category, or description</div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
