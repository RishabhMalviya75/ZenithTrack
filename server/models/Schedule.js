const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        default: null
    },
    title: {
        type: String,
        required: [true, 'Schedule title is required'],
        trim: true
    },
    startTime: {
        type: Date,
        required: [true, 'Start time is required']
    },
    endTime: {
        type: Date,
        required: [true, 'End time is required']
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurrenceRule: {
        type: String,
        default: null
    },
    color: {
        type: String,
        default: '#3b82f6'
    },
    description: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

scheduleSchema.index({ userId: 1, startTime: 1 });

module.exports = mongoose.model('Schedule', scheduleSchema);
