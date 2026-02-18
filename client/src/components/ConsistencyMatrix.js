'use client';

import { useState } from 'react';
const CATEGORIES = ['Development', 'Career', 'AI_ML', 'Mindset', 'DSA'];
const STATUS_FLOW = ['No Tasks', 'Complete', 'Partial', 'Missed'];

const STATUS_COLORS = {
    'No Tasks': 'rgba(255, 255, 255, 0.05)',
    'Complete': 'var(--accent-emerald)',
    'Partial': 'var(--accent-sunset)',
    'Missed': 'var(--accent-rose)'
};

const STATUS_LABELS = {
    'No Tasks': '⚪',
    'Complete': '🟢',
    'Partial': '🟠',
    'Missed': '🔴'
};

export default function ConsistencyMatrix({ startDate, logs, onUpdate }) {
    // Generate last 30 days
    const days = [];
    for (let i = 0; i < 30; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d.toISOString().split('T')[0]);
    }

    const getStatus = (date, category) => {
        const log = logs.find(l => l.date === date);
        return log?.metrics?.[category] || 'No Tasks';
    };

    const handleCellClick = (date, category) => {
        const currentStatus = getStatus(date, category);
        const currentIndex = STATUS_FLOW.indexOf(currentStatus);
        const nextStatus = STATUS_FLOW[(currentIndex + 1) % STATUS_FLOW.length];
        onUpdate(date, category, nextStatus);
    };

    return (
        <div className="consistency-matrix-container">
            <style jsx>{`
                .consistency-matrix-container {
                    overflow-x: auto;
                    padding-bottom: 20px;
                }
                .matrix-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 4px;
                }
                .matrix-header {
                    text-align: center;
                    font-size: 12px;
                    font-weight: 700;
                    color: var(--text-secondary);
                    padding: 8px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .matrix-date {
                    font-family: 'Monaco', monospace;
                    font-size: 11px;
                    color: var(--text-muted);
                    padding: 6px;
                    white-space: nowrap;
                }
                .matrix-cell {
                    width: 60px;
                    height: 40px;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    position: relative;
                }
                .matrix-cell:hover {
                    opacity: 0.8;
                    transform: scale(1.05);
                }
            `}</style>
            <table className="matrix-table">
                <thead>
                    <tr>
                        <th className="matrix-header">Date</th>
                        {CATEGORIES.map(cat => (
                            <th key={cat} className="matrix-header">{cat.replace('_', '/')}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {days.map(date => (
                        <tr key={date}>
                            <td className="matrix-date">{date}</td>
                            {CATEGORIES.map(cat => (
                                <td
                                    key={`${date}-${cat}`}
                                    className="matrix-cell"
                                    style={{ backgroundColor: STATUS_COLORS[getStatus(date, cat)] }}
                                    onClick={() => handleCellClick(date, cat)}
                                    title={`${date} - ${cat}: ${getStatus(date, cat)}`}
                                />
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
