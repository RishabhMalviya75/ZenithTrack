const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const checkRole = require('../middleware/rbac');
const rateLimit = require('express-rate-limit');
const Workspace = require('../models/Workspace');
const Resource = require('../models/Resource');

// Rate limiter for adding resources
const createResourceLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // limit each IP to 50 requests per windowMs
    message: 'Too many resources created from this IP, please try again later'
});

// @route   POST api/workspaces
// @desc    Create a new workspace
// @access  Private
router.post('/', protect, async (req, res) => {
    const { name, description } = req.body;

    try {
        const newWorkspace = new Workspace({
            name,
            description,
            owner: req.user.id,
            members: [{ user: req.user.id, role: 'admin' }]
        });

        const workspace = await newWorkspace.save();
        res.json(workspace);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/workspaces
// @desc    Get all workspaces for the logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const workspaces = await Workspace.find({
            $or: [
                { owner: req.user.id },
                { 'members.user': req.user.id }
            ]
        }).sort({ createdAt: -1 });
        res.json(workspaces);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/workspaces/:id
// @desc    Get workspace details and resources
// @access  Private (Member)
router.get('/:id', protect, checkRole(['admin', 'editor', 'viewer']), async (req, res) => {
    try {
        const workspace = await Workspace.findById(req.params.id)
            .populate('owner', 'name email')
            .populate('members.user', 'name email');

        const resources = await Resource.find({ workspace: req.params.id })
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });

        res.json({ workspace, resources });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/workspaces/:id/resources
// @desc    Add a resource to a workspace
// @access  Private (Admin/Editor)
router.post('/:id/resources', protect, checkRole(['admin', 'editor']), createResourceLimiter, async (req, res) => {
    const { title, type, content, tags, folder } = req.body;

    try {
        const newResource = new Resource({
            workspace: req.params.id,
            title,
            type,
            content,
            metadata: { tags },
            folder: folder || '/',
            createdBy: req.user.id
        });

        const resource = await newResource.save();
        res.json(resource);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/workspaces/:id/members
// @desc    Add a member to workspace
// @access  Private (Admin)
router.put('/:id/members', protect, checkRole(['admin']), async (req, res) => {
    const { userId, role } = req.body;

    try {
        const workspace = await Workspace.findById(req.params.id);

        // Check if user is already a member
        if (workspace.members.some(m => m.user.toString() === userId)) {
            return res.status(400).json({ msg: 'User already a member' });
        }

        workspace.members.push({ user: userId, role });
        await workspace.save();

        res.json(workspace);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
