'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for App Router
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import ResourceBoard from '@/components/workspaces/ResourceBoard';
import QuickCapture from '@/components/workspaces/QuickCapture';
import { Plus, Search, Filter, Settings, ArrowLeft } from 'lucide-react';

export default function WorkspaceDetail({ params }) {
    // Correctly unwrap params using React.use()
    const unwrappedParams = use(params);
    const id = unwrappedParams.id;

    const router = useRouter();
    const { token } = useAuth();
    const [workspace, setWorkspace] = useState(null);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCaptureOpen, setIsCaptureOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        if (id) {
            fetchWorkspaceDetails();
        }
    }, [id]);

    const fetchWorkspaceDetails = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('zenith_token')}` }
            };
            const res = await axios.get(`http://localhost:5000/api/workspaces/${id}`, config);
            setWorkspace(res.data.workspace);
            setResources(res.data.resources);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching workspace:', err);
            setLoading(false);
        }
    };

    const handleResourceAdded = (newResource) => {
        setResources([newResource, ...resources]);
    };

    const filteredResources = resources.filter(res => {
        const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            res.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = activeFilter === 'all' || res.type === activeFilter;
        return matchesSearch && matchesType;
    });

    if (loading) return <div className="page-content">Loading...</div>;
    if (!workspace) return <div className="page-content">Workspace not found</div>;

    return (
        <div className="page-content">
            <header style={{ marginBottom: '32px' }}>
                <button
                    onClick={() => router.back()}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        marginBottom: '16px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    <ArrowLeft size={16} /> Back
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: '800' }}>{workspace.name}</h1>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            style={{
                                padding: '8px 12px',
                                background: 'transparent',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <Settings size={16} /> Settings
                        </button>
                        <button
                            onClick={() => setIsCaptureOpen(true)}
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
                            Quick Capture
                        </button>
                    </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px' }}>
                    {workspace.description}
                </p>
            </header>

            {/* Toolbar */}
            <div className="glass-card" style={{ padding: '16px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search resources..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 10px 10px 36px',
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            color: '#fff',
                            outline: 'none'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
                    {['all', 'note', 'bookmark', 'snippet', 'document'].map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                background: activeFilter === filter ? 'var(--primary-color)' : 'transparent',
                                color: activeFilter === filter ? '#fff' : 'var(--text-secondary)',
                                border: activeFilter === filter ? 'none' : '1px solid var(--border-color)',
                                fontSize: '13px',
                                cursor: 'pointer',
                                textTransform: 'capitalize'
                            }}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Resource Board */}
            <ResourceBoard resources={filteredResources} />

            <QuickCapture
                isOpen={isCaptureOpen}
                onClose={() => setIsCaptureOpen(false)}
                workspaceId={id}
                onResourceAdded={handleResourceAdded}
            />
        </div>
    );
}
