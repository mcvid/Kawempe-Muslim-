import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash2 } from 'lucide-react';

const EventsList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('event_date', { ascending: false });

            if (error) throw error;
            setEvents(data || []);
        } catch (error) {
            console.error('Error loading events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;

        try {
            const { error } = await supabase.from('events').delete().eq('id', id);
            if (error) throw error;
            setEvents(events.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Failed to delete event.');
        }
    };

    return (
        <div className="admin-page admin-fade-in">
            <div className="admin-header">
                <h1>Manage Events</h1>
                <Link to="/admin/events/new" className="btn btn-primary">
                    <Plus size={18} /> Add Event
                </Link>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Event Title</th>
                            <th>Date & Time</th>
                            <th>Location</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</td></tr>
                        ) : events.length === 0 ? (
                            <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center' }}>No events found.</td></tr>
                        ) : (
                            events.map((event) => (
                                <tr key={event.id}>
                                    <td style={{ fontWeight: '500' }}>{event.title}</td>
                                    <td style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                                        {new Date(event.event_date).toLocaleString()}
                                    </td>
                                    <td style={{ color: '#6b7280' }}>{event.location}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                            <Link to={`/admin/events/edit/${event.id}`} className="btn-icon" style={{ padding: '6px', color: '#4b5563' }}><Edit size={18} /></Link>
                                            <button
                                                onClick={() => handleDelete(event.id)}
                                                className="btn-icon"
                                                style={{ padding: '6px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EventsList;
