import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { Save, ArrowLeft } from 'lucide-react';

const EventsEditor = () => {
    const params = useParams();
    const id = params?.id;
    const router = useRouter();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        title: '',
        event_date: '',
        location: '',
        category: 'General',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEditing) fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            const date = new Date(data.event_date);
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
            const formattedDate = date.toISOString().slice(0, 16);

            setFormData({
                ...data,
                event_date: formattedDate
            });
        } catch (err) {
            console.error('Error fetching event:', err);
            setError('Could not load event.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                title: formData.title,
                event_date: new Date(formData.event_date).toISOString(),
                location: formData.location,
                category: formData.category,
                description: formData.description
            };

            if (isEditing) {
                const { error } = await supabase.from('events').update(payload).eq('id', id);
                if (error) throw error;
            } else {
                // Simplified insert without extra select or brackets if possible, although [payload] is standard
                const { error } = await supabase.from('events').insert(payload);
                if (error) throw error;
            }

            router.push('/admin/events');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-page admin-fade-in">
            <div className="admin-header">
                <div>
                    <button onClick={() => router.push('/admin/events')} className="btn btn-icon" style={{ marginBottom: '1rem', color: '#64748b' }}>
                        <ArrowLeft size={20} />
                    </button>
                    <h1>{isEditing ? 'Edit Event' : 'Add Event'}</h1>
                </div>
            </div>

            <div className="admin-form-container" style={{ maxWidth: '600px' }}>
                {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Event Title</label>
                        <input name="title" value={formData.title} onChange={handleChange} required />
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Date & Time</label>
                            <input type="datetime-local" name="event_date" value={formData.event_date} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select name="category" value={formData.category} onChange={handleChange}>
                                <option value="General">General</option>
                                <option value="Academics">Academics</option>
                                <option value="Term Dates">Term Dates</option>
                                <option value="Holiday">Holiday</option>
                                <option value="Exam">Exam</option>
                                <option value="Sports">Sports</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Location</label>
                        <input name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Main Hall" />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={4} />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                        {loading ? 'Saving...' : <><Save size={18} /> Save Event</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EventsEditor;
