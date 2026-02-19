const Workspace = require('../models/Workspace');

const checkRole = (roles) => {
    return async (req, res, next) => {
        try {
            const workspaceId = req.params.id || req.body.workspaceId;
            if (!workspaceId) {
                return res.status(400).json({ msg: 'Workspace ID is required' });
            }

            const workspace = await Workspace.findById(workspaceId);
            if (!workspace) {
                return res.status(404).json({ msg: 'Workspace not found' });
            }

            // Check if user is owner
            if (workspace.owner.toString() === req.user.id) {
                return next();
            }

            // Check if user is a member with required role
            const member = workspace.members.find(m => m.user.toString() === req.user.id);
            if (!member) {
                return res.status(403).json({ msg: 'Access denied' });
            }

            if (roles.includes(member.role)) {
                return next();
            }

            return res.status(403).json({ msg: 'Insufficient permissions' });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    };
};

module.exports = checkRole;
