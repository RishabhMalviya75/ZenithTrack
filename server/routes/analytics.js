const express = require('express');
const Task = require('../models/Task');
const Progress = require('../models/Progress');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// GET /api/analytics/progress?period=weekly|monthly
router.get('/progress', async (req, res) => {
    try {
        const { period = 'weekly' } = req.query;
        const now = new Date();
        let startDate;

        if (period === 'monthly') {
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        } else {
            startDate = new Date(now);
            startDate.setDate(startDate.getDate() - 7);
        }

        const progress = await Progress.find({
            userId: req.user._id,
            date: { $gte: startDate }
        }).sort({ date: 1 });

        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/analytics/kpis — user-type-specific KPIs
router.get('/kpis', async (req, res) => {
    try {
        const userId = req.user._id;
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(startOfWeek.getDate() - 7);

        const [totalTasks, completedTasks, weekTasks, weekCompleted] = await Promise.all([
            Task.countDocuments({ userId }),
            Task.countDocuments({ userId, status: 'Complete' }),
            Task.countDocuments({ userId, createdAt: { $gte: startOfWeek } }),
            Task.countDocuments({ userId, status: 'Complete', completedAt: { $gte: startOfWeek } })
        ]);

        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        const weeklyRate = weekTasks > 0 ? Math.round((weekCompleted / weekTasks) * 100) : 0;

        // Category breakdown
        const categoryBreakdown = await Task.aggregate([
            { $match: { userId: req.user._id } },
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        // Priority breakdown
        const priorityBreakdown = await Task.aggregate([
            { $match: { userId: req.user._id, status: { $ne: 'Complete' } } },
            { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]);

        res.json({
            totalTasks,
            completedTasks,
            completionRate,
            weeklyRate,
            weekTasks,
            weekCompleted,
            categoryBreakdown,
            priorityBreakdown,
            userType: req.user.type
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/analytics/trends — weekly completion trends
router.get('/trends', async (req, res) => {
    try {
        const userId = req.user._id;
        const weeks = 8;
        const trends = [];

        for (let i = weeks - 1; i >= 0; i--) {
            const weekEnd = new Date();
            weekEnd.setDate(weekEnd.getDate() - (i * 7));
            const weekStart = new Date(weekEnd);
            weekStart.setDate(weekStart.getDate() - 7);

            const [total, completed] = await Promise.all([
                Task.countDocuments({ userId, createdAt: { $gte: weekStart, $lte: weekEnd } }),
                Task.countDocuments({ userId, status: 'Complete', completedAt: { $gte: weekStart, $lte: weekEnd } })
            ]);

            trends.push({
                weekStart: weekStart.toISOString().split('T')[0],
                weekEnd: weekEnd.toISOString().split('T')[0],
                total,
                completed,
                rate: total > 0 ? Math.round((completed / total) * 100) : 0
            });
        }

        res.json(trends);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
