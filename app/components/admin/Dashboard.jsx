import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, FileText, MessageSquare, Megaphone, Calendar, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [stats, setStats] = useState({
        pendingApps: 0,
        pendingInquiries: 0,
        unreadMessages: 0,
        totalNews: 0,
        upcomingEvents: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const [apps, inqs, msgs, news, events] = await Promise.all([
                    supabase.from('admission_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
                    supabase.from('admissions_inquiries').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
                    supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'Unread'),
                    supabase.from('news_articles').select('*', { count: 'exact', head: true }),
                    supabase.from('events').select('*', { count: 'exact', head: true }).gte('event_date', new Date().toISOString())
                ]);

                setStats({
                    pendingApps: apps.count || 0,
                    pendingInquiries: inqs.count || 0,
                    unreadMessages: msgs.count || 0,
                    totalNews: news.count || 0,
                    upcomingEvents: events.count || 0
                });
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const ActionCard = ({ title, count, icon, path, color }) => (
        <Link to={path} className="dashboard-action-card">
            <div className="card-content" style={{ borderLeft: `6px solid ${color}` }}>
                <div className="card-text">
                    <h3 className="card-title">{title}</h3>
                    <div className="card-value-wrapper">
                        <p className="card-count">{count}</p>
                        {count > 0 && <span className="card-badge">NEW</span>}
                    </div>
                </div>
                <div className="card-icon-wrapper" style={{ background: `${color}15`, color: color }}>
                    {icon}
                </div>
            </div>
        </Link>
    );

    return (
        <div className="dashboard-page admin-fade-in">
            <header className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <p>Welcome back! Here's what needs your attention today.</p>
            </header>

            {/* Pending Actions Section */}
            <div className="dashboard-section">
                <h2 className="section-title text-danger">
                    <AlertCircle size={20} /> Pending Actions
                </h2>
                <div className="admin-grid admin-grid-3">
                    <ActionCard
                        title="New Admissions"
                        count={stats.pendingApps}
                        icon={<Users size={28} />}
                        path="/admin/admissions"
                        color="#2563eb"
                    />
                    <ActionCard
                        title="Admissions Inquiries"
                        count={stats.pendingInquiries}
                        icon={<MessageSquare size={28} />}
                        path="/admin/admissions"
                        color="#f59e0b"
                    />
                    <ActionCard
                        title="Unread Messages"
                        count={stats.unreadMessages}
                        icon={<Mail size={28} />}
                        path="/admin/contact"
                        color="#10b981"
                    />
                </div>
            </div>

            {/* Overview Stats */}
            <div className="dashboard-section">
                <h2 className="section-title">Site Overview</h2>
                <div className="admin-grid admin-grid-2">
                    <div className="stat-card">
                        <div className="stat-header">
                            <FileText size={20} />
                            <span>News Articles</span>
                        </div>
                        <p className="stat-value">{stats.totalNews}</p>
                    </div>
                    <div className="stat-card">
                        <div className="stat-header">
                            <Calendar size={20} />
                            <span>Upcoming Events</span>
                        </div>
                        <p className="stat-value">{stats.upcomingEvents}</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-quick-actions">
                <h2 className="section-title">Quick Actions</h2>
                <div className="btn-group">
                    <Link to="/admin/news" className="btn btn-primary btn-admin">
                        <Plus size={18} /> Post News
                    </Link>
                    <Link to="/admin/events" className="btn btn-outline btn-admin">
                        <Calendar size={18} /> Add Event
                    </Link>
                    <Link to="/admin/announcements" className="btn btn-outline btn-admin">
                        <Megaphone size={18} /> New Announcement
                    </Link>
                </div>
            </div>
        </div>
    );
};

// Internal components for clean rendering
const Mail = ({ size }) => <MessageSquare size={size} />;
const Plus = ({ size }) => <div style={{ fontSize: '1.5rem', lineHeight: '1' }}>+</div>;

export default Dashboard;
