'use client';

import { useState, useRef } from 'react';
import axios from 'axios';
import { X, Link2, FileText, Code, StickyNote, Image as ImageIcon, Upload } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const resourceTypes = [
    { type: 'note', icon: <StickyNote size={18} />, label: 'Note' },
    { type: 'bookmark', icon: <Link2 size={18} />, label: 'Bookmark' },
    { type: 'snippet', icon: <Code size={18} />, label: 'Snippet' },
    { type: 'document', icon: <FileText size={18} />, label: 'Document' },
    { type: 'image', icon: <ImageIcon size={18} />, label: 'Image' },
];

export default function QuickCapture({ workspaceId, isOpen, onClose, onResourceAdded }) {
    const { token } = useAuth();
    const fileInputRef = useRef(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedType, setSelectedType] = useState('note');
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileName(file.name);
        // Convert to Base64/DataURL for local storage simulation
        const reader = new FileReader();
        reader.onloadend = () => {
            setContent(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('zenith_token')}` }
            };

            const res = await axios.post(`http://localhost:5000/api/workspaces/${workspaceId}/resources`, {
                title,
                content, // This will be text, URL, or DataURL depending on type
                type: selectedType,
                tags: []
            }, config);

            onResourceAdded(res.data);
            onClose();
            setTitle('');
            setContent('');
            setFileName('');
            setSelectedType('note');
        } catch (err) {
            console.error('Error adding resource:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
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
            <div className="glass-card" style={{ width: '100%', maxWidth: '550px', padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Quick Capture</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        <X size={20} />
                    </button>
                </div>

                <div style={{ padding: '20px', display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px' }}>
                    {resourceTypes.map(t => (
                        <button
                            key={t.type}
                            onClick={() => {
                                setSelectedType(t.type);
                                setContent(''); // Reset content when switching types
                                setFileName('');
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 12px',
                                borderRadius: '20px',
                                border: `1px solid ${selectedType === t.type ? 'var(--primary-color)' : 'var(--border-color)'}`,
                                background: selectedType === t.type ? 'rgba(255, 107, 53, 0.1)' : 'transparent',
                                color: selectedType === t.type ? 'var(--primary-color)' : 'var(--text-secondary)',
                                fontSize: '13px',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {t.icon}
                            {t.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '0 20px 20px 20px' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={selectedType === 'document' ? 'Document Name' : 'Title'}
                            required
                            autoFocus
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

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Content</label>

                        {selectedType === 'note' && (
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write your thoughts..."
                                rows={6}
                                required
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
                        )}

                        {selectedType === 'bookmark' && (
                            <input
                                type="url"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="https://example.com"
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    background: 'var(--bg-tertiary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    color: 'var(--accent-sunset)',
                                    outline: 'none'
                                }}
                            />
                        )}

                        {selectedType === 'snippet' && (
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="// Paste your code here..."
                                rows={8}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    background: '#1e1e1e', // Darker background for code
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    color: '#d4d4d4',
                                    fontFamily: 'monospace',
                                    fontSize: '13px',
                                    outline: 'none',
                                    resize: 'none'
                                }}
                            />
                        )}

                        {(selectedType === 'document' || selectedType === 'image') && (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    border: '2px dashed var(--border-color)',
                                    borderRadius: '8px',
                                    padding: '40px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    color: 'var(--text-muted)',
                                    background: fileName ? 'rgba(46, 204, 113, 0.05)' : 'transparent',
                                    borderColor: fileName ? 'var(--accent-emerald)' : 'var(--border-color)'
                                }}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                    accept={selectedType === 'image' ? "image/*" : ".pdf,.doc,.docx,.txt"}
                                />
                                {fileName ? (
                                    <div>
                                        <div style={{ color: 'var(--accent-emerald)', fontWeight: '600', marginBottom: '4px' }}>File Selected</div>
                                        <div style={{ fontSize: '13px' }}>{fileName}</div>
                                    </div>
                                ) : (
                                    <>
                                        <Upload size={24} style={{ marginBottom: '12px', opacity: 0.7 }} />
                                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>Click to upload {selectedType}</div>
                                        <div style={{ fontSize: '12px' }}>Maximum size: 5MB</div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            type="submit"
                            disabled={loading || (selectedType !== 'note' && selectedType !== 'snippet' && !content)}
                            style={{
                                padding: '10px 24px',
                                background: 'var(--primary-color)',
                                color: '#fff',
                                borderRadius: '8px',
                                border: 'none',
                                fontWeight: '600',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Saving...' : 'Save Resource'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
