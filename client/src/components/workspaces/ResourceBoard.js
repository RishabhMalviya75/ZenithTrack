'use client';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { FileText, Link2, Code, StickyNote, MoreVertical, Image as ImageIcon } from 'lucide-react';

const ResourceItem = ({ resource, id }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        touchAction: 'none'
    };

    const getIcon = (type) => {
        switch (type) {
            case 'bookmark': return <Link2 size={16} className="text-blue-400" />;
            case 'snippet': return <Code size={16} className="text-yellow-400" />;
            case 'note': return <StickyNote size={16} className="text-green-400" />;
            case 'image': return <ImageIcon size={16} className="text-purple-400" />;
            default: return <FileText size={16} className="text-gray-400" />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'bookmark': return 'rgba(52, 152, 219, 0.1)';
            case 'snippet': return 'rgba(241, 196, 15, 0.1)';
            case 'note': return 'rgba(46, 204, 113, 0.1)';
            case 'image': return 'rgba(155, 89, 182, 0.1)';
            default: return 'rgba(255, 255, 255, 0.05)';
        }
    };

    const renderContent = () => {
        if (resource.type === 'image' && resource.content.startsWith('data:image')) {
            return (
                <div style={{
                    height: '120px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    marginBottom: '10px',
                    background: '#000'
                }}>
                    <img src={resource.content} alt={resource.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            );
        }
        if (resource.type === 'bookmark') {
            return (
                <a
                    href={resource.content}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--accent-sunset)', fontSize: '13px', display: 'block', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    onMouseDown={(e) => e.stopPropagation()} // Prevent drag on click
                >
                    {resource.content}
                </a>
            );
        }
        if (resource.type === 'snippet') {
            return (
                <div style={{
                    background: 'rgba(0,0,0,0.3)',
                    padding: '8px',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    color: '#ccc',
                    marginBottom: '8px',
                    height: '60px',
                    overflow: 'hidden'
                }}>
                    {resource.content}
                </div>
            );
        }
        // Default text note
        return (
            <p style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                flex: 1,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                lineHeight: '1.5'
            }}>
                {resource.content}
            </p>
        );
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="glass-card resource-card"
        >
            <div style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div style={{
                        padding: '8px',
                        borderRadius: '8px',
                        background: getTypeColor(resource.type),
                        display: 'inline-flex'
                    }}>
                        {getIcon(resource.type)}
                    </div>
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        <MoreVertical size={16} />
                    </button>
                </div>

                <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {resource.title}
                </h4>

                <div style={{ flex: 1 }}>
                    {renderContent()}
                </div>

                <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
                    <span>{resource.createdBy?.name || 'User'}</span>
                </div>
            </div>
        </div>
    );
};

export default function ResourceBoard({ resources }) {
    const [items, setItems] = useState(resources);
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require 8px movement before drag starts to allow clicks
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setItems((items) => {
                const oldIndex = items.findIndex(item => item._id === active.id);
                const newIndex = items.findIndex(item => item._id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
        setActiveId(null);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items.map(r => r._id)}
                strategy={rectSortingStrategy}
            >
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '20px',
                    padding: '20px 0'
                }}>
                    {items.map(resource => (
                        <ResourceItem key={resource._id} id={resource._id} resource={resource} />
                    ))}
                </div>
            </SortableContext>

            <DragOverlay>
                {activeId ? (
                    <div className="glass-card resource-card" style={{ transform: 'scale(1.05)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
                        <div style={{ padding: '16px' }}>Dragging...</div>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
