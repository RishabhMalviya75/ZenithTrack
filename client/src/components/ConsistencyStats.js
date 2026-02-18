'use client';

const calculateStats = (logs) => {
    if (!logs || logs.length === 0) return { streak: 0, bestDay: 'N/A', avg7Day: 0 };

    // Sort logs by date descending (newest first)
    const sortedLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));

    // 1. Current Streak
    // Count consecutive days where at least one task is Complete or Partial
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];

    // Check if we have an entry for today or yesterday to start the streak
    let startIndex = 0;
    if (sortedLogs[0].date !== today) {
        // If no log for today, check if the most recent log is yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        if (sortedLogs[0].date !== yesterdayStr) {
            streak = 0; // Streak broken
        }
    }

    for (let i = startIndex; i < sortedLogs.length; i++) {
        const log = sortedLogs[i];
        const values = Object.values(log.metrics);
        const hasActivity = values.some(v => v === 'Complete' || v === 'Partial');

        if (hasActivity) {
            streak++;
            // Check for gap (if logs are not continuous days)
            if (i < sortedLogs.length - 1) {
                const currDate = new Date(log.date);
                const nextDate = new Date(sortedLogs[i + 1].date);
                const diffTime = Math.abs(currDate - nextDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays > 1) break;
            }
        } else {
            break;
        }
    }

    // 2. Best Day & 7-Day Average
    let bestDayScore = 0;
    let bestDayDate = 'N/A';
    let last7DaysScoreSum = 0;
    let count7Days = 0;

    sortedLogs.forEach(log => {
        const values = Object.values(log.metrics);
        const totalTasks = values.length; // 5 categories
        let completed = 0;
        let partial = 0;

        values.forEach(v => {
            if (v === 'Complete') completed++;
            if (v === 'Partial') partial++;
        });

        // Simple scoring: Complete = 1, Partial = 0.5
        const score = (completed + (partial * 0.5)) / totalTasks * 100;

        if (score > bestDayScore) {
            bestDayScore = score;
            bestDayDate = log.date;
        }

        // Check if log is within last 7 days
        const logDate = new Date(log.date);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        if (logDate >= sevenDaysAgo) {
            last7DaysScoreSum += score;
            count7Days++;
        }
    });

    const avg7Day = count7Days > 0 ? (last7DaysScoreSum / count7Days).toFixed(0) : 0;

    return {
        streak,
        bestDay: bestDayDate === 'N/A' ? 'N/A' : `${bestDayDate} (${bestDayScore.toFixed(0)}%)`,
        avg7Day
    };
};

export default function ConsistencyStats({ logs }) {
    const stats = calculateStats(logs);

    return (
        <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div className="glass-card stat-card" style={{ padding: '20px' }}>
                <div className="stat-card-icon" style={{ background: 'rgba(255, 107, 53, 0.1)', color: 'var(--accent-sunset)' }}>
                    🔥
                </div>
                <div className="stat-card-value">{stats.streak}</div>
                <div className="stat-card-label">Current Streak</div>
                <div className="stat-card-change positive">Days</div>
            </div>

            <div className="glass-card stat-card" style={{ padding: '20px' }}>
                <div className="stat-card-icon" style={{ background: 'rgba(46, 204, 113, 0.1)', color: 'var(--accent-emerald)' }}>
                    🏆
                </div>
                <div className="stat-card-value" style={{ fontSize: '24px' }}>{stats.bestDay}</div>
                <div className="stat-card-label">Best Day</div>
                <div className="stat-card-change positive">High Score</div>
            </div>

            <div className="glass-card stat-card" style={{ padding: '20px' }}>
                <div className="stat-card-icon" style={{ background: 'rgba(52, 152, 219, 0.1)', color: 'var(--accent-frost)' }}>
                    📊
                </div>
                <div className="stat-card-value">{stats.avg7Day}%</div>
                <div className="stat-card-label">7-Day Consistency</div>
                <div className="stat-card-change">Average</div>
            </div>
        </div>
    );
}
