import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { MessageSquare, User, Send, Clock, CheckCircle, Mail } from 'lucide-react';
import '../../components/AdminLayout.css';

const ChatManager = () => {
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [reply, setReply] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchSessions();

        // Real-time subscription for new sessions
        const sessionSub = supabase
            .channel('admin-sessions')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'chat_sessions' },
                () => fetchSessions()
            )
            .subscribe();

        return () => supabase.removeChannel(sessionSub);
    }, []);

    useEffect(() => {
        if (selectedSession) {
            fetchMessages(selectedSession.id);
            const msgSub = subscribeToMessages(selectedSession.id);
            return () => supabase.removeChannel(msgSub);
        }
    }, [selectedSession]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchSessions = async () => {
        const { data } = await supabase
            .from('chat_sessions')
            .select('*')
            .order('updated_at', { ascending: false });

        if (data) setSessions(data);
        setLoading(false);
    };

    const fetchMessages = async (sid) => {
        const { data } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('session_id', sid)
            .order('created_at', { ascending: true });

        if (data) setMessages(data);
    };

    const subscribeToMessages = (sid) => {
        const subscription = supabase
            .channel(`admin-chat:${sid}`)
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${sid}` },
                (payload) => {
                    setMessages(prev => [...prev, payload.new]);
                    // Mark read if from user
                    if (payload.new.sender_type === 'user') {
                        markAsRead(payload.new.id);
                    }
                }
            )
            .subscribe();

        return subscription;
    };

    const markAsRead = async (msgId) => {
        await supabase.from('chat_messages').update({ is_read: true }).eq('id', msgId);
    };

    const handleSendReply = async (e) => {
        e.preventDefault();
        if (!reply.trim() || !selectedSession) return;

        try {
            const { error } = await supabase.from('chat_messages').insert([{
                session_id: selectedSession.id,
                sender_type: 'admin',
                content: reply,
                is_read: true
            }]);

            if (error) throw error;

            // Update session timestamp
            await supabase.from('chat_sessions')
                .update({ updated_at: new Date().toISOString() })
                .eq('id', selectedSession.id);

            setReply('');
        } catch (error) {
            console.error('Error sending reply:', error);
        }
    };

    return (
        <div className="admin-content" style={{ height: 'calc(100vh - 2rem)', display: 'flex', flexDirection: 'column', padding: 0 }}>
            <div className="admin-header" style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                <div>
                    <h1>Live Chat Support</h1>
                    <p className="admin-subtitle">Real-time communication with visitors</p>
                </div>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Sessions List */}
                <div style={{ width: '300px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', background: 'white' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                        <h3 className="text-sm uppercase text-gray-500 font-semibold">Active Conversations</h3>
                    </div>
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {sessions.length === 0 ? (
                            <p style={{ padding: '1rem', color: '#94a3b8', textAlign: 'center' }}>No active chats</p>
                        ) : (
                            sessions.map(session => (
                                <div
                                    key={session.id}
                                    onClick={() => setSelectedSession(session)}
                                    style={{
                                        padding: '1rem',
                                        borderBottom: '1px solid #f1f5f9',
                                        cursor: 'pointer',
                                        background: selectedSession?.id === session.id ? '#eff6ff' : 'white',
                                        borderLeft: selectedSession?.id === session.id ? '4px solid #1e90ff' : '4px solid transparent'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <span style={{ fontWeight: 600, color: '#1e293b' }}>{session.user_name}</span>
                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                            {new Date(session.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {session.user_email || 'No email provided'}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
                    {selectedSession ? (
                        <>
                            <div style={{ padding: '1rem', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={20} color="#64748b" />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1rem' }}>{selectedSession.user_name}</h3>
                                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{selectedSession.user_email}</span>
                                </div>
                                {selectedSession.user_email && (
                                    <a
                                        href={`mailto:${selectedSession.user_email}?subject=Reply to your chat with Bugisu High School&body=Hi ${selectedSession.user_name},%0D%0A%0D%0A`}
                                        style={{
                                            marginLeft: 'auto',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.5rem 1rem',
                                            background: '#f1f5f9',
                                            borderRadius: '6px',
                                            fontSize: '0.85rem',
                                            color: '#1e40af',
                                            textDecoration: 'none',
                                            fontWeight: 500
                                        }}
                                    >
                                        <Mail size={16} /> Reply via Email
                                    </a>
                                )}
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {messages.map(msg => (
                                    <div
                                        key={msg.id}
                                        style={{
                                            alignSelf: msg.sender_type === 'admin' ? 'flex-end' : 'flex-start',
                                            maxWidth: '70%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: msg.sender_type === 'admin' ? 'flex-end' : 'flex-start'
                                        }}
                                    >
                                        <div style={{
                                            padding: '0.75rem 1rem',
                                            borderRadius: '12px',
                                            background: msg.sender_type === 'admin' ? '#1e90ff' : 'white',
                                            color: msg.sender_type === 'admin' ? 'white' : '#1e293b',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                            borderTopRightRadius: msg.sender_type === 'admin' ? '2px' : '12px',
                                            borderTopLeftRadius: msg.sender_type === 'admin' ? '12px' : '2px'
                                        }}>
                                            {msg.content}
                                        </div>
                                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <div style={{ padding: '1rem', background: 'white', borderTop: '1px solid #e2e8f0' }}>
                                <form onSubmit={handleSendReply} style={{ display: 'flex', gap: '1rem' }}>
                                    <input
                                        type="text"
                                        value={reply}
                                        onChange={(e) => setReply(e.target.value)}
                                        placeholder="Type your reply..."
                                        style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '50px', border: '1px solid #e2e8f0', outline: 'none' }}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!reply.trim()}
                                        className="btn btn-primary"
                                        style={{ borderRadius: '50px', padding: '0 1.5rem' }}
                                    >
                                        <Send size={18} /> Send
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                            <MessageSquare size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <p>Select a conversation to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatManager;
