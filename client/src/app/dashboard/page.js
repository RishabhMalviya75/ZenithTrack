'use client';

import { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/components/AppLayout';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { tasksAPI, scheduleAPI, analyticsAPI } from '@/lib/api';

// Confetti burst on quest completion
function spawnConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);
    const colors = ['#FF6B35', '#2ECC71', '#FFD700', '#9B59B6', '#3498DB', '#E74C3C'];
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'confetti-particle';
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = `${Math.random() * 30 - 10}%`;
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDelay = `${Math.random() * 0.5}s`;
        p.style.animationDuration = `${1 + Math.random() * 1}s`;
        container.appendChild(p);
    }
    setTimeout(() => container.remove(), 2500);
}

// SVG Progress Ring component
function ProgressRing({ percent, size = 160, strokeWidth = 10 }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percent / 100) * circumference;

    return (
        <div className="progress-ring-container" style={{ width: size, height: size }}>
            <svg className="progress-ring" width={size} height={size}>
                <defs>
                    <linearGradient id="xpGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FFD700" />
                        <stop offset="100%" stopColor="#FF6B35" />
                    </linearGradient>
                </defs>
                <circle
                    className="progress-ring-bg"
                    cx={size / 2} cy={size / 2} r={radius}
                    strokeWidth={strokeWidth}
                />
                <circle
                    className="progress-ring-fill"
                    cx={size / 2} cy={size / 2} r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>
            <div className="progress-ring-text">
                <div className="progress-ring-value">{Math.round(percent)}%</div>
                <div className="progress-ring-label">Quest Progress</div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ totalTasks: 0, completedTasks: 0, completionRate: 0, weeklyRate: 0 });
    const [todayTasks, setTodayTasks] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadDashboard = useCallback(async () => {
        try {
            const [kpis, tasks, sched] = await Promise.all([
                analyticsAPI.getKPIs().catch(() => ({ data: {} })),
                tasksAPI.getAll().catch(() => ({ data: [] })),
                scheduleAPI.getAll().catch(() => ({ data: [] })),
            ]);

            setStats(kpis.data);
            setTodayTasks(tasks.data?.slice(0, 5) || []);
            setSchedule(sched.data?.slice(0, 5) || []);
        } catch (err) {
            console.error('Dashboard load error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    const toggleTask = async (task) => {
        try {
            const newStatus = task.status === 'Complete' ? 'Pending' : 'Complete';
            await tasksAPI.update(task._id, { status: newStatus });
            if (newStatus === 'Complete') spawnConfetti();
            loadDashboard();
        } catch (err) {
            console.error(err);
        }
    };

    const totalXP = (stats.completedTasks || 0) * 25;
    const level = Math.floor(totalXP / 100) + 1;
    const focusScore = Math.min(100, (stats.completedTasks || 0) * 12);

    const getRarity = (priority) => {
        switch (priority) {
            case 'critical': return 'legendary';
            case 'high': return 'epic';
            case 'medium': return 'rare';
            default: return 'common';
        }
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <AppLayout>
            <Header title="🏰 Command Center" subtitle="Your quest overview" />
            <div className="page-content">
                {/* Quest Status Banner */}
                <div className="welcome-banner animate-fade-in">
                    <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '20px' }}>
                        <div>
                            <h2>Welcome back, {user?.name?.split(' ')[0]} ⚔️</h2>
                            <p>Level {level} Adventurer · {totalXP} XP earned · Keep forging ahead!</p>
                        </div>
                        <div className="flex items-center gap-16">
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-xp-gold)' }}>{totalXP}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total XP</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-emerald)' }}>{stats.completedTasks || 0}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Quests Done</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bento Grid Stats */}
                <div className="bento-grid" style={{ marginBottom: '28px' }}>
                    {/* XP Progress Ring — Large */}
                    <div className="glass-card bento-lg animate-slide-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                        <ProgressRing percent={stats.completionRate || 0} size={180} strokeWidth={12} />
                        <div style={{ textAlign: 'center', marginTop: '8px' }}>
                            <div style={{ fontSize: '14px', fontWeight: 700 }}>Overall Completion</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Complete quests to fill the ring</div>
                        </div>
                    </div>

                    {/* Quests Completed */}
                    <div className="glass-card stat-card animate-slide-up" style={{ animationDelay: '100ms' }}>
                        <div className="stat-card-icon" style={{ background: 'rgba(46, 204, 113, 0.15)' }}>⚔️</div>
                        <div className="stat-card-value" style={{ color: 'var(--accent-emerald)' }}>{stats.completedTasks || 0}</div>
                        <div className="stat-card-label">Quests Completed</div>
                        <div className="stat-card-change positive">↑ {stats.completionRate || 0}% rate</div>
                    </div>

                    {/* Active Streak */}
                    <div className="glass-card stat-card animate-slide-up" style={{ animationDelay: '200ms' }}>
                        <div className="stat-card-icon" style={{ background: 'rgba(255, 107, 53, 0.15)' }}>
                            <span className="streak-flame">🔥</span>
                        </div>
                        <div className="stat-card-value" style={{ color: 'var(--accent-sunset)' }}>{stats.weeklyRate || 0}%</div>
                        <div className="stat-card-label">Weekly Rate</div>
                        <div className={`stat-card-change ${(stats.weeklyRate || 0) >= 50 ? 'positive' : 'negative'}`}>
                            {(stats.weeklyRate || 0) >= 50 ? '↑ On track' : '↓ Needs push'}
                        </div>
                    </div>

                    {/* Total Quests */}
                    <div className="glass-card stat-card animate-slide-up" style={{ animationDelay: '150ms' }}>
                        <div className="stat-card-icon" style={{ background: 'rgba(52, 152, 219, 0.15)' }}>📋</div>
                        <div className="stat-card-value">{stats.totalTasks || 0}</div>
                        <div className="stat-card-label">Total Quests</div>
                        <div className="stat-card-change positive">↑ +3 this week</div>
                    </div>

                    {/* Focus Score */}
                    <div className="glass-card stat-card animate-slide-up" style={{ animationDelay: '250ms' }}>
                        <div className="stat-card-icon" style={{ background: 'rgba(155, 89, 182, 0.15)' }}>🎯</div>
                        <div className="stat-card-value" style={{ color: 'var(--accent-rare)' }}>{focusScore}</div>
                        <div className="stat-card-label">Focus Score</div>
                        <div className="stat-card-change positive">↑ Keep going!</div>
                    </div>
                </div>

                <div className="grid-2">
                    {/* Active Quests */}
                    <div className="glass-card animate-slide-up" style={{ animationDelay: '300ms' }}>
                        <div className="flex items-center justify-between mb-16">
                            <h3 className="section-title" style={{ marginBottom: 0 }}>⚔️ Active Quests</h3>
                            <a href="/tasks" className="btn btn-ghost btn-sm">View all →</a>
                        </div>
                        {loading ? (
                            <div className="empty-state"><div className="loading-spinner" style={{ margin: '0 auto' }}></div></div>
                        ) : todayTasks.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">⚔️</div>
                                <h3>No active quests</h3>
                                <p>Accept a new quest to begin your adventure</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-8">
                                {todayTasks.map((task) => (
                                    <div key={task._id} className={`task-item quest-card rarity-${getRarity(task.priority)}`} onClick={() => toggleTask(task)}>
                                        <div className={`task-checkbox ${task.status === 'Complete' ? 'checked' : ''}`}></div>
                                        <div className="task-content">
                                            <div className={`task-title ${task.status === 'Complete' ? 'completed' : ''}`}>{task.title}</div>
                                            <div className="task-meta">
                                                <span className="badge badge-orange">{task.category}</span>
                                                <span className="task-meta-item">
                                                    <span className={`priority-dot ${task.priority}`}></span>
                                                    {task.priority}
                                                </span>
                                                <span className="quest-xp-reward">+{task.duration || 25} XP</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quest Log Timeline */}
                    <div className="glass-card animate-slide-up" style={{ animationDelay: '400ms' }}>
                        <div className="flex items-center justify-between mb-16">
                            <h3 className="section-title" style={{ marginBottom: 0 }}>📜 Quest Log</h3>
                            <a href="/calendar" className="btn btn-ghost btn-sm">Calendar →</a>
                        </div>
                        {loading ? (
                            <div className="empty-state"><div className="loading-spinner" style={{ margin: '0 auto' }}></div></div>
                        ) : schedule.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">📜</div>
                                <h3>No scheduled quests</h3>
                                <p>Plan your adventure by adding time blocks</p>
                            </div>
                        ) : (
                            <div className="timeline">
                                {schedule.map((item, i) => (
                                    <div key={item._id || i} className="timeline-item">
                                        <div className="timeline-dot" style={{ borderColor: item.color || 'var(--accent-sunset)' }}></div>
                                        <div className="timeline-time">{formatTime(item.startTime)} — {formatTime(item.endTime)}</div>
                                        <div className="timeline-title">{item.title}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
