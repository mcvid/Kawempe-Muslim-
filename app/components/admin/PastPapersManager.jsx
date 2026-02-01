import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { FileText, Upload, Trash2, Download, Search, BookOpen, Filter } from 'lucide-react';

const PastPapersManager = () => {
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        level: 'S1',
        year: new Date().getFullYear(),
        term: '1',
        paper_type: 'Exam'
    });
    const [file, setFile] = useState(null);

    // Filter states for the list view
    const [filterSubject, setFilterSubject] = useState('');
    const [filterLevel, setFilterLevel] = useState('All');

    useEffect(() => {
        fetchPapers();
    }, []);

    const fetchPapers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('past_papers')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setPapers(data);
        if (error) console.error('Error fetching papers:', error);
        setLoading(false);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert('Please select a file to upload');

        setUploading(true);
        try {
            // 1. Upload file to storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${formData.subject}_${formData.level}_${Date.now()}.${fileExt}`.replace(/\s+/g, '_');
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('academic_resources')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // 2. Get public URL
            const { data: urlData } = supabase.storage
                .from('academic_resources')
                .getPublicUrl(fileName);

            // 3. Insert record into database
            const { error: dbError } = await supabase
                .from('past_papers')
                .insert([{
                    ...formData,
                    file_url: urlData.publicUrl,
                    year: parseInt(formData.year),
                    term: parseInt(formData.term)
                }]);

            if (dbError) throw dbError;

            // Reset form
            setFormData({
                title: '',
                subject: '',
                level: 'S1',
                year: new Date().getFullYear(),
                term: '1',
                paper_type: 'Exam'
            });
            setFile(null);

            // Refresh list
            fetchPapers();
            alert('Past paper uploaded successfully!');

        } catch (error) {
            console.error('Error uploading paper:', error);
            alert('Failed to upload paper. ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id, fileUrl) => {
        if (!window.confirm('Are you sure you want to delete this paper?')) return;

        try {
            // 1. Delete from database
            const { error: dbError } = await supabase
                .from('past_papers')
                .delete()
                .eq('id', id);

            if (dbError) throw dbError;

            // 2. Delete from storage (optional, but good practice to clean up)
            // Extract filename from URL... simplified here, assumes standard bucket URL structure
            const fileName = fileUrl.split('/').pop();
            if (fileName) {
                await supabase.storage.from('academic_resources').remove([fileName]);
            }

            fetchPapers();
        } catch (error) {
            console.error('Error deleting paper:', error);
            alert('Error deleting paper');
        }
    };

    const filteredPapers = papers.filter(paper => {
        return (filterLevel === 'All' || paper.level === filterLevel) &&
            (filterSubject === '' || paper.subject.toLowerCase().includes(filterSubject.toLowerCase()));
    });

    return (
        <div className="admin-manager">
            <div className="admin-header">
                <h1>Academic Resources Manager</h1>
                <p>Upload and manage past papers and study materials.</p>
            </div>

            <div className="admin-grid">
                {/* Upload Form */}
                <div className="admin-card">
                    <h3>Upload New Paper</h3>
                    <form onSubmit={handleUpload}>
                        <div className="form-group">
                            <label>Title / Description</label>
                            <input
                                type="text"
                                placeholder="e.g. End of Term Mathematics Exam"
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Subject</label>
                                <select
                                    required
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                >
                                    <option value="">Select Subject</option>
                                    <option value="General">General</option>
                                    <option value="Mathematics">Mathematics</option>
                                    <option value="English">English</option>
                                    <option value="Physics">Physics</option>
                                    <option value="Chemistry">Chemistry</option>
                                    <option value="Biology">Biology</option>
                                    <option value="History">History</option>
                                    <option value="Geography">Geography</option>
                                    <option value="Commerce">Commerce</option>
                                    <option value="Computer Studies">Computer Studies</option>
                                    <option value="Literature">Literature</option>
                                    <option value="Luganda">Luganda</option>
                                    <option value="Swahili">Swahili</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Level</label>
                                <select
                                    value={formData.level}
                                    onChange={e => setFormData({ ...formData, level: e.target.value })}
                                >
                                    <option value="S1">Senior 1</option>
                                    <option value="S2">Senior 2</option>
                                    <option value="S3">Senior 3</option>
                                    <option value="S4">Senior 4</option>
                                    <option value="S5">Senior 5</option>
                                    <option value="S6">Senior 6</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Year</label>
                                <input
                                    type="number"
                                    required
                                    min="2000"
                                    max="2030"
                                    value={formData.year}
                                    onChange={e => setFormData({ ...formData, year: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Term</label>
                                <select
                                    value={formData.term}
                                    onChange={e => setFormData({ ...formData, term: e.target.value })}
                                >
                                    <option value="1">Term 1</option>
                                    <option value="2">Term 2</option>
                                    <option value="3">Term 3</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Type</label>
                            <select
                                value={formData.paper_type}
                                onChange={e => setFormData({ ...formData, paper_type: e.target.value })}
                            >
                                <option value="Exam">Exam Paper</option>
                                <option value="Test">Monthly Test</option>
                                <option value="Assignment">Holiday Work / Assignment</option>
                                <option value="Notes">Class Notes</option>
                                <option value="Timetable">Exam Timetable</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Document File (PDF/Word)</label>
                            <div className="file-upload-wrapper">
                                <input
                                    type="file"
                                    required
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                />
                                <div className="file-upload-placeholder">
                                    <Upload size={24} />
                                    <span>{file ? file.name : 'Click to select file'}</span>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={uploading}>
                            {uploading ? 'Uploading...' : 'Upload Paper'}
                        </button>
                    </form>
                </div>

                {/* List View */}
                <div className="admin-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>Manage Resources</h3>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <select
                                value={filterLevel}
                                onChange={e => setFilterLevel(e.target.value)}
                                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                            >
                                <option value="All">All Levels</option>
                                <option value="S1">S1</option>
                                <option value="S2">S2</option>
                                <option value="S3">S3</option>
                                <option value="S4">S4</option>
                                <option value="S5">S5</option>
                                <option value="S6">S6</option>
                            </select>
                        </div>
                    </div>

                    <div className="papers-list">
                        {loading ? <p>Loading...</p> : filteredPapers.length === 0 ? <p>No papers found.</p> : (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                                        <th style={{ padding: '0.75rem' }}>Title</th>
                                        <th style={{ padding: '0.75rem' }}>Subject</th>
                                        <th style={{ padding: '0.75rem' }}>Class</th>
                                        <th style={{ padding: '0.75rem' }}>Year</th>
                                        <th style={{ padding: '0.75rem' }}>Downloads</th>
                                        <th style={{ padding: '0.75rem' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPapers.map(paper => (
                                        <tr key={paper.id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '0.75rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <FileText size={16} color="#475569" />
                                                    {paper.title}
                                                </div>
                                            </td>
                                            <td style={{ padding: '0.75rem' }}>{paper.subject}</td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <span className="badge badge-blue">{paper.level}</span>
                                            </td>
                                            <td style={{ padding: '0.75rem' }}>{paper.year}</td>
                                            <td style={{ padding: '0.75rem' }}>{paper.downloads}</td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <a
                                                        href={paper.file_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn-icon"
                                                        title="Download/View"
                                                    >
                                                        <Download size={16} />
                                                    </a>
                                                    <button
                                                        className="btn-icon delete"
                                                        onClick={() => handleDelete(paper.id, paper.file_url)}
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PastPapersManager;
