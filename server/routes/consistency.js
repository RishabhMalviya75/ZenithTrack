const express = require('express');
const router = express.Router();
const Consistency = require('../models/Consistency');
const { protect } = require('../middleware/auth');

// @route   GET /api/consistency
// @desc    Get consistency logs for the authenticated user (last 30 days)
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const logs = await Consistency.find({ user: req.user.id })
            .sort({ date: -1 })
            .limit(30);
        res.json(logs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/consistency
// @desc    Upsert a consistency log for a specific date
// @access  Private
router.post('/', protect, async (req, res) => {
    const { date, metrics } = req.body;

    try {
        let log = await Consistency.findOne({ user: req.user.id, date });

        if (log) {
            // Update existing log
            log.metrics = { ...log.metrics, ...metrics };
            await log.save();
            return res.json(log);
        }

        // Create new log
        log = new Consistency({
            user: req.user.id,
            date,
            metrics
        });

        await log.save();
        res.json(log);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
