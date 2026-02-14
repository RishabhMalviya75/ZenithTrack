require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Task = require('./models/Task');
const Schedule = require('./models/Schedule');
const Progress = require('./models/Progress');

const seedData = async () => {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    await Schedule.deleteMany({});
    await Progress.deleteMany({});

    console.log('Cleared existing data');

    // Create demo user
    const user = await User.create({
        name: 'Alex Rivera',
        email: 'alex@zenithtrack.com',
        password: 'password123',
        type: 'Developer'
    });

    console.log(`Created user: ${user.email}`);

    // Create tasks
    const tasks = await Task.insertMany([
        { userId: user._id, title: 'Set up project architecture', description: 'Design and implement the base project structure', duration: 120, status: 'Complete', category: 'one-off', priority: 'high', completedAt: new Date(Date.now() - 6 * 86400000) },
        { userId: user._id, title: 'Daily standup review', description: 'Review yesterday\'s progress and plan today', duration: 15, status: 'Complete', category: 'habit', priority: 'medium', completedAt: new Date(Date.now() - 86400000) },
        { userId: user._id, title: 'Implement user authentication', description: 'JWT-based auth with registration and login', duration: 180, status: 'In Progress', category: 'milestone', priority: 'critical', subtasks: [{ title: 'Design auth schema', completed: true }, { title: 'Implement JWT middleware', completed: true }, { title: 'Build login/register endpoints', completed: false }, { title: 'Add password reset flow', completed: false }] },
        { userId: user._id, title: 'Code review: PR #42', description: 'Review pull request for new dashboard feature', duration: 45, status: 'Pending', category: 'one-off', priority: 'high', dueDate: new Date(Date.now() + 86400000) },
        { userId: user._id, title: 'Morning meditation', description: '10 minutes of mindfulness', duration: 10, status: 'Complete', category: 'habit', priority: 'low', completedAt: new Date() },
        { userId: user._id, title: 'Build REST API endpoints', description: 'CRUD operations for all models', duration: 240, status: 'Pending', category: 'milestone', priority: 'critical', subtasks: [{ title: 'Tasks API', completed: false }, { title: 'Schedule API', completed: false }, { title: 'Analytics API', completed: false }] },
        { userId: user._id, title: 'Write unit tests', description: 'Cover auth and task modules with tests', duration: 90, status: 'Pending', category: 'one-off', priority: 'medium', dueDate: new Date(Date.now() + 3 * 86400000) },
        { userId: user._id, title: 'Read technical article', description: 'Stay updated with latest web dev trends', duration: 30, status: 'Pending', category: 'habit', priority: 'low' },
        { userId: user._id, title: 'Deploy to staging', description: 'Docker containerization and staging deployment', duration: 60, status: 'Pending', category: 'one-off', priority: 'high', dueDate: new Date(Date.now() + 5 * 86400000) },
        { userId: user._id, title: 'Design system documentation', description: 'Document color palette, typography, and component library', duration: 120, status: 'Pending', category: 'milestone', priority: 'medium', subtasks: [{ title: 'Colors & typography', completed: false }, { title: 'Component specs', completed: false }, { title: 'Usage guidelines', completed: false }] }
    ]);

    console.log(`Created ${tasks.length} tasks`);

    // Create schedule blocks
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const schedules = await Schedule.insertMany([
        { userId: user._id, taskId: tasks[1]._id, title: 'Daily Standup', startTime: new Date(today.getTime() + 9 * 3600000), endTime: new Date(today.getTime() + 9.25 * 3600000), isRecurring: true, color: '#10b981' },
        { userId: user._id, taskId: tasks[2]._id, title: 'Auth Implementation', startTime: new Date(today.getTime() + 10 * 3600000), endTime: new Date(today.getTime() + 13 * 3600000), color: '#f43f5e' },
        { userId: user._id, taskId: tasks[3]._id, title: 'Code Review', startTime: new Date(today.getTime() + 14 * 3600000), endTime: new Date(today.getTime() + 15 * 3600000), color: '#f59e0b' },
        { userId: user._id, title: 'Lunch Break', startTime: new Date(today.getTime() + 13 * 3600000), endTime: new Date(today.getTime() + 14 * 3600000), color: '#8b5cf6' },
        { userId: user._id, taskId: tasks[5]._id, title: 'API Development', startTime: new Date(today.getTime() + 15 * 3600000), endTime: new Date(today.getTime() + 18 * 3600000), color: '#3b82f6' }
    ]);

    console.log(`Created ${schedules.length} schedule blocks`);

    // Create progress data (last 30 days)
    const progressEntries = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const total = Math.floor(Math.random() * 6) + 3;
        const completed = Math.floor(Math.random() * (total + 1));

        progressEntries.push({
            userId: user._id,
            date,
            completionRate: Math.round((completed / total) * 100),
            tasksCompleted: completed,
            totalTasks: total,
            focusMinutes: Math.floor(Math.random() * 180) + 30,
            value: completed * 10
        });
    }

    await Progress.insertMany(progressEntries);
    console.log(`Created ${progressEntries.length} progress entries`);

    console.log('\n✅ Seed data complete!');
    console.log('Demo login: alex@zenithtrack.com / password123');
    process.exit(0);
};

seedData().catch(err => {
    console.error(err);
    process.exit(1);
});
