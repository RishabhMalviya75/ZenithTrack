'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function ConsistencyChart({ logs }) {
    // Process logs for the last 14 days
    const data = [];
    const today = new Date();

    for (let i = 13; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];

        const log = logs.find(l => l.date === dateStr);
        let score = 0;

        if (log) {
            const values = Object.values(log.metrics);
            const totalTasks = values.length;
            let completed = 0;
            let partial = 0;

            values.forEach(v => {
                if (v === 'Complete') completed++;
                if (v === 'Partial') partial++;
            });

            // Complete = 100%, Partial = 50%
            score = ((completed * 1) + (partial * 0.5)) / totalTasks * 100;
        }

        data.push({
            date: dateStr.slice(5), // MM-DD
            score: parseFloat(score.toFixed(1))
        });
    }

    return (
        <div className="glass-card" style={{ padding: '24px', marginBottom: '24px', height: '350px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: 'var(--text-primary)' }}>
                Velocity Analytics (14 Days)
            </h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                        dataKey="date"
                        stroke="var(--text-muted)"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="var(--text-muted)"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 100]}
                        unit="%"
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            color: 'var(--text-primary)'
                        }}
                        itemStyle={{ color: 'var(--accent-sunset)' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#FF6B35"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorScore)"
                        activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
