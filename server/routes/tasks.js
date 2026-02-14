const express = require('express');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require auth
router.use(protect);

// GET /api/tasks — list user's tasks with optional filters
router.get('/', async (req, res) => {
    try {
        const { status, category, priority, search } = req.query;
        const filter = { userId: req.user._id };

        if (status) filter.status = status;
        if (category) filter.category = category;
        if (priority) filter.priority = priority;
        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }

        const tasks = await Task.find(filter).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/tasks — create a new task
router.post('/', async (req, res) => {
    try {
        const task = await Task.create({
            ...req.body,
            userId: req.user._id
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/tasks/:id — get single task
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/tasks/:id — update a task
router.put('/:id', async (req, res) => {
    try {
        let task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // If marking as complete, set completedAt
        if (req.body.status === 'Complete' && task.status !== 'Complete') {
            req.body.completedAt = new Date();
        }
        if (req.body.status !== 'Complete') {
            req.body.completedAt = null;
        }

        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/tasks/:id — delete a task
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        await task.deleteOne();
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
