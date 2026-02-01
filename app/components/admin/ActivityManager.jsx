import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity } from 'lucide-react';

const ActivityManager = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: visits, error } = await supabase
                    .from('daily_visits')
                    .select('*')
                    .order('visit_date', { ascending: true })
                    .limit(30);

                if (error) throw error;
                setData(visits);
            } catch (error) {
                console.error('Error fetching activity data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="admin-page-container">
            <div className="admin-header">
                <h2>User Activity</h2>
                <div className="admin-header-actions">
                    <span className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0.5rem 1rem', background: '#e0f2fe', color: '#0284c7', borderRadius: '20px' }}>
                        <Activity size={16} />
                        Last 30 Days
                    </span>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="stat-card full-width" style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3>Daily Visits</h3>
                    {data.length === 0 ? (
                        <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#64748b' }}>
                            <Activity size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <p>No activity recorded yet.</p>
                            <small>Make sure you've run the database setup script.</small>
                        </div>
                    ) : (
                        <div style={{ width: '100%', height: 400, marginTop: '20px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="visit_date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                                    <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" allowDecimals={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Line type="monotone" dataKey="visit_count" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActivityManager;
