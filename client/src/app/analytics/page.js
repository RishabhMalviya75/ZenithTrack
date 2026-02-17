'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { analyticsAPI } from '@/lib/api';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';

const COLORS = ['#FF6B35', '#2ECC71', '#FFD700', '#E74C3C', '#9B59B6', '#3498DB'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: 'rgba(34, 38, 46, 0.95)', border: '1px solid rgba(255, 107, 53, 0.2)',
                borderRadius: '8px', padding: '10px 14px', fontSize: '12px'
            }}>
                <p style={{ fontWeight: 600, marginBottom: '4px' }}>{label}</p>
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
                ))}
            </div>
        );
    }
    return null;
};

const ACHIEVEMENTS = [
    { icon: '⚔️', name: 'First Quest', desc: 'Complete 1 task', threshold: 1 },
    { icon: '🔥', name: '3-Day Streak', desc: 'Keep going 3 days', threshold: 3 },
    { icon: '🏅', name: 'Warrior', desc: 'Complete 10 tasks', threshold: 10 },
    { icon: '🌟', name: 'Rising Star', desc: 'Hit 50% rate', threshold: 50 },
    { icon: '👑', name: 'Legend', desc: 'Complete 50 tasks', threshold: 50 },
    { icon: '💎', name: 'Diamond', desc: '100% week', threshold: 100 },
];

export default function AnalyticsPage() {
    const { user } = useAuth();
    const [kpis, setKpis] = useState({});
    const [trends, setTrends] = useState([]);
    const [progress, setProgress] = useState([]);
    const [period, setPeriod] = useState('weekly');
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadAnalytics(); }, [period]);

    const loadAnalytics = async () => {
        try {
            const [kpiRes, trendRes, progressRes] = await Promise.all([
                analyticsAPI.getKPIs().catch(() => ({ data: {} })),
                analyticsAPI.getTrends().catch(() => ({ data: [] })),
                analyticsAPI.getProgress(period).catch(() => ({ data: [] })),
            ]);
            setKpis(kpiRes.data);
            setTrends(trendRes.data);
            setProgress(progressRes.data.map(p => ({
                ...p,
                date: new Date(p.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })
            })));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const categoryData = kpis.categoryBreakdown?.map(c => ({
        name: c._id || 'Unknown',
        value: c.count
    })) || [];

    const completed = kpis.completedTasks || 0;
    const rate = kpis.completionRate || 0;

    const kpiCards = [
        { icon: '⚔️', label: 'STR — Quests Done', value: completed, color: '#FF6B35' },
        { icon: '🎯', label: 'INT — Focus Rate', value: `${rate}%`, color: '#9B59B6' },
        { icon: '📈', label: 'DEX — Completion', value: `${rate}%`, color: '#2ECC71' },
        { icon: '🔥', label: 'VIT — Weekly', value: `${kpis.weekCompleted || 0}/${kpis.weekTasks || 0}`, color: '#FFD700' },
    ];

    const userTypeKPI = {
        Student: { icon: '🎓', label: 'Scholar Path', desc: 'Track your learning hours and assignment completion' },
        Athlete: { icon: '🏅', label: 'Warrior Path', desc: 'Monitor your training sessions and recovery' },
        Developer: { icon: '💻', label: 'Mage Path', desc: 'Track commits, features, and focus sessions' },
    };

    const currentKPI = userTypeKPI[user?.type] || userTypeKPI.Student;

    return (
        <AppLayout>
            <Header title="📊 Character Stats" subtitle="Your growth metrics and achievements" />
            <div className="page-content">
                {/* Period Selector */}
                <div className="flex items-center justify-between mb-24">
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 700 }}>📊 Growth Tracker</h2>
                        <p className="text-sm text-muted">Monitor your adventure with data-driven insights</p>
                    </div>
                    <div className="filter-tabs" style={{ marginBottom: 0 }}>
                        <button className={`filter-tab ${period === 'weekly' ? 'active' : ''}`} onClick={() => setPeriod('weekly')}>Weekly</button>
                        <button className={`filter-tab ${period === 'monthly' ? 'active' : ''}`} onClick={() => setPeriod('monthly')}>Monthly</button>
                    </div>
                </div>

                {/* Character Stat Cards */}
                <div className="grid-4 mb-24">
                    {kpiCards.map((card, i) => (
                        <div key={i} className="glass-card stat-card animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                            <div className="stat-card-icon" style={{ background: `${card.color}22` }}>{card.icon}</div>
                            <div className="stat-card-value" style={{ color: card.color }}>{card.value}</div>
                            <div className="stat-card-label">{card.label}</div>
                        </div>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid-2 mb-24">
                    {/* Completion Trend */}
                    <div className="glass-card chart-card animate-slide-up" style={{ animationDelay: '200ms' }}>
                        <h3>📈 Quest Completion Trend</h3>
                        <div className="chart-container">
                            {progress.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={progress}>
                                        <defs>
                                            <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,107,53,0.08)" />
                                        <XAxis dataKey="date" stroke="#6B6775" fontSize={11} />
                                        <YAxis stroke="#6B6775" fontSize={11} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area type="monotone" dataKey="completionRate" name="Rate %" stroke="#FF6B35" fill="url(#colorRate)" strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="empty-state">
                                    <p>No data yet. Complete quests to see trends.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Weekly Trends */}
                    <div className="glass-card chart-card animate-slide-up" style={{ animationDelay: '300ms' }}>
                        <h3>⚔️ Weekly Overview</h3>
                        <div className="chart-container">
                            {trends.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={trends}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,107,53,0.08)" />
                                        <XAxis dataKey="weekStart" stroke="#6B6775" fontSize={10} />
                                        <YAxis stroke="#6B6775" fontSize={11} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="completed" name="Completed" fill="#2ECC71" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="total" name="Total" fill="rgba(255,107,53,0.3)" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="empty-state">
                                    <p>No data yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Achievements & Category */}
                <div className="grid-2 mb-24">
                    <div className="glass-card chart-card animate-slide-up" style={{ animationDelay: '400ms' }}>
                        <h3>📦 Quest Categories</h3>
                        <div className="chart-container" style={{ height: '250px' }}>
                            {categoryData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%" cy="50%"
                                            innerRadius={60} outerRadius={90}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {categoryData.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="empty-state"><p>No category data.</p></div>
                            )}
                        </div>
                        <div className="flex gap-16" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
                            {categoryData.map((c, i) => (
                                <div key={i} className="flex items-center gap-8" style={{ fontSize: '12px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: COLORS[i % COLORS.length] }} />
                                    <span>{c.name}: {c.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Achievements Section */}
                    <div className="glass-card animate-slide-up" style={{ animationDelay: '500ms' }}>
                        <h3 style={{ marginBottom: '16px' }}>🏆 Achievements</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                            {ACHIEVEMENTS.map((a, i) => {
                                const unlocked = completed >= a.threshold || rate >= a.threshold;
                                return (
                                    <div key={i} className={`achievement-badge ${!unlocked ? 'locked' : ''}`} title={a.desc}>
                                        <div className="badge-icon">{a.icon}</div>
                                        <div className="badge-name">{a.name}</div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Character Class */}
                        <div style={{
                            background: 'var(--gradient-card)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '20px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '40px', marginBottom: '8px' }}>{currentKPI.icon}</div>
                            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{currentKPI.label}</h4>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{currentKPI.desc}</p>
                            <div style={{ marginTop: '12px' }}>
                                <span className={`badge ${user?.type === 'Student' ? 'badge-blue' : user?.type === 'Athlete' ? 'badge-emerald' : 'badge-purple'}`}>
                                    🛡 {user?.type} Class
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
