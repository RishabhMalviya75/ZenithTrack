'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('Student');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const userTypes = [
        { value: 'Student', icon: '🎓', label: 'Scholar', desc: 'Knowledge seeker' },
        { value: 'Athlete', icon: '⚔️', label: 'Warrior', desc: 'Strength master' },
        { value: 'Developer', icon: '🧙‍♂️', label: 'Mage', desc: 'Code wizard' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(name, email, password, type);
            router.push('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <div className="auth-logo-icon">⚔️</div>
                    <span className="auth-logo-text">ZenithTrack</span>
                </div>

                <h2 className="auth-title">Choose Your Path</h2>
                <p className="auth-subtitle">Select your class and begin your quest for greatness</p>

                {error && (
                    <div style={{
                        background: 'rgba(231, 76, 60, 0.1)',
                        border: '1px solid rgba(231, 76, 60, 0.2)',
                        color: 'var(--accent-rose)',
                        padding: '10px 16px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '13px',
                        marginBottom: '20px'
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Choose your class</label>
                        <div className="user-type-selector">
                            {userTypes.map((t) => (
                                <div
                                    key={t.value}
                                    className={`user-type-option ${type === t.value ? 'selected' : ''}`}
                                    onClick={() => setType(t.value)}
                                >
                                    <div className="user-type-option-icon">{t.icon}</div>
                                    <div style={{ fontWeight: 700 }}>{t.label}</div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{t.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Adventurer Name</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Your character name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="adventurer@zenithtrack.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Secret Passphrase</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Min. 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg springy-btn"
                        style={{ width: '100%', marginTop: '8px' }}
                        disabled={loading}
                    >
                        {loading ? '⏳ Forging account...' : '⚔️ Begin Your Quest'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already an adventurer? <Link href="/login">Enter the realm</Link>
                </div>
            </div>
        </div>
    );
}
