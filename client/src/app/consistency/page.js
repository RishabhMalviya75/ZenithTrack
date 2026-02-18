'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ConsistencyMatrix from '@/components/ConsistencyMatrix';
import ConsistencyStats from '@/components/ConsistencyStats';
import ConsistencyChart from '@/components/ConsistencyChart';
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
            if (err.response && err.response.status === 401) {
                setError('Session expired. Please log in again.');
            } else {
                setError('Failed to load consistency data. Server might be unreachable.');
            }
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

    const downloadCSV = () => {
        if (!logs.length) return;

        const headers = ['Date', 'Development', 'Career', 'AI_ML', 'Mindset', 'DSA'];
        const csvRows = [headers.join(',')];

        logs.forEach(log => {
            const row = [
                log.date,
                log.metrics.Development || 'No Tasks',
                log.metrics.Career || 'No Tasks',
                log.metrics.AI_ML || 'No Tasks',
                log.metrics.Mindset || 'No Tasks',
                log.metrics.DSA || 'No Tasks'
            ];
            csvRows.push(row.join(','));
        });

        const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "zenith_consistency_logs.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="page-content">
            <header className="mb-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
                        Consistency Hub
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Track, Analyze, and Improve your daily habits.
                    </p>
                </div>
                <button
                    onClick={downloadCSV}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        background: 'rgba(255, 107, 53, 0.1)',
                        color: 'var(--accent-sunset)',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '13px',
                        transition: 'all 0.2s ease',
                        border: '1px solid rgba(255, 107, 53, 0.2)',
                        cursor: 'pointer'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = 'var(--accent-sunset)';
                        e.currentTarget.style.color = '#fff';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 107, 53, 0.1)';
                        e.currentTarget.style.color = 'var(--accent-sunset)';
                    }}
                >
                    📥 Export Data
                </button>
            </header>

            {/* Momentum Metadata & Consistency Chart */}
            {!loading && !error && (
                <>
                    <ConsistencyStats logs={logs} />
                    <ConsistencyChart logs={logs} />
                </>
            )}

            <div className="glass-card">
                <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        Multi-Domain Matrix
                    </h3>
                    <div className="legend" style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
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
                </div>

                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Loading Hub...
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
