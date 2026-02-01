import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

const NewsList = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('news')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setNews(data || []);
        } catch (error) {
            console.error('Error loading news:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this news item?')) return;

        try {
            const { error } = await supabase
                .from('news')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setNews(news.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error deleting news:', error);
            alert('Failed to delete news item.');
        }
    };

    return (
        <div className="admin-page admin-fade-in">
            <div className="admin-header">
                <h1>Manage News</h1>
                <Link to="/admin/news/new" className="btn btn-primary">
                    <Plus size={18} /> Create New
                </Link>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading...</td>
                            </tr>
                        ) : news.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No news items found.</td>
                            </tr>
                        ) : (
                            news.map((item) => (
                                <tr key={item.id}>
                                    <td style={{ fontWeight: '500' }}>{item.title}</td>
                                    <td style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                                        {new Date(item.published_at || item.created_at).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <span className={`status-badge ${item.is_published ? 'published' : 'Draft'}`}>
                                            {item.is_published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                            <Link to={`/admin/news/edit/${item.id}`} className="btn-icon" style={{ padding: '6px', color: '#4b5563' }}>
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(item.id)}
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

export default NewsList;
