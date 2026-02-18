'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ConsistencyMatrix from '@/components/ConsistencyMatrix';
import axios from 'axios';

export default function ConsistencyPage() {
    const { user, token } = useAuth(); // Assuming AuthContext provides token
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('zenith_token')}`
                },
                timeout: 5000 // 5 second timeout
            };
            const res = await axios.get('http://localhost:5000/api/consistency', config);
            setLogs(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching logs:', err);
            setError('Failed to load consistency data. Server might be unreachable.');
            setLoading(false);
        }
    };

    const handleUpdate = async (date, category, status) => {
        // Optimistic update
        const updatedLogs = [...logs];
        const logIndex = updatedLogs.findIndex(l => l.date === date);

        if (logIndex > -1) {
            updatedLogs[logIndex] = {
                ...updatedLogs[logIndex],
                metrics: {
                    ...updatedLogs[logIndex].metrics,
                    [category]: status
                }
            };
        } else {
            updatedLogs.push({
                date,
                metrics: { [category]: status }
            });
        }

        setLogs(updatedLogs);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('zenith_token')}`
                }
            };
            await axios.post('http://localhost:5000/api/consistency', {
                date,
                metrics: { [category]: status }
            }, config);
        } catch (err) {
            console.error('Error updating log:', err);
            // Revert on error? For now, just log it.
        }
    };

    return (
        <div className="page-content">
            <header className="mb-8">
                <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
                    Consistency Matrix
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Track your daily habits. Consistency is the key to mastery.
                </p>

                <div className="legend" style={{ display: 'flex', gap: '16px', marginTop: '24px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: 'var(--accent-emerald)' }}></div>
                        Complete
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: 'var(--accent-sunset)' }}></div>
                        Partial
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: 'var(--accent-rose)' }}></div>
                        Missed
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}></div>
                        No Tasks
                    </div>
                </div>
            </header>

            <div className="glass-card">
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Loading Matrix...
                    </div>
                ) : error ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--accent-rose)' }}>
                        {error}
                        <button
                            onClick={() => { setLoading(true); setError(null); fetchLogs(); }}
                            style={{ display: 'block', margin: '16px auto', padding: '8px 16px', background: 'var(--bg-tertiary)', borderRadius: '6px' }}
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <ConsistencyMatrix logs={logs} onUpdate={handleUpdate} />
                )}
            </div>
        </div>
    );
}
