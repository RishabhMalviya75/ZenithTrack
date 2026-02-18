const mongoose = require('mongoose');

const consistencySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String, // Format: YYYY-MM-DD
        required: true
    },
    metrics: {
        Development: {
            type: String,
            enum: ['Complete', 'Partial', 'Missed', 'No Tasks'],
            default: 'No Tasks'
        },
        Career: {
            type: String,
            enum: ['Complete', 'Partial', 'Missed', 'No Tasks'],
            default: 'No Tasks'
        },
        AI_ML: {
            type: String,
            enum: ['Complete', 'Partial', 'Missed', 'No Tasks'],
            default: 'No Tasks'
        },
        Mindset: {
            type: String,
            enum: ['Complete', 'Partial', 'Missed', 'No Tasks'],
            default: 'No Tasks'
        },
        DSA: {
            type: String,
            enum: ['Complete', 'Partial', 'Missed', 'No Tasks'],
            default: 'No Tasks'
        }
    }
}, {
    timestamps: true
});

// Compound index to ensure one entry per user per day
consistencySchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Consistency', consistencySchema);
