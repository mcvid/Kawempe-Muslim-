import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Send, Eye, Edit, Trash2, Calendar, Users, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

const AnnouncementsManager = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        priority: 'normal',
        target_audience: 'all',
        target_classes: [],
        send_sms: false,
        send_push: true,
        expires_at: ''
    });

    const classes = ['Senior 1', 'Senior 2', 'Senior 3', 'Senior 4', 'Senior 5', 'Senior 6'];

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('announcements')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) setAnnouncements(data || []);
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                ...formData,
                status: 'draft'
            };

            if (editingId) {
                await supabase.from('announcements').update(payload).eq('id', editingId);
            } else {
                await supabase.from('announcements').insert([payload]);
            }

            setShowForm(false);
            setEditingId(null);
            setFormData({
                title: '',
                content: '',
                priority: 'normal',
                target_audience: 'all',
                target_classes: [],
                send_sms: false,
                send_push: true,
                expires_at: ''
            });
            fetchAnnouncements();
        } catch (error) {
            alert('Error saving announcement: ' + error.message);
        }
    };

    const handlePublish = async (id) => {
        if (!confirm('Publish this announcement? This will send notifications to the target audience.')) return;

        try {
            // Call the database function to publish and create notifications
            const { error } = await supabase.rpc('publish_announcement', { announcement_uuid: id });

            if (error) throw error;

            alert('Announcement published successfully!');
            fetchAnnouncements();
        } catch (error) {
            alert('Error publishing: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this announcement? This cannot be undone.')) return;

        const { error } = await supabase.from('announcements').delete().eq('id', id);
        if (!error) fetchAnnouncements();
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: '#94a3b8',
            normal: '#3b82f6',
            high: '#f59e0b',
            urgent: '#ef4444'
        };
        return colors[priority] || colors.normal;
    };

    const getStatusBadge = (status) => {
        const badges = {
            draft: { icon: Edit, color: '#6b7280', label: 'Draft' },
            published: { icon: CheckCircle, color: '#22c55e', label: 'Published' },
            scheduled: { icon: Clock, color: '#3b82f6', label: 'Scheduled' },
            expired: { icon: AlertCircle, color: '#94a3b8', label: 'Expired' }
        };
        const badge = badges[status] || badges.draft;
        const Icon = badge.icon;
        return (
            <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '100px',
                background: `${badge.color}15`,
                color: badge.color,
                fontSize: '0.75rem',
                fontWeight: 600
            }}>
                <Icon size={12} />
                {badge.label}
            </span>
        );
    };

    return (
        <div className="admin-manager">
            <div className="admin-header">
                <h1>Announcements</h1>
                <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditingId(null); }}>
                    <Plus size={18} /> New Announcement
                </button>
            </div>

            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal-content" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingId ? 'Edit Announcement' : 'New Announcement'}</h2>
                            <button className="close-modal" onClick={() => setShowForm(false)}>×</button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
                            <div className="form-group">
                                <label>Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., School Closure Notice"
                                />
                            </div>

                            <div className="form-group">
                                <label>Content *</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="Full announcement content..."
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Priority</label>
                                    <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}>
                                        <option value="low">Low</option>
                                        <option value="normal">Normal</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Target Audience</label>
                                    <select value={formData.target_audience} onChange={e => setFormData({ ...formData, target_audience: e.target.value })}>
                                        <option value="all">Everyone</option>
                                        <option value="parents">Parents Only</option>
                                        <option value="students">Students Only</option>
                                        <option value="specific_class">Specific Class</option>
                                    </select>
                                </div>
                            </div>

                            {formData.target_audience === 'specific_class' && (
                                <div className="form-group">
                                    <label>Select Classes</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                                        {classes.map(cls => (
                                            <label key={cls} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.target_classes.includes(cls)}
                                                    onChange={e => {
                                                        if (e.target.checked) {
                                                            setFormData({ ...formData, target_classes: [...formData.target_classes, cls] });
                                                        } else {
                                                            setFormData({ ...formData, target_classes: formData.target_classes.filter(c => c !== cls) });
                                                        }
                                                    }}
                                                />
                                                {cls}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="form-group">
                                <label>Expires On (Optional)</label>
                                <input
                                    type="datetime-local"
                                    value={formData.expires_at}
                                    onChange={e => setFormData({ ...formData, expires_at: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.send_push}
                                        onChange={e => setFormData({ ...formData, send_push: e.target.checked })}
                                    />
                                    Send Push Notification
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.send_sms}
                                        onChange={e => setFormData({ ...formData, send_sms: e.target.checked })}
                                    />
                                    Send SMS (Costs apply)
                                </label>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                    Save as Draft
                                </button>
                                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="admin-content">
                {loading ? (
                    <p>Loading announcements...</p>
                ) : announcements.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                        <AlertCircle size={48} style={{ marginBottom: '1rem' }} />
                        <p>No announcements yet. Create your first one!</p>
                    </div>
                ) : (
                    <div className="admin-list">
                        {announcements.map(ann => (
                            <div key={ann.id} className="admin-list-item" style={{
                                background: 'white',
                                padding: '1.5rem',
                                borderRadius: '12px',
                                marginBottom: '1rem',
                                border: `2px solid ${ann.status === 'published' ? '#22c55e' : '#e5e7eb'}`
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                            <h3 style={{ margin: 0 }}>{ann.title}</h3>
                                            {getStatusBadge(ann.status)}
                                            <span style={{
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                background: `${getPriorityColor(ann.priority)}20`,
                                                color: getPriorityColor(ann.priority),
                                                fontSize: '0.7rem',
                                                fontWeight: 600,
                                                textTransform: 'uppercase'
                                            }}>
                                                {ann.priority}
                                            </span>
                                        </div>
                                        <p style={{ color: '#64748b', margin: '0.5rem 0', lineHeight: 1.5 }}>{ann.content.substring(0, 150)}...</p>
                                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.75rem' }}>
                                            <span><Users size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />{ann.target_audience}</span>
                                            <span><Calendar size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />{format(new Date(ann.created_at), 'MMM dd, yyyy')}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {ann.status === 'draft' && (
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handlePublish(ann.id)}
                                                title="Publish Now"
                                            >
                                                <Send size={16} /> Publish
                                            </button>
                                        )}
                                        <button className="btn btn-icon" onClick={() => { setEditingId(ann.id); setFormData(ann); setShowForm(true); }}>
                                            <Edit size={18} />
                                        </button>
                                        <button className="btn btn-icon delete" onClick={() => handleDelete(ann.id)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div >
    );
};

export default AnnouncementsManager;
