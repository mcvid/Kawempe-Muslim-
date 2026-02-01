import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Upload, Trash2, Save, Calendar, Award } from 'lucide-react';
import '../../components/AdminLayout.css';

const AchievementsManager = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [newItem, setNewItem] = useState({
        title: '',
        student_name: '',
        description: '',
        category: 'Academics',
        date: new Date().toISOString().split('T')[0],
        image_url: ''
    });

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('achievements')
                .select('*')
                .order('date', { ascending: false });

            if (error) throw error;
            setAchievements(data || []);
        } catch (error) {
            console.error('Error fetching achievements:', error);
            setMessage({ type: 'error', text: 'Failed to load achievements' });
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            const { data, error } = await supabase
                .from('achievements')
                .insert([newItem])
                .select()
                .single();

            if (error) throw error;

            setAchievements([data, ...achievements]);
            setShowForm(false);
            setNewItem({
                title: '',
                student_name: '',
                description: '',
                category: 'Academics',
                date: new Date().toISOString().split('T')[0],
                image_url: ''
            });
            setMessage({ type: 'success', text: 'Achievement added successfully!' });
        } catch (error) {
            console.error('Error creating achievement:', error);
            setMessage({ type: 'error', text: 'Failed to add achievement' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this achievement?')) return;

        try {
            const { error } = await supabase
                .from('achievements')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setAchievements(achievements.filter(item => item.id !== id));
            setMessage({ type: 'success', text: 'Achievement deleted successfully!' });
        } catch (error) {
            console.error('Error deleting achievement:', error);
            setMessage({ type: 'error', text: 'Failed to delete achievement' });
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `achievements/${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('achievements')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('achievements')
                .getPublicUrl(fileName);

            setNewItem({ ...newItem, image_url: publicUrl });
        } catch (error) {
            console.error('Error uploading image:', error);
            setMessage({ type: 'error', text: 'Failed to upload image' });
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return <div className="admin-content"><div className="admin-loading">Loading...</div></div>;
    }

    return (
        <div className="admin-content">
            <div className="admin-header">
                <div>
                    <h1>Achievements Manager</h1>
                    <p className="admin-subtitle">Manage student success stories</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : <><Plus size={18} /> Add Achievement</>}
                </button>
            </div>

            {message.text && (
                <div className={`alert alert-${message.type}`} style={{ marginBottom: '1.5rem' }}>
                    {message.text}
                </div>
            )}

            {showForm && (
                <div className="admin-card" style={{ marginBottom: '2rem' }}>
                    <h3>Add New Achievement</h3>
                    <form onSubmit={handleCreate}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label>Title *</label>
                                <input
                                    type="text"
                                    value={newItem.title}
                                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                                    className="form-input"
                                    required
                                    placeholder="e.g., National Math Contest Winner"
                                />
                            </div>
                            <div className="form-group">
                                <label>Student Name *</label>
                                <input
                                    type="text"
                                    value={newItem.student_name}
                                    onChange={(e) => setNewItem({ ...newItem, student_name: e.target.value })}
                                    className="form-input"
                                    required
                                    placeholder="e.g., John Doe"
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={newItem.category}
                                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                    className="form-input"
                                >
                                    <option value="Academics">Academics</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Arts">Arts</option>
                                    <option value="Leadership">Leadership</option>
                                    <option value="Community">Community Service</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Date</label>
                                <input
                                    type="date"
                                    value={newItem.date}
                                    onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={newItem.description}
                                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                className="form-input"
                                rows="3"
                                placeholder="Details about the achievement..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Image</label>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="form-input"
                                    style={{ flex: 1 }}
                                />
                                {newItem.image_url && (
                                    <img
                                        src={newItem.image_url}
                                        alt="Preview"
                                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary" disabled={uploading}>
                                <Save size={18} />
                                {uploading ? 'Uploading...' : 'Save Achievement'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="admin-card">
                <h3>Recent Achievements</h3>
                {achievements.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                        <Award size={48} style={{ margin: '0 auto 1rem' }} />
                        <p>No achievements added yet.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Title</th>
                                    <th>Student</th>
                                    <th>Category</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {achievements.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
                                                {item.image_url ? (
                                                    <img src={item.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <Award size={20} style={{ margin: '10px' }} />
                                                )}
                                            </div>
                                        </td>
                                        <td>{item.title}</td>
                                        <td>{item.student_name}</td>
                                        <td>
                                            <span style={{
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '12px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                background: '#eff6ff',
                                                color: '#1e90ff'
                                            }}>
                                                {item.category}
                                            </span>
                                        </td>
                                        <td>{new Date(item.date).toLocaleDateString()}</td>
                                        <td>
                                            <button
                                                className="btn-icon delete"
                                                onClick={() => handleDelete(item.id)}
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AchievementsManager;
