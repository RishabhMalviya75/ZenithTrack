'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import Header from '@/components/Header';
import { scheduleAPI } from '@/lib/api';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [schedules, setSchedules] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [formData, setFormData] = useState({ title: '', startTime: '', endTime: '', color: '#FF6B35', description: '' });

    useEffect(() => { loadSchedules(); }, [currentDate]);

    const loadSchedules = async () => {
        try {
            const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);
            const { data } = await scheduleAPI.getAll({
                start: start.toISOString(),
                end: end.toISOString()
            });
            setSchedules(data);
        } catch (err) {
            console.error(err);
        }
    };

    const getDaysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const days = [];

        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({ day: daysInPrevMonth - i, currentMonth: false, date: new Date(year, month - 1, daysInPrevMonth - i) });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push({ day: i, currentMonth: true, date: new Date(year, month, i) });
        }

        const remaining = 42 - days.length;
        for (let i = 1; i <= remaining; i++) {
            days.push({ day: i, currentMonth: false, date: new Date(year, month + 1, i) });
        }

        return days;
    };

    const isToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    };

    const getEventsForDate = (date) => {
        return schedules.filter(s => {
            const sDate = new Date(s.startTime);
            return sDate.getDate() === date.getDate() && sDate.getMonth() === date.getMonth() && sDate.getFullYear() === date.getFullYear();
        });
    };

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    const goToday = () => setCurrentDate(new Date());

    const handleCellClick = (date) => {
        setSelectedDate(date);
        const dateStr = date.toISOString().split('T')[0];
        setFormData({
            title: '',
            startTime: `${dateStr}T09:00`,
            endTime: `${dateStr}T10:00`,
            color: '#FF6B35',
            description: ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await scheduleAPI.create({
                title: formData.title,
                startTime: new Date(formData.startTime).toISOString(),
                endTime: new Date(formData.endTime).toISOString(),
                color: formData.color,
                description: formData.description
            });
            setShowModal(false);
            loadSchedules();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteSchedule = async (id) => {
        try {
            await scheduleAPI.delete(id);
            loadSchedules();
        } catch (err) {
            console.error(err);
        }
    };

    // RPG-rarity inspired color options
    const colorOptions = [
        { color: '#FF6B35', label: 'Epic' },
        { color: '#2ECC71', label: 'Uncommon' },
        { color: '#FFD700', label: 'Legendary' },
        { color: '#E74C3C', label: 'Danger' },
        { color: '#9B59B6', label: 'Rare' },
        { color: '#3498DB', label: 'Common' },
        { color: '#1ABC9C', label: 'Mystic' },
    ];

    const days = getDaysInMonth();

    return (
        <AppLayout>
            <Header title="📜 Quest Log" subtitle={`${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`} />
            <div className="page-content">
                {/* Calendar Controls */}
                <div className="flex items-center justify-between mb-24">
                    <div className="flex items-center gap-16">
                        <button className="btn btn-secondary btn-sm springy-btn" onClick={prevMonth}>← Prev</button>
                        <h2 style={{ fontSize: '20px', fontWeight: 700 }}>
                            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <button className="btn btn-secondary btn-sm springy-btn" onClick={nextMonth}>Next →</button>
                    </div>
                    <div className="flex gap-8">
                        <button className="btn btn-ghost btn-sm" onClick={goToday}>⚡ Today</button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="calendar-grid animate-fade-in">
                    {DAYS.map((day) => (
                        <div key={day} className="calendar-header-cell">{day}</div>
                    ))}
                    {days.map((dayObj, i) => {
                        const events = getEventsForDate(dayObj.date);
                        return (
                            <div
                                key={i}
                                className={`calendar-cell ${isToday(dayObj.date) ? 'today' : ''} ${!dayObj.currentMonth ? 'other-month' : ''}`}
                                onClick={() => handleCellClick(dayObj.date)}
                            >
                                <div className="calendar-day-number">{dayObj.day}</div>
                                {events.slice(0, 3).map((ev, j) => (
                                    <div
                                        key={ev._id || j}
                                        className="calendar-event"
                                        style={{ background: `${ev.color}22`, color: ev.color, borderLeft: `3px solid ${ev.color}` }}
                                        onClick={(e) => { e.stopPropagation(); }}
                                        title={`${ev.title} — Double-click to abandon`}
                                        onDoubleClick={() => deleteSchedule(ev._id)}
                                    >
                                        {ev.title}
                                    </div>
                                ))}
                                {events.length > 3 && (
                                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', paddingLeft: '6px' }}>+{events.length - 3} more</div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Create Schedule Modal */}
                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>📜 New Quest Entry</h2>
                                <button className="btn btn-ghost" onClick={() => setShowModal(false)}>✕</button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label className="form-label">Quest Name</label>
                                        <input
                                            className="form-input"
                                            placeholder="e.g., Training Session, Study Quest..."
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    <div className="grid-2">
                                        <div className="form-group">
                                            <label className="form-label">Start Time</label>
                                            <input
                                                type="datetime-local"
                                                className="form-input"
                                                value={formData.startTime}
                                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">End Time</label>
                                            <input
                                                type="datetime-local"
                                                className="form-input"
                                                value={formData.endTime}
                                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Rarity Color</label>
                                        <div className="flex gap-8">
                                            {colorOptions.map((c) => (
                                                <div
                                                    key={c.color}
                                                    onClick={() => setFormData({ ...formData, color: c.color })}
                                                    title={c.label}
                                                    style={{
                                                        width: '32px', height: '32px', borderRadius: '50%', background: c.color,
                                                        cursor: 'pointer', border: formData.color === c.color ? '3px solid #fff' : '3px solid transparent',
                                                        transition: 'all 200ms ease',
                                                        transform: formData.color === c.color ? 'scale(1.15)' : 'scale(1)',
                                                        boxShadow: formData.color === c.color ? `0 0 12px ${c.color}55` : 'none'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Notes (optional)</label>
                                        <textarea
                                            className="form-textarea"
                                            placeholder="Add quest notes..."
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={2}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary springy-btn">📜 Add to Log</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
