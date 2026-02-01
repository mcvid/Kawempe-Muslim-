import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Settings, MessageSquare, Trash2, Mail, Phone, MapPin, CheckCircle, Clock } from 'lucide-react';

const ContactManager = () => {
    const [activeTab, setActiveTab] = useState('settings');
    const [settings, setSettings] = useState({});
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const [s, m] = await Promise.all([
            supabase.from('contact_settings').select('*').single(),
            supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
        ]);

        if (s.data) setSettings(s.data);
        setMessages(m.data || []);
        setLoading(false);
    };

    const handleSaveSettings = async () => {
        const { error } = await supabase
            .from('contact_settings')
            .update(settings)
            .eq('id', settings.id);

        if (error) alert('Error saving settings: ' + error.message);
        else alert('Contact settings updated successfully');
    };

    const updateMessageStatus = async (id, status) => {
        const { error } = await supabase.from('contact_messages').update({ status }).eq('id', id);
        if (error) alert(error.message);
        else fetchData();
    };

    const handleDeleteMessage = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        const { error } = await supabase.from('contact_messages').delete().eq('id', id);
        if (error) alert(error.message);
        else fetchData();
    };

    const renderSettingsTab = () => (
        <div className="admin-form-card" style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eee' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>School Contact Information</h3>
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Physical Address</label>
                    <textarea
                        value={settings.address || ''}
                        onChange={e => setSettings({ ...settings, address: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                    />
                </div>
                <div className="form-group">
                    <label>Main Phone Number</label>
                    <input type="text" value={settings.phone_main || ''} onChange={e => setSettings({ ...settings, phone_main: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>
                <div className="form-group">
                    <label>Admissions Phone</label>
                    <input type="text" value={settings.phone_admissions || ''} onChange={e => setSettings({ ...settings, phone_admissions: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>
                <div className="form-group">
                    <label>General Email</label>
                    <input type="email" value={settings.email_general || ''} onChange={e => setSettings({ ...settings, email_general: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>
                <div className="form-group">
                    <label>Admissions Email</label>
                    <input type="email" value={settings.email_admissions || ''} onChange={e => setSettings({ ...settings, email_admissions: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>
                <div className="form-group">
                    <label>Office Hours</label>
                    <input type="text" value={settings.office_hours || ''} onChange={e => setSettings({ ...settings, office_hours: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>
                <div className="form-group">
                    <label>Google Maps Embed URL (Iframe src)</label>
                    <input type="text" value={settings.map_embed_url || ''} onChange={e => setSettings({ ...settings, map_embed_url: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>
            </div>
            <button className="btn btn-primary" onClick={handleSaveSettings} style={{ marginTop: '2rem' }}>
                <Save size={18} /> Save Contact Details
            </button>
        </div>
    );

    return (
        <div className="admin-manager contact-manager">
            <div className="admin-header" style={{ marginBottom: '2rem' }}>
                <h1>Contact & Inquiries</h1>
            </div>

            <div className="admin-tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('settings')}>
                    <Settings size={18} /> Settings
                </button>
                <button className={`btn ${activeTab === 'inbox' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('inbox')}>
                    <MessageSquare size={18} /> Inbox ({messages.filter(m => m.status === 'Unread').length})
                </button>
            </div>

            {loading ? <p>Loading...</p> : (
                <div className="admin-content">
                    {activeTab === 'settings' && renderSettingsTab()}

                    {activeTab === 'inbox' && (
                        <div className="admin-list">
                            {messages.length === 0 ? <p>No messages yet.</p> : (
                                messages.map(msg => (
                                    <div key={msg.id} className="admin-list-item" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eee', marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                                    <h3 style={{ margin: 0 }}>{msg.name}</h3>
                                                    <span style={{
                                                        fontSize: '0.75rem',
                                                        padding: '2px 10px',
                                                        borderRadius: '100px',
                                                        background: msg.status === 'Unread' ? '#fff1f2' : '#f0f9ff',
                                                        color: msg.status === 'Unread' ? '#e11d48' : '#0369a1',
                                                        border: `1px solid ${msg.status === 'Unread' ? '#fecdd3' : '#bae6fd'}`
                                                    }}>
                                                        {msg.status}
                                                    </span>
                                                </div>
                                                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
                                                    <Mail size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {msg.email}
                                                </p>
                                            </div>
                                            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.8rem' }}>
                                                {new Date(msg.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Subject: {msg.subject}</strong>
                                            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', color: '#334155' }}>
                                                {msg.message}
                                            </div>
                                        </div>
                                        <div className="actions" style={{ display: 'flex', gap: '1rem' }}>
                                            {msg.status === 'Unread' && (
                                                <button className="btn btn-outline" onClick={() => updateMessageStatus(msg.id, 'Read')}>
                                                    <CheckCircle size={18} /> Mark Read
                                                </button>
                                            )}
                                            <button className="btn btn-icon delete" onClick={() => handleDeleteMessage(msg.id)}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ContactManager;
