const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Resource title is required'],
        trim: true,
        maxlength: 100
    },
    type: {
        type: String,
        enum: ['bookmark', 'prompt', 'snippet', 'document', 'note', 'image'],
        required: true
    },
    content: {
        type: String, // URL for bookmarks, text for notes/prompts, code for snippets
        required: true
    },
    metadata: {
        language: String, // For snippets
        url: String, // For bookmarks (can duplicate content if needed for indexing)
        tags: [String]
    },
    folder: {
        type: String,
        default: '/' // Root folder
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    annotations: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        text: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Resource', resourceSchema);
