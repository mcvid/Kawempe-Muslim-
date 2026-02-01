import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { MessageSquare, ThumbsUp, HelpCircle, AlertTriangle, Search, CheckCircle, Clock } from 'lucide-react';

const FeedbackManager = () => {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, general, q_and_a, complaint

    useEffect(() => {
        fetchFeedback();
    }, []);

    const fetchFeedback = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('feedback')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setFeedback(data);
        setLoading(false);
    };

    const updateStatus = async (id, newStatus) => {
        const { error } = await supabase
            .from('feedback')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) alert('Error updating status');
        else fetchFeedback();
    };

    const getIcon = (type) => {
        switch (type) {
            case 'general': return <ThumbsUp size={18} color="#3b82f6" />;
            case 'q_and_a': return <HelpCircle size={18} color="#eab308" />;
            case 'complaint': return <AlertTriangle size={18} color="#ef4444" />;
            default: return <MessageSquare size={18} />;
        }
    };

    const filteredFeedback = filter === 'all'
        ? feedback
        : feedback.filter(item => item.type === filter);

    return (
        <div className="admin-manager">
            <div className="admin-header">
                <h1>Feedback & Q&A</h1>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`btn ${filter === 'general' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setFilter('general')}
                    >
                        Suggestions
                    </button>
                    <button
                        className={`btn ${filter === 'q_and_a' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setFilter('q_and_a')}
                    >
                        Q&A
                    </button>
                    <button
                        className={`btn ${filter === 'complaint' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setFilter('complaint')}
                    >
                        Issues
                    </button>
                </div>
            </div>

            <div className="admin-content">
                {loading ? <p>Loading...</p> : (
                    <div className="admin-list">
                        {filteredFeedback.length === 0 ? <p className="text-gray-500">No items found.</p> : (
                            filteredFeedback.map(item => (
                                <div key={item.id} className="admin-list-item" style={{
                                    background: 'white',
                                    padding: '1.5rem',
                                    borderRadius: '8px',
                                    border: '1px solid #eee',
                                    marginBottom: '1rem',
                                    borderLeft: `4px solid ${item.type === 'complaint' ? '#ef4444' :
                                            item.type === 'q_and_a' ? '#eab308' : '#3b82f6'
                                        }`
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                                {getIcon(item.type)}
                                                <span style={{
                                                    textTransform: 'uppercase',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold',
                                                    color: '#64748b',
                                                    letterSpacing: '0.5px'
                                                }}>
                                                    {item.type.replace(/_/g, ' ')}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(item.created_at).toLocaleString()}
                                                </span>
                                            </div>

                                            <p style={{ fontSize: '1.1rem', margin: '0.5rem 0 1rem', color: '#1e293b', lineHeight: '1.5' }}>
                                                {item.message}
                                            </p>

                                            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
                                                <span><strong>From:</strong> {item.name || 'Anonymous'}</span>
                                                {item.email && <span><strong>Email:</strong> {item.email}</span>}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                            <div>
                                                <span className={`status-badge ${item.status === 'new' ? 'pending' : 'accepted'}`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                            {item.status === 'new' && (
                                                <button
                                                    className="btn btn-outline btn-sm"
                                                    onClick={() => updateStatus(item.id, 'reviewed')}
                                                >
                                                    <CheckCircle size={16} /> Mark Reviewed
                                                </button>
                                            )}
                                            {item.email && (
                                                <a
                                                    href={`mailto:${item.email}?subject=RE: Bugisu High School Feedback`}
                                                    className="btn btn-primary btn-sm"
                                                >
                                                    Reply
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedbackManager;
