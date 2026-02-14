const express = require('express');
const Schedule = require('../models/Schedule');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// GET /api/schedule — get user's schedule blocks (optional date range)
router.get('/', async (req, res) => {
    try {
        const { start, end } = req.query;
        const filter = { userId: req.user._id };

        if (start && end) {
            filter.startTime = { $gte: new Date(start) };
            filter.endTime = { $lte: new Date(end) };
        }

        const schedules = await Schedule.find(filter)
            .populate('taskId', 'title status category')
            .sort({ startTime: 1 });

        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/schedule/block — create a new time block
router.post('/block', async (req, res) => {
    try {
        const schedule = await Schedule.create({
            ...req.body,
            userId: req.user._id
        });
        res.status(201).json(schedule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/schedule/:id — update a schedule block
router.put('/:id', async (req, res) => {
    try {
        let schedule = await Schedule.findOne({ _id: req.params.id, userId: req.user._id });
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule block not found' });
        }

        schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json(schedule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/schedule/:id — delete a schedule block
router.delete('/:id', async (req, res) => {
    try {
        const schedule = await Schedule.findOne({ _id: req.params.id, userId: req.user._id });
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule block not found' });
        }
        await schedule.deleteOne();
        res.json({ message: 'Schedule block deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
