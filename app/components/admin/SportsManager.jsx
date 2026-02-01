import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
    Trophy, Users, Calendar, Plus, Edit, Trash2,
    Save, X, Upload, ChevronRight, Shield
} from 'lucide-react';

const SportsManager = () => {
    const [activeTab, setActiveTab] = useState('teams');
    const [loading, setLoading] = useState(false);

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Sports & Co-curricular Manager</h1>
                <p>Manage teams, match schedules, and student clubs.</p>
            </div>

            <div className="admin-tabs">
                <button
                    className={`tab-btn ${activeTab === 'teams' ? 'active' : ''}`}
                    onClick={() => setActiveTab('teams')}
                >
                    <Shield size={18} /> Teams & Rosters
                </button>
                <button
                    className={`tab-btn ${activeTab === 'matches' ? 'active' : ''}`}
                    onClick={() => setActiveTab('matches')}
                >
                    <Trophy size={18} /> Matches & Results
                </button>
                <button
                    className={`tab-btn ${activeTab === 'clubs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('clubs')}
                >
                    <Users size={18} /> Clubs & Societies
                </button>
            </div>

            <div className="admin-content-wrapper">
                {activeTab === 'teams' && <TeamsTab />}
                {activeTab === 'matches' && <MatchesTab />}
                {activeTab === 'clubs' && <ClubsTab />}
            </div>
        </div>
    );
};

// ==========================================
// 1. TEAMS TAB
// ==========================================
const TeamsTab = () => {
    const [teams, setTeams] = useState([]);
    const [editingTeam, setEditingTeam] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        sport: '',
        coach_name: '',
        description: ''
    });

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        setLoading(true);
        const { data } = await supabase.from('sports_teams').select('*').order('name');
        if (data) setTeams(data);
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTeam) {
                await supabase.from('sports_teams').update(formData).eq('id', editingTeam.id);
            } else {
                await supabase.from('sports_teams').insert([formData]);
            }
            setIsFormOpen(false);
            setEditingTeam(null);
            setFormData({ name: '', sport: '', coach_name: '', description: '' });
            fetchTeams();
        } catch (error) {
            console.error('Error saving team:', error);
            alert('Failed to save team');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this team and all its members?')) return;
        await supabase.from('sports_teams').delete().eq('id', id);
        fetchTeams();
    };

    // If viewing a specific team's roster
    if (editingTeam && !isFormOpen) {
        return (
            <div>
                <button
                    onClick={() => setEditingTeam(null)}
                    className="btn btn-outline"
                    style={{ marginBottom: '1rem' }}
                >
                    <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} /> Back to Teams
                </button>
                <div className="admin-card">
                    <div className="flex-between">
                        <h2>{editingTeam.name} - Roster</h2>
                    </div>
                    <TeamMembersManager teamId={editingTeam.id} />
                </div>
            </div>
        );
    }

    return (
        <div className="tab-content">
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <h3>Sports Teams</h3>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setEditingTeam(null);
                        setFormData({ name: '', sport: '', coach_name: '', description: '' });
                        setIsFormOpen(true);
                    }}
                >
                    <Plus size={16} /> Add Team
                </button>
            </div>

            {isFormOpen && (
                <div className="admin-card form-card">
                    <h4>{editingTeam ? 'Edit Team Details' : 'Add New Team'}</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Team Name</label>
                            <input
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Senior Football Team"
                                required
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Sport</label>
                                <select
                                    value={formData.sport}
                                    onChange={e => setFormData({ ...formData, sport: e.target.value })}
                                    required
                                >
                                    <option value="">Select Sport</option>
                                    <option value="Football">Football</option>
                                    <option value="Netball">Netball</option>
                                    <option value="Volleyball">Volleyball</option>
                                    <option value="Basketball">Basketball</option>
                                    <option value="Athletics">Athletics</option>
                                    <option value="Rugby">Rugby</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Coach Name</label>
                                <input
                                    value={formData.coach_name}
                                    onChange={e => setFormData({ ...formData, coach_name: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn btn-outline" onClick={() => setIsFormOpen(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Save Team</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="teams-grid">
                {teams.map(team => (
                    <div key={team.id} className="admin-card team-card">
                        <div className="team-header">
                            <Shield size={24} className="team-icon" />
                            <div>
                                <h4>{team.name}</h4>
                                <span className="badge">{team.sport}</span>
                            </div>
                        </div>
                        <div className="team-actions">
                            <button
                                className="btn btn-sm btn-outline"
                                onClick={() => {
                                    setEditingTeam(team);
                                    setFormData(team);
                                    setIsFormOpen(true);
                                }}
                            >
                                <Edit size={14} /> Edit Info
                            </button>
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={() => {
                                    setEditingTeam(team);
                                    setIsFormOpen(false);
                                }}
                            >
                                <Users size={14} /> Manage Roster
                            </button>
                            <button
                                className="btn-icon delete"
                                onClick={() => handleDelete(team.id)}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Helper Component for Team Members
const TeamMembersManager = ({ teamId }) => {
    const [members, setMembers] = useState([]);
    const [newMember, setNewMember] = useState({ name: '', position: '', jersey_number: '' });

    useEffect(() => {
        fetchMembers();
    }, [teamId]);

    const fetchMembers = async () => {
        const { data } = await supabase.from('team_members').select('*').eq('team_id', teamId);
        if (data) setMembers(data);
    };

    const addMember = async (e) => {
        e.preventDefault();
        await supabase.from('team_members').insert([{ ...newMember, team_id: teamId }]);
        setNewMember({ name: '', position: '', jersey_number: '' });
        fetchMembers();
    };

    const removeMember = async (id) => {
        await supabase.from('team_members').delete().eq('id', id);
        fetchMembers();
    };

    return (
        <div>
            <form onSubmit={addMember} className="member-form inline-form">
                <input
                    placeholder="Player Name"
                    value={newMember.name}
                    onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                    required
                />
                <input
                    placeholder="Position"
                    value={newMember.position}
                    onChange={e => setNewMember({ ...newMember, position: e.target.value })}
                />
                <input
                    placeholder="Jersey No."
                    value={newMember.jersey_number}
                    onChange={e => setNewMember({ ...newMember, jersey_number: e.target.value })}
                    style={{ width: '100px' }}
                />
                <button type="submit" className="btn btn-primary"><Plus size={16} /> Add</button>
            </form>

            <table className="admin-table" style={{ marginTop: '1rem' }}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Jersey</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map(member => (
                        <tr key={member.id}>
                            <td>{member.name}</td>
                            <td>{member.position}</td>
                            <td>{member.jersey_number}</td>
                            <td>
                                <button className="btn-icon delete" onClick={() => removeMember(member.id)}>
                                    <X size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// ==========================================
// 2. MATCHES TAB
// ==========================================
const MatchesTab = () => {
    const [matches, setMatches] = useState([]);
    const [teams, setTeams] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        team_id: '',
        opponent: '',
        match_date: '',
        location: '',
        status: 'scheduled'
    });

    useEffect(() => {
        fetchMatches();
        fetchTeams();
    }, []);

    const fetchMatches = async () => {
        const { data } = await supabase
            .from('matches')
            .select('*, sports_teams(name)')
            .order('match_date', { ascending: false });
        if (data) setMatches(data);
    };

    const fetchTeams = async () => {
        const { data } = await supabase.from('sports_teams').select('id, name');
        if (data) setTeams(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await supabase.from('matches').insert([formData]);
        setIsFormOpen(false);
        setFormData({ team_id: '', opponent: '', match_date: '', location: '', status: 'scheduled' });
        fetchMatches();
    };

    const updateScore = async (id, home, away) => {
        await supabase.from('matches').update({ home_score: home, away_score: away, status: 'completed' }).eq('id', id);
        fetchMatches();
    };

    const deleteMatch = async (id) => {
        if (!window.confirm('Delete match?')) return;
        await supabase.from('matches').delete().eq('id', id);
        fetchMatches();
    };

    return (
        <div className="tab-content">
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <h3>Match Schedule</h3>
                <button className="btn btn-primary" onClick={() => setIsFormOpen(true)}><Plus size={16} /> Add Match</button>
            </div>

            {isFormOpen && (
                <div className="admin-card form-card">
                    <h4>Add New Match</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Our Team</label>
                                <select
                                    value={formData.team_id}
                                    onChange={e => setFormData({ ...formData, team_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select Team</option>
                                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Opponent</label>
                                <input
                                    value={formData.opponent}
                                    onChange={e => setFormData({ ...formData, opponent: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Date & Time</label>
                                <input
                                    type="datetime-local"
                                    value={formData.match_date}
                                    onChange={e => setFormData({ ...formData, match_date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn btn-outline" onClick={() => setIsFormOpen(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Schedule Match</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="matches-list">
                {matches.map(match => (
                    <div key={match.id} className="admin-card match-card">
                        <div className="match-info">
                            <span className={`status-badge ${match.status}`}>{match.status}</span>
                            <div className="teams-vs">
                                <strong>{match.sports_teams?.name || 'Unknown Team'}</strong>
                                <span className="vs">VS</span>
                                <strong>{match.opponent}</strong>
                            </div>
                            <div className="match-meta">
                                <span>{new Date(match.match_date).toLocaleString()}</span>
                                <span>{match.location}</span>
                            </div>
                        </div>
                        <div className="match-scores">
                            <div className="score-inputs">
                                <input
                                    type="number"
                                    placeholder="Home"
                                    defaultValue={match.home_score}
                                    onBlur={(e) => updateScore(match.id, e.target.value, match.away_score)}
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    placeholder="Away"
                                    defaultValue={match.away_score}
                                    onBlur={(e) => updateScore(match.id, match.home_score, e.target.value)}
                                />
                            </div>
                            <button className="btn-icon delete" onClick={() => deleteMatch(match.id)}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ==========================================
// 3. CLUBS TAB
// ==========================================
const ClubsTab = () => {
    const [clubs, setClubs] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        meeting_day: '',
        patron_name: ''
    });

    useEffect(() => {
        fetchClubs();
    }, []);

    const fetchClubs = async () => {
        const { data } = await supabase.from('clubs').select('*').order('name');
        if (data) setClubs(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await supabase.from('clubs').insert([formData]);
        setIsFormOpen(false);
        setFormData({ name: '', description: '', meeting_day: '', patron_name: '' });
        fetchClubs();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete club?')) return;
        await supabase.from('clubs').delete().eq('id', id);
        fetchClubs();
    };

    return (
        <div className="tab-content">
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <h3>Clubs & Societies</h3>
                <button className="btn btn-primary" onClick={() => setIsFormOpen(true)}><Plus size={16} /> Add Club</button>
            </div>

            {isFormOpen && (
                <div className="admin-card form-card">
                    <h4>Add New Club</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Club Name</label>
                            <input
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                rows={2}
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Meeting Day/Time</label>
                                <input
                                    value={formData.meeting_day}
                                    onChange={e => setFormData({ ...formData, meeting_day: e.target.value })}
                                    placeholder="e.g. Wednesdays 4PM"
                                />
                            </div>
                            <div className="form-group">
                                <label>Patron</label>
                                <input
                                    value={formData.patron_name}
                                    onChange={e => setFormData({ ...formData, patron_name: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn btn-outline" onClick={() => setIsFormOpen(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Save Club</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="clubs-list">
                {clubs.map(club => (
                    <div key={club.id} className="admin-card club-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h4>{club.name}</h4>
                            <p style={{ margin: '0.25rem 0', color: '#64748b', fontSize: '0.9rem' }}>{club.meeting_day} • Patron: {club.patron_name}</p>
                        </div>
                        <button className="btn-icon delete" onClick={() => handleDelete(club.id)}>
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SportsManager;
