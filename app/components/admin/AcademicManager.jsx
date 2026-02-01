import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Save, X, BookOpen, GraduationCap, Users, Grid, Check } from 'lucide-react';

const AcademicManager = () => {
    const [activeTab, setActiveTab] = useState('levels');
    const [levels, setLevels] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [classSubjects, setClassSubjects] = useState([]);
    const [selectedClass, setSelectedClass] = useState('Senior 1');
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [isAdding, setIsAdding] = useState(false);

    const classOptions = ['Senior 1', 'Senior 2', 'Senior 3', 'Senior 4', 'Senior 5', 'Senior 6'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const [l, d, s, cs] = await Promise.all([
            supabase.from('academic_levels').select('*').order('sort_order', { ascending: true }),
            supabase.from('departments').select('*').order('name', { ascending: true }),
            supabase.from('subjects').select('*').order('name', { ascending: true }),
            supabase.from('class_subjects').select('*')
        ]);
        setLevels(l.data || []);
        setDepartments(d.data || []);
        setSubjects(s.data || []);
        setClassSubjects(cs.data || []);
        setLoading(false);
    };

    const handleEdit = (id, data) => {
        setEditingId(id);
        setEditForm(data);
    };

    const handleSave = async (table) => {
        const { id, ...saveData } = editForm;
        const { error } = id
            ? await supabase.from(table).update(saveData).eq('id', id)
            : await supabase.from(table).insert(saveData);

        if (error) {
            alert('Error saving: ' + error.message);
        } else {
            setEditingId(null);
            setIsAdding(false);
            setEditForm({});
            fetchData();
        }
    };

    const handleDelete = async (table, id) => {
        if (!window.confirm('Are you sure you want to delete this?')) return;
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) alert('Error deleting: ' + error.message);
        else fetchData();
    };

    const renderLevelForm = () => (
        <div className="admin-form-card">
            <h3>{editingId ? 'Edit Level' : 'Add Level'}</h3>
            <div className="form-group">
                <label>Name (e.g. O-Level)</label>
                <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="O-Level"
                />
            </div>
            <div className="form-group">
                <label>Description</label>
                <textarea
                    value={editForm.description || ''}
                    onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                />
            </div>
            <div className="form-group">
                <label>Sort Order</label>
                <input
                    type="number"
                    value={editForm.sort_order || 0}
                    onChange={e => setEditForm({ ...editForm, sort_order: parseInt(e.target.value) })}
                />
            </div>
            <div className="form-actions">
                <button className="btn btn-primary" onClick={() => handleSave('academic_levels')}>
                    <Save size={18} /> Save Level
                </button>
                <button className="btn btn-outline" onClick={() => { setEditingId(null); setIsAdding(false); }}>
                    <X size={18} /> Cancel
                </button>
            </div>
        </div>
    );

    const renderDeptForm = () => (
        <div className="admin-form-card">
            <h3>{editingId ? 'Edit Department' : 'Add Department'}</h3>
            <div className="form-group">
                <label>Department Name</label>
                <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                />
            </div>
            <div className="form-group">
                <label>Description</label>
                <textarea
                    value={editForm.description || ''}
                    onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                />
            </div>
            <div className="form-actions">
                <button className="btn btn-primary" onClick={() => handleSave('departments')}>
                    <Save size={18} /> Save Department
                </button>
                <button className="btn btn-outline" onClick={() => { setEditingId(null); setIsAdding(false); }}>
                    <X size={18} /> Cancel
                </button>
            </div>
        </div>
    );

    const renderSubjectForm = () => (
        <div className="admin-form-card">
            <h3>{editingId ? 'Edit Subject' : 'Add Subject'}</h3>
            <div className="form-group">
                <label>Subject Name</label>
                <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                />
            </div>
            <div className="form-group">
                <label>Level</label>
                <select
                    value={editForm.level_id || ''}
                    onChange={e => setEditForm({ ...editForm, level_id: e.target.value })}
                >
                    <option value="">Select Level</option>
                    {levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
            </div>
            <div className="form-group">
                <label>Department</label>
                <select
                    value={editForm.department_id || ''}
                    onChange={e => setEditForm({ ...editForm, department_id: e.target.value })}
                >
                    <option value="">Select Department (Optional)</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
            </div>
            <div className="form-actions">
                <button className="btn btn-primary" onClick={() => handleSave('subjects')}>
                    <Save size={18} /> Save Subject
                </button>
                <button className="btn btn-outline" onClick={() => { setEditingId(null); setIsAdding(false); }}>
                    <X size={18} /> Cancel
                </button>
            </div>
        </div>
    );

    return (
        <div className="admin-manager academics-manager">
            <div className="admin-header">
                <h1>Academic Management</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Link to="/admin/academics/marks" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <BookOpen size={18} /> Enter Marks
                    </Link>
                    {!isAdding && !editingId && (
                        <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
                            <Plus size={18} /> Add New {activeTab.slice(0, -1)}
                        </button>
                    )}
                </div>
            </div>

            <div className="admin-tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                <button
                    className={`btn ${activeTab === 'levels' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => { setActiveTab('levels'); setIsAdding(false); setEditingId(null); }}
                >
                    <GraduationCap size={18} /> Levels
                </button>
                <button
                    className={`btn ${activeTab === 'depts' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => { setActiveTab('depts'); setIsAdding(false); setEditingId(null); }}
                >
                    <Users size={18} /> Departments
                </button>
                <button
                    className={`btn ${activeTab === 'subjects' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => { setActiveTab('subjects'); setIsAdding(false); setEditingId(null); }}
                >
                    <BookOpen size={18} /> Subjects
                </button>
                <button
                    className={`btn ${activeTab === 'classSubjects' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => { setActiveTab('classSubjects'); setIsAdding(false); setEditingId(null); }}
                >
                    <Grid size={18} /> Class Subjects
                </button>
            </div>

            {(isAdding || editingId) && (
                <div style={{ marginBottom: '2rem' }}>
                    {activeTab === 'levels' && renderLevelForm()}
                    {activeTab === 'depts' && renderDeptForm()}
                    {activeTab === 'subjects' && renderSubjectForm()}
                </div>
            )}

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="admin-list-grid">
                    {activeTab === 'levels' && levels.map(level => (
                        <div key={level.id} className="admin-list-item" style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #eee', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: 0 }}>{level.name}</h3>
                                    <p style={{ color: '#666', margin: '0.5rem 0' }}>{level.description}</p>
                                    <span style={{ fontSize: '0.8rem', background: '#f0f0f0', padding: '2px 8px', borderRadius: '4px' }}>Order: {level.sort_order}</span>
                                </div>
                                <div className="actions" style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn-icon" onClick={() => handleEdit(level.id, level)}><Pencil size={18} /></button>
                                    <button className="btn-icon delete" onClick={() => handleDelete('academic_levels', level.id)}><Trash2 size={18} /></button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {activeTab === 'depts' && departments.map(dept => (
                        <div key={dept.id} className="admin-list-item" style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #eee', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: 0 }}>{dept.name}</h3>
                                    <p style={{ color: '#666', margin: '0.5rem 0' }}>{dept.description}</p>
                                </div>
                                <div className="actions" style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn-icon" onClick={() => handleEdit(dept.id, dept)}><Pencil size={18} /></button>
                                    <button className="btn-icon delete" onClick={() => handleDelete('departments', dept.id)}><Trash2 size={18} /></button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {activeTab === 'subjects' && subjects.map(subject => (
                        <div key={subject.id} className="admin-list-item" style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #eee', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: 0 }}>{subject.name}</h3>
                                    <p style={{ color: '#666', fontSize: '0.9rem', margin: '0.25rem 0' }}>
                                        {levels.find(l => l.id === subject.level_id)?.name || 'Unknown Level'}
                                        {subject.department_id && ` • ${departments.find(d => d.id === subject.department_id)?.name || 'Unknown Dept'}`}
                                    </p>
                                </div>
                                <div className="actions" style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn-icon" onClick={() => handleEdit(subject.id, subject)}><Pencil size={18} /></button>
                                    <button className="btn-icon delete" onClick={() => handleDelete('subjects', subject.id)}><Trash2 size={18} /></button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {activeTab === 'classSubjects' && (
                        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eee' }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ fontWeight: 'bold', marginRight: '1rem' }}>Select Class:</label>
                                <select
                                    value={selectedClass}
                                    onChange={e => setSelectedClass(e.target.value)}
                                    style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem' }}
                                >
                                    {classOptions.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <p style={{ color: '#666', marginBottom: '1rem' }}>
                                Select the subjects that <strong>{selectedClass}</strong> students study:
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.75rem' }}>
                                {subjects.map(subject => {
                                    const isAssigned = classSubjects.some(cs => cs.class_name === selectedClass && cs.subject_id === subject.id);
                                    const mapping = classSubjects.find(cs => cs.class_name === selectedClass && cs.subject_id === subject.id);

                                    const toggleSubject = async () => {
                                        if (isAssigned) {
                                            // Optimistic remove
                                            setClassSubjects(prev => prev.filter(cs => cs.id !== mapping.id));
                                            await supabase.from('class_subjects').delete().eq('id', mapping.id);
                                        } else {
                                            // Optimistic add
                                            const newMapping = {
                                                id: crypto.randomUUID(),
                                                class_name: selectedClass,
                                                subject_id: subject.id,
                                                is_compulsory: false
                                            };
                                            setClassSubjects(prev => [...prev, newMapping]);
                                            await supabase.from('class_subjects').insert({
                                                class_name: selectedClass,
                                                subject_id: subject.id,
                                                is_compulsory: false
                                            });
                                        }
                                    };

                                    const toggleCompulsory = async (e) => {
                                        e.stopPropagation();
                                        if (!mapping) return;
                                        // Optimistic update
                                        setClassSubjects(prev => prev.map(cs =>
                                            cs.id === mapping.id ? { ...cs, is_compulsory: !cs.is_compulsory } : cs
                                        ));
                                        await supabase.from('class_subjects').update({ is_compulsory: !mapping.is_compulsory }).eq('id', mapping.id);
                                    };

                                    return (
                                        <div
                                            key={subject.id}
                                            onClick={toggleSubject}
                                            style={{
                                                padding: '0.75rem 1rem',
                                                borderRadius: '8px',
                                                border: isAssigned ? '2px solid #22c55e' : '1px solid #ddd',
                                                background: isAssigned ? '#f0fdf4' : 'white',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: '0.75rem',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <div style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '4px',
                                                border: isAssigned ? 'none' : '2px solid #ccc',
                                                background: isAssigned ? '#22c55e' : 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                                marginTop: '2px'
                                            }}>
                                                {isAssigned && <Check size={14} color="white" />}
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                                <span style={{ fontWeight: isAssigned ? '500' : '400' }}>{subject.name}</span>
                                                {isAssigned && (
                                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.4rem' }} onClick={(e) => e.stopPropagation()}>
                                                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                                                            <input
                                                                type="radio"
                                                                name={`type-${subject.id}`}
                                                                checked={mapping?.is_compulsory === true}
                                                                onChange={() => {
                                                                    if (window.confirm(`Make "${subject.name}" COMPULSORY for ${selectedClass}?`)) {
                                                                        setClassSubjects(prev => prev.map(cs => cs.id === mapping.id ? { ...cs, is_compulsory: true } : cs));
                                                                        supabase.from('class_subjects').update({ is_compulsory: true }).eq('id', mapping.id);
                                                                    }
                                                                }}
                                                                style={{ accentColor: '#3b82f6', cursor: 'pointer' }}
                                                            />
                                                            <span style={{ color: mapping?.is_compulsory ? '#3b82f6' : '#6b7280', fontWeight: mapping?.is_compulsory ? 'bold' : 'normal' }}>Comp</span>
                                                        </label>
                                                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                                                            <input
                                                                type="radio"
                                                                name={`type-${subject.id}`}
                                                                checked={mapping?.is_compulsory === false}
                                                                onChange={() => {
                                                                    if (window.confirm(`Make "${subject.name}" OPTIONAL for ${selectedClass}?`)) {
                                                                        setClassSubjects(prev => prev.map(cs => cs.id === mapping.id ? { ...cs, is_compulsory: false } : cs));
                                                                        supabase.from('class_subjects').update({ is_compulsory: false }).eq('id', mapping.id);
                                                                    }
                                                                }}
                                                                style={{ accentColor: '#f59e0b', cursor: 'pointer' }}
                                                            />
                                                            <span style={{ color: !mapping?.is_compulsory ? '#f59e0b' : '#6b7280', fontWeight: !mapping?.is_compulsory ? 'bold' : 'normal' }}>OPT</span>
                                                        </label>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                                <strong>Summary for {selectedClass}:</strong>
                                <span style={{ marginLeft: '1rem' }}>
                                    {classSubjects.filter(cs => cs.class_name === selectedClass).length} subjects assigned
                                    ({classSubjects.filter(cs => cs.class_name === selectedClass && cs.is_compulsory).length} compulsory,
                                    {classSubjects.filter(cs => cs.class_name === selectedClass && !cs.is_compulsory).length} optional)
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AcademicManager;
