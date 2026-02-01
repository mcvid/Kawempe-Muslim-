import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Search, Trash2, Edit, Save, X, User, Download, Upload, FileText } from 'lucide-react';
import ReportCard from '../../components/ReportCard';
import ImportGuideModal from '../../components/ImportGuideModal';
import * as XLSX from 'xlsx';
import './StudentsManager.css'; // We'll create a basic CSS file or rely on existing admin styles

const StudentsManager = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        student_name: '',
        student_reg_number: '',
        house: '',
        class_grade: '',
        parent_name: '',
        parent_email: '',
        parent_phone: '',
        valid_until: '',
        photo_url: ''
    });

    const [filters, setFilters] = useState({
        class_grade: '',
        search_query: ''
    });

    useEffect(() => {
        fetchStudents();
    }, [filters.class_grade]);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            let query = supabase
                .from('students')
                .select('*')
                .order('student_name', { ascending: true });

            if (filters.class_grade) {
                query = query.eq('class_grade', filters.class_grade);
            }

            const { data, error } = await query;

            if (error) throw error;
            setStudents(data || []);
        } catch (error) {
            console.error('Error fetching students:', error);
            alert('Failed to fetch students');
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(student =>
        student.student_name.toLowerCase().includes(filters.search_query.toLowerCase()) ||
        student.student_reg_number.toLowerCase().includes(filters.search_query.toLowerCase())
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('students')
                .upsert([formData], { onConflict: 'student_reg_number' });

            if (error) throw error;

            alert('Student saved successfully!');
            setShowForm(false);
            setFormData({
                student_name: '',
                student_reg_number: '',
                house: '',
                class_grade: '',
                parent_name: '',
                parent_email: '',
                parent_phone: '',
                valid_until: '',
                photo_url: ''
            });
            fetchStudents();
        } catch (error) {
            console.error('Error saving student:', error);
            alert('Failed to save student: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;
        try {
            const { error } = await supabase
                .from('students')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchStudents();
        } catch (error) {
            console.error('Error deleting student:', error);
            alert('Failed to delete student');
        }
    };

    const handleExport = () => {
        if (!students.length) {
            alert('No students to export.');
            return;
        }

        // Define CSV headers
        const headers = ['Name', 'Reg Number', 'House', 'Class', 'Parent Name', 'Parent Email', 'Parent Phone', 'Valid Until'];

        // Convert data to CSV format
        const csvContent = [
            headers.join(','),
            ...students.map(student => [
                `"${student.student_name}"`,
                `"${student.student_reg_number}"`,
                `"${student.house}"`,
                `"${student.class_grade}"`,
                `"${student.parent_name || ''}"`,
                `"${student.parent_email || ''}"`,
                `"${student.parent_phone || ''}"`,
                `"${student.valid_until || ''}"`
            ].join(','))
        ].join('\n');

        // Create blob and download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `students_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Helper: Convert Excel serial date to YYYY-MM-DD format
    const excelDateToJSDate = (serial) => {
        if (!serial) return null;

        // If it's already a string date, return it
        if (typeof serial === 'string' && serial.includes('-')) {
            return serial;
        }

        // If it's a number (Excel serial date)
        if (typeof serial === 'number') {
            const utc_days = Math.floor(serial - 25569);
            const utc_value = utc_days * 86400;
            const date_info = new Date(utc_value * 1000);

            const year = date_info.getFullYear();
            const month = String(date_info.getMonth() + 1).padStart(2, '0');
            const day = String(date_info.getDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
        }

        return null;
    };

    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const fileName = file.name.toLowerCase();
        const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
        const isCSV = fileName.endsWith('.csv');

        if (!isExcel && !isCSV) {
            alert('Please upload a valid Excel (.xlsx, .xls) or CSV (.csv) file.');
            e.target.value = null;
            return;
        }

        setLoading(true);

        try {
            let studentsToInsert = [];

            if (isExcel) {
                // Handle Excel files
                const reader = new FileReader();
                reader.onload = async (event) => {
                    try {
                        const bstr = event.target.result;
                        const workbook = XLSX.read(bstr, { type: 'binary' });
                        const wsname = workbook.SheetNames[0];
                        const ws = workbook.Sheets[wsname];
                        const data = XLSX.utils.sheet_to_json(ws);

                        if (data.length === 0) {
                            alert('File is empty.');
                            setLoading(false);
                            return;
                        }

                        // Map Excel columns to database columns
                        data.forEach(row => {
                            const student = {
                                student_name: row['student_name'] || row['Name'] || row['Student Name'],
                                student_reg_number: row['student_reg_number'] || row['Reg Number'] || row['Registration Number'],
                                house: row['house'] || row['House'],
                                class_grade: row['class_grade'] || row['Class'] || row['Grade'],
                                parent_name: row['parent_name'] || row['Parent Name'],
                                parent_email: row['parent_email'] || row['Parent Email'] || row['Email'],
                                parent_phone: row['parent_phone'] || row['Parent Phone'] || row['Phone'],
                                valid_until: excelDateToJSDate(row['valid_until'] || row['Valid Until'])
                            };

                            // Validate required fields (both name and reg number required for student creation)
                            if (student.student_name && student.student_reg_number) {
                                studentsToInsert.push(student);
                            } else {
                                console.warn('Skipping invalid row (missing Name or Reg Number):', row);
                            }
                        });

                        await insertStudents(studentsToInsert);
                    } catch (err) {
                        console.error('Excel import error:', err);
                        alert('Failed to import Excel file: ' + err.message);
                        setLoading(false);
                    }
                };
                reader.readAsBinaryString(file);

            } else {
                // Handle CSV files (existing logic)
                const reader = new FileReader();
                reader.onload = async (event) => {
                    try {
                        const text = event.target.result;
                        const lines = text.split('\n');
                        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

                        const mapHeader = (h) => {
                            const lower = h.toLowerCase();
                            if (lower.includes('name')) return 'student_name';
                            if (lower.includes('reg')) return 'student_reg_number';
                            if (lower.includes('house')) return 'house';
                            if (lower.includes('class')) return 'class_grade';
                            if (lower.includes('parent name')) return 'parent_name';
                            if (lower.includes('email')) return 'parent_email';
                            if (lower.includes('phone')) return 'parent_phone';
                            if (lower.includes('valid')) return 'valid_until';
                            return null;
                        };

                        const dbColumns = headers.map(mapHeader);

                        for (let i = 1; i < lines.length; i++) {
                            if (!lines[i].trim()) continue;

                            const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, ''));
                            const student = {};
                            let isValid = true;

                            dbColumns.forEach((col, index) => {
                                if (col) {
                                    student[col] = values[index];
                                }
                            });

                            if (!student.student_name || !student.student_reg_number) {
                                console.warn('Skipping invalid row (missing Name or Reg Number):', i + 1, values);
                                isValid = false;
                            }

                            if (isValid) {
                                studentsToInsert.push(student);
                            }
                        }

                        await insertStudents(studentsToInsert);
                    } catch (err) {
                        console.error('CSV import error:', err);
                        alert('Failed to import CSV file: ' + err.message);
                        setLoading(false);
                    }
                };
                reader.readAsText(file);
            }
        } catch (error) {
            console.error('Import error:', error);
            alert('Failed to import file: ' + error.message);
            setLoading(false);
        }

        e.target.value = null;
    };

    const insertStudents = async (studentsToInsert) => {
        if (studentsToInsert.length > 0) {
            try {
                const { error } = await supabase
                    .from('students')
                    .upsert(studentsToInsert, { onConflict: 'student_reg_number' });

                if (error) throw error;
                alert(`Successfully imported ${studentsToInsert.length} students!`);
                fetchStudents();
            } catch (error) {
                console.error('Database insert error:', error);
                alert('Failed to save students: ' + error.message);
            } finally {
                setLoading(false);
            }
        } else {
            alert('No valid students found in file.');
            setLoading(false);
        }
    };

    const [viewReport, setViewReport] = useState(null); // { student, grades }
    const [loadingReport, setLoadingReport] = useState(false);
    const [showGuide, setShowGuide] = useState(false);

    const handleViewReport = async (student) => {
        setLoadingReport(true);
        try {
            // Fetch grades for this student (Defaulting to Term 1, Current Year for this demo)
            // In a real app, you'd want a selector for Term/Year in the modal
            const currentYear = new Date().getFullYear();
            const { data, error } = await supabase
                .from('grades')
                .select('*, subjects(name, category)')
                .eq('student_id', student.id)
                .eq('year', currentYear)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setViewReport({
                student,
                grades: data || [],
                term: 'Term 1', // Hardcoded for MVP, can be made dynamic
                year: currentYear
            });
        } catch (error) {
            console.error('Error fetching report:', error);
            alert('Failed to load report card.');
        } finally {
            setLoadingReport(false);
        }
    };

    return (
        <div className="admin-page-container">
            {viewReport && (
                <div className="report-modal-overlay" onClick={() => setViewReport(null)}>
                    <div className="report-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="no-print" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                            <h3 style={{ margin: 0 }}>Report Card Preview</h3>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button className="btn btn-primary" onClick={() => window.print()}>
                                    <Download size={16} /> Print Report
                                </button>
                                <button className="btn btn-secondary" onClick={() => setViewReport(null)}>
                                    <X size={16} /> Close
                                </button>
                            </div>
                        </div>
                        <div style={{ padding: '1rem', overflow: 'auto', maxHeight: '80vh' }}>
                            <ReportCard
                                student={viewReport.student}
                                grades={viewReport.grades}
                                term={viewReport.term}
                                year={viewReport.year}
                            />
                        </div>
                    </div>
                </div>
            )}

            {showGuide && (
                <ImportGuideModal
                    type="students"
                    onClose={() => setShowGuide(false)}
                    onProceed={() => {
                        setShowGuide(false);
                        document.getElementById('students-file-input').click();
                    }}
                />
            )}
            <input
                id="students-file-input"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleImport}
                style={{ display: 'none' }}
            />

            <div className="admin-header">
                <h2>Student Management</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <label
                        className="btn btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#e0f2fe', color: '#0284c7', cursor: 'pointer' }}
                        onClick={() => setShowGuide(true)}
                    >
                        <Upload size={20} />
                        Import Students
                    </label>
                    <button
                        className="btn btn-secondary"
                        onClick={handleExport}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', color: '#475569' }}
                    >
                        <Download size={20} />
                        Export
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? <X size={20} /> : <Plus size={20} />}
                        {showForm ? 'Cancel' : 'Add Student'}
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="admin-form-container" style={{ marginBottom: '2rem', padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3>Add / Update Student</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                        <div>
                            <label>Student Name *</label>
                            <input type="text" name="student_name" value={formData.student_name} onChange={handleInputChange} required className="form-control" />
                        </div>
                        <div>
                            <label>Reg Number *</label>
                            <input type="text" name="student_reg_number" value={formData.student_reg_number} onChange={handleInputChange} required className="form-control" placeholder="BHS/202X/XXXX" />
                        </div>
                        <div>
                            <label>House *</label>
                            <select name="house" value={formData.house} onChange={handleInputChange} required className="form-control">
                                <option value="">Select House</option>
                                <option value="Elgon House">Elgon House</option>
                                <option value="Nile House">Nile House</option>
                                <option value="Victoria House">Victoria House</option>
                                <option value="Rwenzori House">Rwenzori House</option>
                            </select>
                        </div>
                        <div>
                            <label>Class/Grade *</label>
                            <select name="class_grade" value={formData.class_grade} onChange={handleInputChange} required className="form-control">
                                <option value="">Select Class</option>
                                <option value="Senior 1">Senior 1</option>
                                <option value="Senior 2">Senior 2</option>
                                <option value="Senior 3">Senior 3</option>
                                <option value="Senior 4">Senior 4</option>
                                <option value="Senior 5">Senior 5</option>
                                <option value="Senior 6">Senior 6</option>
                            </select>
                        </div>
                        <div>
                            <label>Parent Name</label>
                            <input type="text" name="parent_name" value={formData.parent_name} onChange={handleInputChange} className="form-control" />
                        </div>
                        <div>
                            <label>Parent Email</label>
                            <input type="email" name="parent_email" value={formData.parent_email} onChange={handleInputChange} className="form-control" />
                        </div>
                        <div>
                            <label>Parent Phone</label>
                            <input type="tel" name="parent_phone" value={formData.parent_phone} onChange={handleInputChange} className="form-control" />
                        </div>
                        <div>
                            <label>Valid Until</label>
                            <input type="date" name="valid_until" value={formData.valid_until} onChange={handleInputChange} className="form-control" />
                        </div>
                        <div>
                            <label>Photo URL</label>
                            <input type="text" name="photo_url" value={formData.photo_url} onChange={handleInputChange} className="form-control" />
                        </div>
                        <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary"><Save size={18} /> Save Student</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="filters-bar" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="Search by name or reg number..."
                        value={filters.search_query}
                        onChange={e => setFilters({ ...filters, search_query: e.target.value })}
                        style={{ width: '100%', padding: '0.625rem 1rem 0.625rem 2.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                    />
                </div>
                <select
                    value={filters.class_grade}
                    onChange={e => setFilters({ ...filters, class_grade: e.target.value })}
                    style={{ padding: '0.625rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem', minWidth: '150px' }}
                >
                    <option value="">All Classes</option>
                    <option value="Senior 1">Senior 1</option>
                    <option value="Senior 2">Senior 2</option>
                    <option value="Senior 3">Senior 3</option>
                    <option value="Senior 4">Senior 4</option>
                    <option value="Senior 5">Senior 5</option>
                    <option value="Senior 6">Senior 6</option>
                </select>
            </div>

            <div className="students-list">
                {loading ? (
                    <p>Loading students...</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                                    <th style={{ padding: '1rem' }}>Name</th>
                                    <th style={{ padding: '1rem' }}>Reg No</th>
                                    <th style={{ padding: '1rem' }}>Class</th>
                                    <th style={{ padding: '1rem' }}>House</th>
                                    <th style={{ padding: '1rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map(student => (
                                    <tr key={student.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {student.photo_url ? (
                                                    <img src={student.photo_url} alt="" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} />
                                                ) : <User size={20} />}
                                                {student.student_name}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>{student.student_reg_number}</td>
                                        <td style={{ padding: '1rem' }}>{student.class_grade}</td>
                                        <td style={{ padding: '1rem' }}>{student.house}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <button
                                                onClick={() => handleViewReport(student)}
                                                className="btn-icon"
                                                style={{ marginRight: '0.5rem', color: '#6366f1' }}
                                                title="View Report Card"
                                            >
                                                <FileText size={18} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setFormData(student);
                                                    setShowForm(true);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className="btn-icon"
                                                style={{ marginRight: '0.5rem', color: 'blue' }}
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(student.id)}
                                                className="btn-icon"
                                                style={{ color: 'red' }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentsManager;
