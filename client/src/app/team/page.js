'use client';

import AppLayout from '@/components/AppLayout';
import Header from '@/components/Header';

const developers = [
    {
        name: 'Rishabh Malviya',
        role: 'Full Stack Developer',
        description: 'Frontend & Backend Architect',
        avatar: 'https://github.com/RishabhMalviya75.png',
        skills: ['JavaScript', 'Node.js', 'MongoDB'],
        links: {
            github: 'https://github.com/RishabhMalviya75',
            linkedin: 'https://www.linkedin.com/in/rishabh-malviya-59713b318/',
            email: 'malviyarishabh88@gmail.com',
        },
        gradient: 'linear-gradient(135deg, #FF6B35, #E85D26)',
        glowColor: 'rgba(255, 107, 53, 0.4)',
    },
    {
        name: 'Snehal Kushwaha',
        role: 'Full Stack Developer',
        description: 'Frontend & Backend Engineer',
        avatar: 'https://github.com/http-snehal.png',
        skills: ['React.js', 'Node.js', 'MongoDB'],
        links: {
            github: 'https://github.com/http-snehal',
            linkedin: 'https://www.linkedin.com/in/snehal-kushwah-492a70326/',
            email: 'snehalkushwah24@gmail.com',
        },
        gradient: 'linear-gradient(135deg, #2ECC71, #1ABC9C)',
        glowColor: 'rgba(46, 204, 113, 0.4)',
    },
];

export default function TeamPage() {
    return (
        <AppLayout>
            <Header title="👥 The Guild" subtitle="Meet the adventurers who forged ZenithTrack" />
            <div className="page-content">
                {/* Hero Section */}
                <div className="team-hero animate-fade-in">
                    <div className="team-hero-icon">⚔️</div>
                    <h2 className="team-hero-title">Meet the Developers</h2>
                    <p className="team-hero-subtitle">
                        The brave warriors who brought ZenithTrack to life — transforming tasks into epic quests.
                    </p>
                </div>

                {/* Developers Section */}
                <div className="team-section-label">
                    <span className="team-section-icon">🛡️</span>
                    Developers
                </div>

                <div className="team-grid">
                    {developers.map((dev, index) => (
                        <div
                            key={dev.name}
                            className="team-card glass-card animate-slide-up"
                            style={{
                                animationDelay: `${index * 150}ms`,
                                '--card-gradient': dev.gradient,
                                '--card-glow': dev.glowColor,
                            }}
                        >
                            {/* Decorative top bar */}
                            <div className="team-card-accent" style={{ background: dev.gradient }}></div>

                            {/* Avatar */}
                            <div className="team-avatar-wrapper">
                                <div
                                    className="team-avatar"
                                    style={{ border: `3px solid transparent`, backgroundImage: `${dev.gradient}` }}
                                >
                                    <img
                                        src={dev.avatar}
                                        alt={dev.name}
                                        className="team-avatar-img"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.querySelector('.team-avatar-fallback').style.display = 'flex';
                                        }}
                                    />
                                    <div className="team-avatar-fallback" style={{ display: 'none', background: dev.gradient }}>
                                        {dev.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                </div>
                                <div className="team-avatar-glow" style={{ background: dev.glowColor }}></div>
                            </div>

                            {/* Info */}
                            <h3 className="team-name">{dev.name}</h3>
                            <div className="team-role" style={{ background: dev.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                {dev.role}
                            </div>
                            <p className="team-description">{dev.description}</p>

                            {/* Skills */}
                            <div className="team-skills">
                                {dev.skills.map((skill) => (
                                    <span key={skill} className="team-skill-badge">
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            {/* Social Links */}
                            <div className="team-social-links">
                                <a href={dev.links.github} target="_blank" rel="noopener noreferrer" className="team-social-btn" title="GitHub">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                </a>
                                <a href={dev.links.linkedin} target="_blank" rel="noopener noreferrer" className="team-social-btn" title="LinkedIn">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                </a>
                                <a href={`mailto:${dev.links.email}`} className="team-social-btn" title="Email">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mentor Section */}
                <div className="team-section-label" style={{ marginTop: '48px' }}>
                    <span className="team-section-icon">🧙‍♂️</span>
                    Mentor
                </div>

                <div className="team-mentor-card glass-card animate-fade-in">
                    <div className="team-mentor-inner">
                        <div className="team-mentor-icon">🔮</div>
                        <h3 className="team-mentor-title">Mentor Reveal Coming Soon</h3>
                        <p className="team-mentor-subtitle">
                            The wise sage who guided our adventurers through the realm shall be revealed shortly...
                        </p>
                        <div className="team-mentor-shimmer"></div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ textAlign: 'center', marginTop: '48px', marginBottom: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    <p>Built with 🔥 by the ZenithTrack team</p>
                </div>
            </div>
        </AppLayout>
    );
}
