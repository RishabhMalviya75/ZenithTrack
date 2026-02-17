'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
    const { user, logout } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [type, setType] = useState(user?.type || 'Student');
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true);
    const [focusDuration, setFocusDuration] = useState(25);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const userTypes = [
        { value: 'Student', icon: '🎓', label: 'Scholar' },
        { value: 'Athlete', icon: '⚔️', label: 'Warrior' },
        { value: 'Developer', icon: '🧙‍♂️', label: 'Mage' },
    ];

    return (
        <AppLayout>
            <Header title="🛠 The Forge" subtitle="Customize your character and preferences" />
            <div className="page-content" style={{ maxWidth: '700px' }}>
                {saved && (
                    <div className="animate-slide-up" style={{
                        background: 'rgba(46, 204, 113, 0.1)', border: '1px solid rgba(46, 204, 113, 0.3)',
                        color: 'var(--accent-emerald)', padding: '12px 20px', borderRadius: 'var(--radius-md)',
                        marginBottom: '24px', fontSize: '14px', fontWeight: 600
                    }}>
                        ✅ Settings forged successfully
                    </div>
                )}

                <div className="glass-card animate-fade-in">
                    {/* Character Profile */}
                    <div className="settings-section">
                        <h3>⚒️ Character Profile</h3>
                        <div className="form-group">
                            <label className="form-label">Adventurer Name</label>
                            <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Character Class</label>
                            <div className="user-type-selector">
                                {userTypes.map((t) => (
                                    <div
                                        key={t.value}
                                        className={`user-type-option ${type === t.value ? 'selected' : ''}`}
                                        onClick={() => setType(t.value)}
                                    >
                                        <div className="user-type-option-icon">{t.icon}</div>
                                        {t.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="settings-section">
                        <h3>🛡️ Quest Preferences</h3>
                        <div className="settings-row">
                            <div>
                                <div className="settings-row-label">Dark Mode</div>
                                <div className="settings-row-desc">Enable shadow realm theme</div>
                            </div>
                            <div className={`toggle ${darkMode ? 'on' : ''}`} onClick={() => setDarkMode(!darkMode)}></div>
                        </div>
                        <div className="settings-row">
                            <div>
                                <div className="settings-row-label">Quest Alerts</div>
                                <div className="settings-row-desc">Receive quest reminders and streak warnings</div>
                            </div>
                            <div className={`toggle ${notifications ? 'on' : ''}`} onClick={() => setNotifications(!notifications)}></div>
                        </div>
                        <div className="settings-row" style={{ borderBottom: 'none' }}>
                            <div>
                                <div className="settings-row-label">Focus Duration</div>
                                <div className="settings-row-desc">Default quest timer length</div>
                            </div>
                            <select
                                className="form-select"
                                style={{ width: 'auto' }}
                                value={focusDuration}
                                onChange={(e) => setFocusDuration(parseInt(e.target.value))}
                            >
                                <option value={15}>15 min</option>
                                <option value={25}>25 min</option>
                                <option value={30}>30 min</option>
                                <option value={45}>45 min</option>
                                <option value={60}>60 min</option>
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-24">
                        <button className="btn btn-danger" onClick={logout}>🚪 Leave Realm</button>
                        <button className="btn btn-primary springy-btn" onClick={handleSave}>⚒️ Forge Changes</button>
                    </div>
                </div>

                {/* App Info */}
                <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <p>ZenithTrack v1.0.0</p>
                    <p style={{ marginTop: '4px' }}>Forged with 🔥 for adventurers</p>
                </div>
            </div>
        </AppLayout>
    );
}
