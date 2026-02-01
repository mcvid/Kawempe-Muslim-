import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Save, X, Bell, Calendar, Clock, AlertCircle } from 'lucide-react';

const AlertsManager = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        message: '',
        target_date: '',
        target_label: 'Countdown:',
        is_active: false,
        type: 'info'
    });

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('site_alerts')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setAlerts(data);
        setLoading(false);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            target_date: formData.target_date || null
        };

        if (editingId) {
            const { error } = await supabase
                .from('site_alerts')
                .update(payload)
                .eq('id', editingId);
            if (error) alert(error.message);
        } else {
            const { error } = await supabase
                .from('site_alerts')
                .insert([payload]);
            if (error) alert(error.message);
        }

        setEditingId(null);
        setIsAdding(false);
        setFormData({ message: '', target_date: '', target_label: 'Countdown:', is_active: false, type: 'info' });
        fetchAlerts();
    };

    const handleEdit = (alert) => {
        setEditingId(alert.id);
        setFormData({
            message: alert.message,
            target_date: alert.target_date ? new Date(alert.target_date).toISOString().slice(0, 16) : '',
            target_label: alert.target_label,
            is_active: alert.is_active,
            type: alert.type
        });
        setIsAdding(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this alert?')) return;
        const { error } = await supabase.from('site_alerts').delete().eq('id', id);
        if (error) alert(error.message);
        else fetchAlerts();
    };

    const toggleActive = async (id, currentStatus) => {
        const { error } = await supabase
            .from('site_alerts')
            .update({ is_active: !currentStatus })
            .eq('id', id);
        if (error) alert(error.message);
        else fetchAlerts();
    };

    return (
        <div className="admin-page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>Site Alerts & Notifications</h1>
                    <p style={{ color: '#666' }}>Manage high-priority notifications and countdown timers that appear in the navbar.</p>
                </div>
                {!isAdding && (
                    <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
                        <Plus size={18} /> New Alert
                    </button>
                )}
            </div>

            {isAdding && (
                <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eee', marginBottom: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <h2>{editingId ? 'Edit Alert' : 'Create New Alert'}</h2>
                        <button onClick={() => { setIsAdding(false); setEditingId(null); }} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={24} /></button>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Alert Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                required
                                placeholder="e.g. Term One Visitation Day is here!"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd', minHeight: '80px' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Target Date (Optional)</label>
                                <input
                                    type="datetime-local"
                                    name="target_date"
                                    value={formData.target_date}
                                    onChange={handleInputChange}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Countdown Label</label>
                                <input
                                    type="text"
                                    name="target_label"
                                    value={formData.target_label}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Visitation Starts In:"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Alert Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd' }}
                                >
                                    <option value="info">Info (Default)</option>
                                    <option value="urgent">Urgent (Red)</option>
                                    <option value="event">Event (Blue)</option>
                                    <option value="success">Success (Green)</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    id="is_active"
                                    checked={formData.is_active}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="is_active" style={{ fontWeight: 600 }}>Set as Active</label>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                <Save size={18} /> {editingId ? 'Update Alert' : 'Publish Alert'}
                            </button>
                            <button type="button" className="btn btn-outline" onClick={() => { setIsAdding(false); setEditingId(null); }}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="admin-list" style={{ display: 'grid', gap: '1rem' }}>
                {loading && alerts.length === 0 ? <p>Loading alerts...</p> : alerts.length === 0 ? <p>No alerts created yet.</p> : (
                    alerts.map(alert => (
                        <div key={alert.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: `2px solid ${alert.is_active ? '#f97316' : '#eee'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: '#333', color: 'white', textTransform: 'uppercase' }}>
                                        {alert.type}
                                    </span>
                                    {alert.is_active && <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> ACTIVE ON SITE</span>}
                                </div>
                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{alert.message}</h3>
                                <div style={{ display: 'flex', gap: '1.5rem', color: '#666', fontSize: '0.9rem' }}>
                                    {alert.target_date && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Calendar size={14} />
                                            {alert.target_label} {new Date(alert.target_date).toLocaleString()}
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Clock size={14} /> Created {new Date(alert.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className={`btn btn-sm ${alert.is_active ? 'btn-outline' : 'btn-primary'}`} onClick={() => toggleActive(alert.id, alert.is_active)}>
                                    {alert.is_active ? 'Deactivate' : 'Activate'}
                                </button>
                                <button className="btn btn-outline btn-sm" onClick={() => handleEdit(alert)}>Edit</button>
                                <button className="btn btn-outline btn-sm" onClick={() => handleDelete(alert.id)} style={{ color: '#dc2626' }}><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AlertsManager;
