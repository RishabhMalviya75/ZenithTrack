const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: ''
    },
    duration: {
        type: Number,
        default: 30,
        min: 1
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Complete'],
        default: 'Pending'
    },
    category: {
        type: String,
        enum: ['one-off', 'habit', 'milestone'],
        default: 'one-off'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    dueDate: {
        type: Date,
        default: null
    },
    tags: [{
        type: String,
        trim: true
    }],
    subtasks: [{
        title: { type: String, required: true },
        completed: { type: Boolean, default: false }
    }],
    completedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('Task', taskSchema);
