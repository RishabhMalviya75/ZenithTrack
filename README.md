🚀 ZenithTrack: Reach Your Peak
ZenithTrack is an advanced Performance & Growth Management platform designed to bridge the gap between daily execution and long-term mastery. Whether you are a Student managing coursework, a Sportsman tracking training drills, or a Software Employee handling sprints, ZenithTrack visualizes your journey to the top.

🌟 The Zenith Strategy
Most productivity apps are just lists. ZenithTrack is an ecosystem:

Assign: Manually define tasks tailored to your specific persona.

Align: Sync tasks directly with a built-in, Google-style Calendar.

Alert: Stay on track with a dual-layer system of Notifications and Hard Alarms.

Analyze: Watch your "Growth Output" materialize on monthly progress graphs.

🛠️ Core Features
Persona-Driven Workflows: * 🎓 Students: Semester tracking, assignment deadlines, and study blocks.

🏆 Sportsmen: Workout logs, recovery tracking, and skill-drill consistency.

💻 Software Employees: Coding streaks, Jira-style task states, and deep-work sessions.

Intelligent Calendar: A drag-and-drop interface that aligns your "To-Do" list with your "Time-Table."

Growth Analytics: Monthly charts using Chart.js that map your completion rate and intensity.

Fail-Safe Reminders: * Standard: Push notifications for upcoming tasks.

Critical: High-decibel alarms for non-negotiable milestones.

💻 Tech Stack
Frontend: React.js / Next.js (Tailwind CSS for sleek, dark-mode UI)

Backend: Node.js & Express.js

Database: MongoDB (using Mongoose for schema modeling)

Real-time: Firebase Cloud Messaging (FCM) for cross-device alerts

Visualization: Recharts / Chart.js

📂 Architecture
Plaintext
ZenithTrack/
├── client/                # React Frontend (Vite/Next)
│   ├── src/components/    # Calendar, Charts, TaskCards
│   └── src/hooks/         # Custom logic for Alarms/Timers
├── server/                # Node.js Backend
│   ├── models/            # User, Task, and Analytics schemas
│   ├── controllers/       # Growth calculation logic
│   └── utils/             # Notification & Alarm triggers
└── docs/                  # API Documentation
🚀 Getting Started
Prerequisites
Node.js (v18+)

MongoDB Atlas Account

Firebase Project (for Cloud Messaging)

Installation
Clone: git clone https://github.com/your-username/ZenithTrack.git

Install: npm install in both /client and /server.

Env Setup: Create a .env with your MONGO_URI and JWT_SECRET.

Launch: Use npm run dev to start the development environment.

📈 Roadmap
[ ] Beta: Manual Task & Calendar Sync.

[ ] v1.1: Monthly Growth Graphs & Analytics Engine.

[ ] v1.2: System-level Alarm integration for Mobile.

[ ] v2.0: AI-powered schedule optimization based on past performance.
