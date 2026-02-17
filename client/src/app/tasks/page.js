'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import Header from '@/components/Header';
import { tasksAPI } from '@/lib/api';

// Confetti burst
function spawnConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);
    const colors = ['#FF6B35', '#2ECC71', '#FFD700', '#9B59B6', '#3498DB'];
    for (let i = 0; i < 25; i++) {
        const p = document.createElement('div');
        p.className = 'confetti-particle';
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = `${Math.random() * 20 - 10}%`;
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDelay = `${Math.random() * 0.4}s`;
        p.style.animationDuration = `${1 + Math.random() * 1}s`;
        container.appendChild(p);
    }
    setTimeout(() => container.remove(), 2500);
}

export default function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [formData, setFormData] = useState({
        title: '', description: '', duration: 30, category: 'one-off', priority: 'medium', dueDate: ''
    });

    useEffect(() => { loadTasks(); }, [filter]);

    const loadTasks = async () => {
        try {
            const params = {};
            if (filter !== 'all') params.category = filter;
            const { data } = await tasksAPI.getAll(params);
            setTasks(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setEditTask(null);
        setFormData({ title: '', description: '', duration: 30, category: 'one-off', priority: 'medium', dueDate: '' });
        setShowModal(true);
    };

    const openEdit = (task) => {
        setEditTask(task);
        setFormData({
            title: task.title,
            description: task.description || '',
            duration: task.duration,
            category: task.category,
            priority: task.priority,
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData };
            if (!payload.dueDate) delete payload.dueDate;
            if (editTask) {
                await tasksAPI.update(editTask._id, payload);
            } else {
                await tasksAPI.create(payload);
            }
            setShowModal(false);
            loadTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const toggleStatus = async (task) => {
        try {
            const newStatus = task.status === 'Complete' ? 'Pending' : 'Complete';
            await tasksAPI.update(task._id, { status: newStatus });
            if (newStatus === 'Complete') spawnConfetti();
            loadTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteTask = async (id) => {
        if (!confirm('Abandon this quest?')) return;
        try {
            await tasksAPI.delete(id);
            loadTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const getRarity = (priority) => {
        switch (priority) {
            case 'critical': return 'legendary';
            case 'high': return 'epic';
            case 'medium': return 'rare';
            default: return 'common';
        }
    };

    const getXP = (task) => {
        const base = task.duration || 25;
        const mult = task.priority === 'critical' ? 3 : task.priority === 'high' ? 2 : task.priority === 'medium' ? 1.5 : 1;
        return Math.round(base * mult);
    };

    const tabs = [
        { key: 'all', label: '🗡 All Quests' },
        { key: 'one-off', label: '⚡ Side Quests' },
        { key: 'habit', label: '🔄 Daily' },
        { key: 'milestone', label: '🏆 Boss' },
    ];

    const completedCount = tasks.filter(t => t.status === 'Complete').length;

    return (
        <AppLayout>
            <Header title="⚔️ Quest Board" subtitle={`${tasks.length} quests · ${completedCount} completed`} />
            <div className="page-content">
                <div className="page-header">
                    <div>
                        <div className="filter-tabs">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    className={`filter-tab ${filter === tab.key ? 'active' : ''}`}
                                    onClick={() => setFilter(tab.key)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button className="btn btn-primary springy-btn" onClick={openCreate}>
                        ⚔️ New Quest
                    </button>
                </div>

                {loading ? (
                    <div className="empty-state"><div className="loading-spinner" style={{ margin: '0 auto' }}></div></div>
                ) : tasks.length === 0 ? (
                    <div className="glass-card empty-state">
                        <div className="empty-state-icon">⚔️</div>
                        <h3>No quests found</h3>
                        <p>Accept a new quest to begin earning XP and levelling up.</p>
                        <button className="btn btn-primary springy-btn mt-16" onClick={openCreate}>⚔️ Accept Quest</button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8">
                        {tasks.map((task, i) => (
                            <div key={task._id} className={`task-item quest-card rarity-${getRarity(task.priority)} animate-slide-up`} style={{ animationDelay: `${i * 50}ms` }}>
                                <div
                                    className={`task-checkbox ${task.status === 'Complete' ? 'checked' : ''}`}
                                    onClick={(e) => { e.stopPropagation(); toggleStatus(task); }}
                                ></div>
                                <div className="task-content" onClick={() => openEdit(task)}>
                                    <div className={`task-title ${task.status === 'Complete' ? 'completed' : ''}`}>{task.title}</div>
                                    {task.description && (
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>{task.description}</div>
                                    )}
                                    <div className="task-meta">
                                        <span className={`badge ${task.category === 'habit' ? 'badge-emerald' :
                                            task.category === 'milestone' ? 'badge-purple' : 'badge-orange'
                                            }`}>{task.category === 'one-off' ? 'Side Quest' : task.category === 'habit' ? 'Daily' : 'Boss'}</span>
                                        <span className="task-meta-item">
                                            <span className={`priority-dot ${task.priority}`}></span>
                                            {task.priority}
                                        </span>
                                        <span className="quest-xp-reward">+{getXP(task)} XP</span>
                                        <span className="task-meta-item">⏱ {task.duration}m</span>
                                        {task.dueDate && (
                                            <span className="task-meta-item">📅 {new Date(task.dueDate).toLocaleDateString()}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="task-actions">
                                    <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); openEdit(task); }}>✏️</button>
                                    <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); deleteTask(task._id); }}>🗑</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* FAB */}
                <button className="fab" onClick={openCreate} title="New Quest">⚔️</button>

                {/* Modal */}
                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>{editTask ? '✏️ Edit Quest' : '⚔️ New Quest'}</h2>
                                <button className="btn btn-ghost" onClick={() => setShowModal(false)}>✕</button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label className="form-label">Quest Name</label>
                                        <input
                                            className="form-input"
                                            placeholder="What challenge awaits?"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Quest Details</label>
                                        <textarea
                                            className="form-textarea"
                                            placeholder="Describe the quest..."
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={3}
                                        />
                                    </div>
                                    <div className="grid-2">
                                        <div className="form-group">
                                            <label className="form-label">Quest Type</label>
                                            <select
                                                className="form-select"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            >
                                                <option value="one-off">⚡ Side Quest</option>
                                                <option value="habit">🔄 Daily Quest</option>
                                                <option value="milestone">🏆 Boss Quest</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Difficulty</label>
                                            <select
                                                className="form-select"
                                                value={formData.priority}
                                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                            >
                                                <option value="low">🟢 Common</option>
                                                <option value="medium">🔵 Rare</option>
                                                <option value="high">🟠 Epic</option>
                                                <option value="critical">🟡 Legendary</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid-2">
                                        <div className="form-group">
                                            <label className="form-label">Duration (minutes)</label>
                                            <input
                                                type="number"
                                                className="form-input"
                                                value={formData.duration}
                                                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 30 })}
                                                min={1}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Deadline</label>
                                            <input
                                                type="date"
                                                className="form-input"
                                                value={formData.dueDate}
                                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary springy-btn">{editTask ? '💾 Save Quest' : '⚔️ Accept Quest'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
