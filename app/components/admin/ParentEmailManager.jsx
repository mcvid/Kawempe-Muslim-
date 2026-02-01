import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, Send, Users, CheckCircle } from 'lucide-react';
import { sendPortalReminderEmail, sendBulkPortalReminders } from '../../utils/emailService';

const ParentEmailManager = () => {
    const [students, setStudents] = useState([]);
    const [selectedParents, setSelectedParents] = useState([]);
    const [sending, setSending] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        const { data } = await supabase
            .from('students')
            .select('id, student_name, parent_name, parent_email, parent_phone')
            .order('student_name');

        setStudents(data || []);
    };

    const sendReminders = async () => {
        if (selectedParents.length === 0) {
            alert('Please select at least one parent');
            return;
        }

        if (!confirm(`Send portal reminder to ${selectedParents.length} parent(s)?`)) return;

        setSending(true);
        setResult(null);

        try {
            const parentsList = students
                .filter(s => selectedParents.includes(s.id))
                .map(s => ({
                    parent_name: s.parent_name,
                    parent_email: s.parent_email,
                    student_name: s.student_name
                }));

            const bulkResult = await sendBulkPortalReminders(parentsList);

            setResult({
                success: true,
                message: `Successfully sent ${bulkResult.totalSent} reminder emails!`
            });

            setSelectedParents([]);
        } catch (error) {
            setResult({
                success: false,
                message: 'Error sending emails: ' + error.message
            });
        } finally {
            setSending(false);
        }
    };

    const sendToAll = async () => {
        const allParentIds = students.map(s => s.id);
        setSelectedParents(allParentIds);
    };

    const toggleParent = (id) => {
        setSelectedParents(prev =>
            prev.includes(id)
                ? prev.filter(p => p !== id)
                : [...prev, id]
        );
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Mail size={32} color="var(--color-orange)" />
                    Parent Portal Reminders
                </h1>
                <p style={{ color: '#6b7280' }}>
                    Send portal access reminders to parents who haven't logged in yet.
                </p>
            </div>

            {result && (
                <div style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    background: result.success ? '#dcfce7' : '#fee2e2',
                    border: `1px solid ${result.success ? '#22c55e' : '#ef4444'}`,
                    color: result.success ? '#166534' : '#991b1b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    {result.success && <CheckCircle size={20} />}
                    {result.message}
                </div>
            )}

            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0 }}>Select Recipients</h3>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            className="btn btn-outline btn-sm"
                            onClick={sendToAll}
                        >
                            <Users size={16} /> Select All
                        </button>
                        <button
                            className="btn btn-outline btn-sm"
                            onClick={() => setSelectedParents([])}
                        >
                            Clear All
                        </button>
                    </div>
                </div>

                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {students.map(student => (
                        <label
                            key={student.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                                marginBottom: '0.5rem'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                            <input
                                type="checkbox"
                                checked={selectedParents.includes(student.id)}
                                onChange={() => toggleParent(student.id)}
                                style={{ marginRight: '1rem' }}
                            />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, color: '#1f2937' }}>{student.parent_name || 'Unknown Parent'}</div>
                                <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                                    {student.student_name} • {student.parent_email || 'No email'}
                                </div>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button
                    className="btn btn-primary"
                    onClick={sendReminders}
                    disabled={sending || selectedParents.length === 0}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        opacity: (sending || selectedParents.length === 0) ? 0.5 : 1
                    }}
                >
                    <Send size={18} />
                    {sending ? 'Sending...' : `Send Reminders (${selectedParents.length})`}
                </button>

                <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                    {selectedParents.length} parent{selectedParents.length !== 1 ? 's' : ''} selected
                </span>
            </div>
        </div>
    );
};

export default ParentEmailManager;
