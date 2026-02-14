const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    completionRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    tasksCompleted: {
        type: Number,
        default: 0
    },
    totalTasks: {
        type: Number,
        default: 0
    },
    focusMinutes: {
        type: Number,
        default: 0
    },
    value: {
        type: Number,
        default: 0
    },
    kpiType: {
        type: String,
        default: 'general'
    }
}, {
    timestamps: true
});

progressSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Progress', progressSchema);
