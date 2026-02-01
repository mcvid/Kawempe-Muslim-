import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { CheckCircle, XCircle, Clock, Calendar, FileText, User } from 'lucide-react';
import { format } from 'date-fns';

const LeaveRequestsManager = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');

    useEffect(() => {
        fetchRequests();
    }, [filter]);

    const fetchRequests = async () => {
        setLoading(true);
        let query = supabase
            .from('leave_requests')
            .select(`
                *,
                students (
                    student_name,
                    student_reg_number,
                    class_grade,
                    house
                )
            `)
            .order('created_at', { ascending: false });

        if (filter !== 'all') {
            query = query.eq('status', filter);
        }

        const { data, error } = await query;
        if (!error) setRequests(data || []);
        setLoading(false);
    };

    const handleApprove = async (id) => {
        if (!confirm('Approve this leave request?')) return;

        const { error } = await supabase
            .from('leave_requests')
            .update({
                status: 'approved',
                reviewed_at: new Date().toISOString(),
                reviewed_by: 'Admin' // In production, use actual admin name
            })
            .eq('id', id);

        if (!error) {
            alert('Leave request approved!');
            fetchRequests();
        } else {
            alert('Error: ' + error.message);
        }
    };

    const handleReject = async (id) => {
        const notes = prompt('Reason for rejection (optional):');

        const { error } = await supabase
            .from('leave_requests')
            .update({
                status: 'rejected',
                reviewed_at: new Date().toISOString(),
                reviewed_by: 'Admin',
                admin_notes: notes || ''
            })
            .eq('id', id);

        if (!error) {
            alert('Leave request rejected.');
            fetchRequests();
        } else {
            alert('Error: ' + error.message);
        }
    };

    const getStatusBadge = (status) => {
        const config = {
            pending: { icon: Clock, color: '#f59e0b', bg: '#fef3c7', label: 'Pending' },
            approved: { icon: CheckCircle, color: '#22c55e', bg: '#dcfce7', label: 'Approved' },
            rejected: { icon: XCircle, color: '#ef4444', bg: '#fee2e2', label: 'Rejected' }
        };
        const { icon: Icon, color, bg, label } = config[status] || config.pending;

        return (
            <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 12px',
                borderRadius: '100px',
                background: bg,
                color: color,
                fontSize: '0.75rem',
                fontWeight: 600
            }}>
                <Icon size={14} />
                {label}
            </span>
        );
    };

    return (
        <div className="admin-manager">
            <div className="admin-header">
                <h1>Leave Requests</h1>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setFilter('pending')}
                    >
                        Pending ({requests.filter(r => r.status === 'pending').length})
                    </button>
                    <button
                        className={`btn ${filter === 'approved' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setFilter('approved')}
                    >
                        Approved
                    </button>
                    <button
                        className={`btn ${filter === 'rejected' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setFilter('rejected')}
                    >
                        Rejected
                    </button>
                    <button
                        className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                </div>
            </div>

            <div className="admin-content">
                {loading ? (
                    <p>Loading leave requests...</p>
                ) : requests.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                        <FileText size={48} style={{ marginBottom: '1rem' }} />
                        <p>No {filter !== 'all' ? filter : ''} leave requests found.</p>
                    </div>
                ) : (
                    <div className="admin-list">
                        {requests.map(req => (
                            <div key={req.id} className="admin-list-item" style={{
                                background: 'white',
                                padding: '1.5rem',
                                borderRadius: '12px',
                                marginBottom: '1rem',
                                border: '1px solid #e5e7eb'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                            <h3 style={{ margin: 0 }}>{req.students?.student_name || 'Unknown Student'}</h3>
                                            {getStatusBadge(req.status)}
                                        </div>
                                        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
                                            <span><User size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />{req.students?.student_reg_number}</span>
                                            <span>{req.students?.class_grade} • {req.students?.house}</span>
                                        </div>

                                        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                                                <div>
                                                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Leave Type</span>
                                                    <p style={{ margin: '4px 0 0', fontWeight: 500 }}>{req.leave_type}</p>
                                                </div>
                                                <div>
                                                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Duration</span>
                                                    <p style={{ margin: '4px 0 0', fontWeight: 500 }}>
                                                        {format(new Date(req.start_date), 'MMM dd')} - {format(new Date(req.end_date), 'MMM dd, yyyy')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Reason</span>
                                                <p style={{ margin: '4px 0 0', lineHeight: 1.5 }}>{req.reason}</p>
                                            </div>
                                        </div>

                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                            <p style={{ margin: '4px 0' }}><strong>Parent:</strong> {req.parent_name} ({req.parent_contact})</p>
                                            <p style={{ margin: '4px 0' }}><strong>Submitted:</strong> {format(new Date(req.created_at), 'MMM dd, yyyy HH:mm')}</p>
                                            {req.reviewed_at && (
                                                <p style={{ margin: '4px 0' }}><strong>Reviewed:</strong> {format(new Date(req.reviewed_at), 'MMM dd, yyyy HH:mm')} by {req.reviewed_by}</p>
                                            )}
                                            {req.admin_notes && (
                                                <p style={{ margin: '8px 0 0', padding: '8px', background: '#fee2e2', borderRadius: '4px', color: '#991b1b' }}>
                                                    <strong>Admin Notes:</strong> {req.admin_notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {req.status === 'pending' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginLeft: '1rem' }}>
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleApprove(req.id)}
                                                style={{ background: '#22c55e', borderColor: '#22c55e', whiteSpace: 'nowrap' }}
                                            >
                                                <CheckCircle size={16} /> Approve
                                            </button>
                                            <button
                                                className="btn btn-outline btn-sm"
                                                onClick={() => handleReject(req.id)}
                                                style={{ color: '#ef4444', borderColor: '#ef4444', whiteSpace: 'nowrap' }}
                                            >
                                                <XCircle size={16} /> Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaveRequestsManager;
