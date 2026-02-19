'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Plus, LayoutGrid, Clock, Users } from 'lucide-react';

export default function WorkspacesDashboard() {
    const { token } = useAuth();
    const router = useRouter();
    const [workspaces, setWorkspaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newWorkspaceName, setNewWorkspaceName] = useState('');
    const [newWorkspaceDesc, setNewWorkspaceDesc] = useState('');

    useEffect(() => {
        fetchWorkspaces();
    }, []);

    const fetchWorkspaces = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('zenith_token')}` }
            };
            const res = await axios.get('http://localhost:5000/api/workspaces', config);
            setWorkspaces(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching workspaces:', err);
            setLoading(false);
        }
    };

    const handleCreateWorkspace = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('zenith_token')}` }
            };
            const res = await axios.post('http://localhost:5000/api/workspaces', {
                name: newWorkspaceName,
                description: newWorkspaceDesc
            }, config);

            setWorkspaces([res.data, ...workspaces]);
            setIsCreateModalOpen(false);
            setNewWorkspaceName('');
            setNewWorkspaceDesc('');
            router.push(`/workspaces/${res.data._id}`);
        } catch (err) {
            console.error('Error creating workspace:', err);
        }
    };

    return (
        <div className="page-content">
            <header className="mb-8 flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
                        Your Workspaces
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Manage your projects, resources, and team collaborations.
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="btn-primary"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        background: 'var(--primary-color)',
                        color: '#fff',
                        borderRadius: '8px',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <Plus size={18} />
                    New Workspace
                </button>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading workspaces...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {workspaces.map(ws => (
                        <div
                            key={ws._id}
                            className="glass-card workspace-card"
                            onClick={() => router.push(`/workspaces/${ws._id}`)}
                            style={{
                                padding: '24px',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, background 0.2s',
                                border: '1px solid var(--border-color)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.borderColor = 'var(--primary-color)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '8px',
                                    background: 'rgba(255, 107, 53, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--accent-sunset)'
                                }}>
                                    <LayoutGrid size={20} />
                                </div>
                                <span style={{
                                    fontSize: '11px',
                                    background: 'var(--bg-tertiary)',
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    color: 'var(--text-muted)'
                                }}>
                                    {new Date(ws.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>
                                {ws.name}
                            </h3>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5', height: '40px', overflow: 'hidden' }}>
                                {ws.description || 'No description provided.'}
                            </p>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                    <Users size={14} />
                                    {ws.members.length} member{ws.members.length !== 1 ? 's' : ''}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                    <Clock size={14} />
                                    Updated recently
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Create New Card (Empty State) */}
                    <div
                        onClick={() => setIsCreateModalOpen(true)}
                        style={{
                            border: '2px dashed var(--border-color)',
                            borderRadius: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            minHeight: '200px',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = 'var(--primary-color)';
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                            e.currentTarget.style.color = 'var(--primary-color)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--text-muted)';
                        }}
                    >
                        <Plus size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                        <span style={{ fontWeight: '600' }}>Create New Workspace</span>
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(5px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="glass-card" style={{ width: '100%', maxWidth: '450px', padding: '32px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Create Workspace</h2>
                        <form onSubmit={handleCreateWorkspace}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Workspace Name</label>
                                <input
                                    type="text"
                                    value={newWorkspaceName}
                                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                                    placeholder="e.g., Growth Engineering"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: 'var(--bg-tertiary)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '32px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Description</label>
                                <textarea
                                    value={newWorkspaceDesc}
                                    onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                                    placeholder="What is this workspace for?"
                                    rows={3}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: 'var(--bg-tertiary)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        outline: 'none',
                                        resize: 'none'
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    style={{
                                        padding: '10px 20px',
                                        background: 'transparent',
                                        color: 'var(--text-secondary)',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        padding: '10px 24px',
                                        background: 'var(--primary-color)',
                                        color: '#fff',
                                        borderRadius: '8px',
                                        border: 'none',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Create Workspace
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
