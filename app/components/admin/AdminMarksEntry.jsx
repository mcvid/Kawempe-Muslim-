import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Search, Trash2, Edit, Save, X, Download, Upload, FileText } from 'lucide-react';
import ImportGuideModal from '../../components/ImportGuideModal';
import './AdminMarksEntry.css';

const AdminMarksEntry = () => {
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [filters, setFilters] = useState({
        class_grade: '',
        subject_id: '',
        term: 'Term 1',
        year: new Date().getFullYear()
    });
    const [marksData, setMarksData] = useState({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [selectedStudentMeta, setSelectedStudentMeta] = useState(null); // For modal
    const [metadata, setMetadata] = useState({}); // { studentId: { ... } }
    const [competencies, setCompetencies] = useState({}); // { studentId: [ ... ] }

    // Fetch subjects based on selected class
    useEffect(() => {
        const fetchSubjects = async () => {
            if (!filters.class_grade) {
                const { data } = await supabase.from('subjects').select('*').order('name');
                setSubjects(data || []);
                return;
            }

            // Fetch ONLY subjects associated with this class
            const { data: classSubjects, error } = await supabase
                .from('class_subjects')
                .select('subject_id, subjects(*)')
                .eq('class_name', filters.class_grade);

            if (error) {
                console.error('Error fetching class subjects:', error);
                setSubjects([]);
            } else if (classSubjects) {
                // Map the joined data to get the subject details
                const flattenedSubjects = classSubjects
                    .map(cs => cs.subjects)
                    .filter(s => !!s)
                    .sort((a, b) => a.name.localeCompare(b.name));
                setSubjects(flattenedSubjects);
            }
        };
        fetchSubjects();
    }, [filters.class_grade]);

    // Fetch students and existing marks when filters change
    useEffect(() => {
        if (!filters.class_grade || !filters.subject_id) return;
        fetchData();
    }, [filters.class_grade, filters.subject_id, filters.term, filters.year]);

    const fetchData = async () => {
        setLoading(true);
        setMessage(null);
        try {
            // 1. Get Students in Class
            const { data: studentsData, error: studentError } = await supabase
                .from('students')
                .select('id, student_name, student_reg_number')
                .eq('class_grade', filters.class_grade)
                .order('student_name');

            if (studentError) throw studentError;

            // 2. Get Existing Grades for these students, subject, term, year
            const studentIds = studentsData.map(s => s.id);
            if (studentIds.length === 0) {
                setStudents([]);
                setLoading(false);
                return;
            }

            const { data: gradesData, error: gradesError } = await supabase
                .from('grades')
                .select('*')
                .in('student_id', studentIds)
                .eq('subject_id', filters.subject_id)
                .eq('term', filters.term)
                .eq('year', filters.year);

            if (gradesError) throw gradesError;

            // 3. Map grades to state
            const initialMarks = {};
            gradesData.forEach(g => {
                initialMarks[g.student_id] = g.marks;
            });

            setStudents(studentsData);
            setMarksData(initialMarks);

            // 4. Get Metadata and Competencies for these students
            fetchBatchMetadata(studentIds);

        } catch (error) {
            console.error('Error fetching data:', error);
            setMessage({ type: 'error', text: 'Failed to load data' });
        } finally {
            setLoading(false);
        }
    };

    const fetchBatchMetadata = async (studentIds) => {
        try {
            const { data: metaData } = await supabase
                .from('report_metadata')
                .select('*')
                .in('student_id', studentIds)
                .eq('term', filters.term)
                .eq('year', filters.year);

            const metaMap = {};
            metaData?.forEach(m => {
                metaMap[m.student_id] = m;
            });
            setMetadata(metaMap);

            const { data: compData } = await supabase
                .from('competencies')
                .select('*')
                .in('student_id', studentIds)
                .eq('term', filters.term)
                .eq('year', filters.year);

            const compMap = {};
            compData?.forEach(c => {
                if (!compMap[c.student_id]) compMap[c.student_id] = [];
                compMap[c.student_id].push(c);
            });
            setCompetencies(compMap);
        } catch (err) {
            console.error('Error fetching batch metadata:', err);
        }
    };

    const handleMarkChange = (studentId, value) => {
        setMarksData(prev => ({
            ...prev,
            [studentId]: value
        }));
    };

    // Calculate Grade logic
    const calculateGrade = (mark) => {
        const m = parseInt(mark);
        if (isNaN(m)) return '';
        if (m >= 80) return 'A';
        if (m >= 70) return 'B';
        if (m >= 60) return 'C';
        if (m >= 50) return 'D';
        if (m >= 40) return 'E';
        return 'F';
    };

    const handleSave = async () => {
        if (!filters.subject_id) return;
        setSaving(true);
        setMessage(null);

        const upsertData = [];
        Object.entries(marksData).forEach(([studentId, mark]) => {
            if (mark !== '' && mark !== undefined) {
                upsertData.push({
                    student_id: studentId,
                    subject_id: filters.subject_id,
                    term: filters.term,
                    year: filters.year,
                    marks: parseInt(mark),
                    grade: calculateGrade(mark)
                });
            }
        });

        if (upsertData.length === 0) {
            setSaving(false);
            return;
        }

        try {
            // Upsert allows updating existing rows based on the UNIQUE constraint
            const { error } = await supabase
                .from('grades')
                .upsert(upsertData, { onConflict: 'student_id, subject_id, term, year' });

            if (error) throw error;
            setMessage({ type: 'success', text: `Successfully saved ${upsertData.length} grades!` });
        } catch (error) {
            console.error('Save error:', error);
            setMessage({ type: 'error', text: 'Failed to save grades: ' + error.message });
        } finally {
            setSaving(false);
        }
    };

    const handleSaveMetadata = async (studentId, studentMeta, studentComps) => {
        setSaving(true);
        try {
            // 1. Upsert Metadata
            const { error: metaError } = await supabase
                .from('report_metadata')
                .upsert([{
                    student_id: studentId,
                    term: filters.term,
                    year: filters.year,
                    ...studentMeta
                }], { onConflict: 'student_id, term, year' });

            if (metaError) throw metaError;

            // 2. Upsert Competencies
            if (studentComps.length > 0) {
                const compsToSave = studentComps.map(c => ({
                    student_id: studentId,
                    term: filters.term,
                    year: filters.year,
                    skill_name: c.skill_name,
                    achievement_level: c.achievement_level
                }));

                const { error: compError } = await supabase
                    .from('competencies')
                    .upsert(compsToSave, { onConflict: 'student_id, term, year, skill_name' });

                if (compError) throw compError;
            }

            // Update local state
            setMetadata(prev => ({ ...prev, [studentId]: studentMeta }));
            setCompetencies(prev => ({ ...prev, [studentId]: studentComps }));

            setSelectedStudentMeta(null);
            setMessage({ type: 'success', text: 'General remarks saved successfully!' });
        } catch (error) {
            console.error('Error saving metadata:', error);
            alert('Failed to save general remarks');
        } finally {
            setSaving(false);
        }
    };

    // Helper for Enter key navigation
    const handleKeyDown = (e, index) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const nextInput = document.getElementById(`mark-input-${index + 1}`);
            if (nextInput) {
                nextInput.focus();
                nextInput.select(); // Select text for easy overwrite
            }
        }
    };

    // ... existing state ...
    const [importPreview, setImportPreview] = useState(null); // Data from Excel to preview
    const [showGuide, setShowGuide] = useState(false);

    // Excel Export: Generate PRE-FILLED Template (Students already listed)
    const handleExportTemplate = () => {
        if (!students.length) {
            alert('Please select a class and subject first.');
            return;
        }

        // Create a flat structure with Student Info + Empty Mark column
        const data = students.map(s => ({
            "Reg Number": s.student_reg_number,
            "Student Name": s.student_name,
            "Mark (0-100)": '' // Empty for teacher to fill
        }));

        import('xlsx').then(XLSX => {
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Marks");

            // Generate filename: Class_Subject_Term_Year
            const subjectName = subjects.find(s => s.id === filters.subject_id)?.name || 'Subject';
            const fileName = `${filters.class_grade}_${subjectName}_${filters.term}_${filters.year}_TEMPLATE.xlsx`.replace(/ /g, '_');

            XLSX.writeFile(workbook, fileName);
        });
    };

    // Excel Import: Read and Preview (Single Subject Mode)
    const handleBulkImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        import('xlsx').then(XLSX => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const bstr = event.target.result;
                const workbook = XLSX.read(bstr, { type: 'binary' });
                const wsname = workbook.SheetNames[0];
                const ws = workbook.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);

                // Map back to our state
                // We need to match Reg Numbers to Student IDs
                const newMarks = { ...marksData };
                let matchCount = 0;
                let errorCount = 0;

                data.forEach(row => {
                    const regNo = row["Reg Number"];
                    const mark = row["Mark (0-100)"];

                    if (regNo && mark !== undefined) {
                        const student = students.find(s => s.student_reg_number === regNo);
                        if (student) {
                            newMarks[student.id] = mark;
                            matchCount++;
                        } else {
                            errorCount++;
                            console.warn(`Student with RegNo ${regNo} not found in current list.`);
                        }
                    }
                });

                if (matchCount > 0) {
                    setMarksData(newMarks);
                    setMessage({ type: 'success', text: `Imported ${matchCount} marks! (${errorCount} errors/not found)` });
                    // Optional: You could show a specialized Preview Modal here instead of auto-applying
                } else {
                    alert('No matching students found in the file. Please ensure Reg Numbers match.');
                }
            };
            reader.readAsBinaryString(file);
            e.target.value = null; // Reset input
        });
    };

    // NEW: Multi-Subject Import (ALL subjects in one Excel)
    const handleMultiSubjectImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        setMessage(null);

        try {
            const XLSX = await import('xlsx');
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

                    // Get headers (first row keys) - these are the subject names
                    const headers = Object.keys(data[0]);
                    const regNoColumn = headers.find(h =>
                        h.toLowerCase().includes('reg') ||
                        h.toLowerCase().includes('number') ||
                        h.toLowerCase().includes('id')
                    );

                    if (!regNoColumn) {
                        alert('Could not find a Registration Number column in the Excel.');
                        setLoading(false);
                        return;
                    }

                    // Build subject name -> ID map from database
                    const subjectMap = {};
                    subjects.forEach(s => {
                        subjectMap[s.name.toLowerCase()] = s.id;
                        subjectMap[s.name.toLowerCase().replace(/\s/g, '')] = s.id; // No spaces version
                    });

                    // Get all students for lookup
                    const { data: allStudents } = await supabase
                        .from('students')
                        .select('id, student_reg_number, class_grade');

                    const studentMap = {};
                    allStudents.forEach(s => {
                        studentMap[s.student_reg_number] = s.id;
                    });

                    // Process each row
                    const gradesToInsert = [];
                    let skippedRows = 0;
                    let skippedMarks = 0;

                    data.forEach(row => {
                        const regNo = row[regNoColumn];
                        const studentId = studentMap[regNo];

                        if (!studentId) {
                            console.warn(`Student not found: ${regNo}`);
                            skippedRows++;
                            return;
                        }

                        // For each column (potential subject)
                        headers.forEach(header => {
                            // Skip the reg number and name columns
                            if (header === regNoColumn ||
                                header.toLowerCase().includes('name') ||
                                header.toLowerCase().includes('student')) {
                                return;
                            }

                            const markValue = row[header];

                            // Skip if mark is empty, "-", or undefined
                            if (markValue === undefined ||
                                markValue === null ||
                                markValue === '' ||
                                markValue === '-' ||
                                markValue === 'N/A' ||
                                markValue === 'n/a') {
                                skippedMarks++;
                                return;
                            }

                            // Find subject ID from header
                            const subjectId = subjectMap[header.toLowerCase()] ||
                                subjectMap[header.toLowerCase().replace(/\s/g, '')];

                            if (!subjectId) {
                                console.warn(`Subject not found in database: ${header}`);
                                return;
                            }

                            // Parse mark (handle numbers and strings)
                            const mark = parseInt(markValue);
                            if (isNaN(mark) || mark < 0 || mark > 100) {
                                console.warn(`Invalid mark value: ${markValue} for ${regNo} in ${header}`);
                                return;
                            }

                            gradesToInsert.push({
                                student_id: studentId,
                                subject_id: subjectId,
                                term: filters.term,
                                year: filters.year,
                                marks: mark,
                                grade: calculateGrade(mark)
                            });
                        });
                    });

                    if (gradesToInsert.length > 0) {
                        const { error } = await supabase
                            .from('grades')
                            .upsert(gradesToInsert, { onConflict: 'student_id, subject_id, term, year' });

                        if (error) throw error;

                        setMessage({
                            type: 'success',
                            text: `Imported ${gradesToInsert.length} grades successfully! (Skipped ${skippedRows} students, ${skippedMarks} empty/optional marks)`
                        });
                    } else {
                        alert('No valid grades found in the file.');
                    }

                } catch (err) {
                    console.error('Multi-subject import error:', err);
                    alert('Import failed: ' + err.message);
                } finally {
                    setLoading(false);
                    e.target.value = null;
                }
            };

            reader.readAsBinaryString(file);
        } catch (err) {
            console.error('Import error:', err);
            setLoading(false);
        }
    };

    // Export Multi-Subject Template (filtered by class)
    const handleExportMultiSubjectTemplate = async () => {
        if (!filters.class_grade) {
            alert('Please select a class first.');
            return;
        }

        // Fetch students for this class
        const { data: classStudents } = await supabase
            .from('students')
            .select('student_reg_number, student_name')
            .eq('class_grade', filters.class_grade)
            .order('student_name');

        if (!classStudents || classStudents.length === 0) {
            alert('No students found in this class.');
            return;
        }

        // Fetch ONLY subjects for this class from class_subjects junction table
        const { data: classSubjects, error: subjectError } = await supabase
            .from('class_subjects')
            .select('subject_id, is_compulsory, subjects(id, name, category)')
            .eq('class_name', filters.class_grade)
            .order('is_compulsory', { ascending: false });

        // If no class_subjects mapping exists, fall back to all subjects
        const subjectsToUse = classSubjects && classSubjects.length > 0
            ? classSubjects.map(cs => cs.subjects)
            : subjects;

        if (subjectsToUse.length === 0) {
            alert('No subjects configured for this class. Please set up class-subject mappings in the database.');
            return;
        }

        // Build template data with class-specific subjects as columns
        const templateData = classStudents.map(s => {
            const row = {
                "Reg Number": s.student_reg_number,
                "Student Name": s.student_name
            };
            // Add each subject as empty column
            subjectsToUse.forEach(subj => {
                if (subj && subj.name) {
                    row[subj.name] = '';
                }
            });
            return row;
        });

        const XLSX = await import('xlsx');
        const worksheet = XLSX.utils.json_to_sheet(templateData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "All_Marks");

        const fileName = `${filters.class_grade}_ALL_SUBJECTS_${filters.term}_${filters.year}_TEMPLATE.xlsx`.replace(/ /g, '_');
        XLSX.writeFile(workbook, fileName);
    };

    // Modal Component for General Remarks
    const RemarksModal = ({ student }) => {
        const studentMeta = metadata[student.id] || {
            attendance_present: 0,
            attendance_total: 90,
            conduct_rating: 'Good',
            responsibility_rating: 'Satisfactory',
            punctuality_rating: 'Good',
            teacher_remark: '',
            headteacher_remark: ''
        };

        const studentComps = competencies[student.id] || [
            { skill_name: 'Communication', achievement_level: 'Meets Expectations' },
            { skill_name: 'Critical Thinking', achievement_level: 'Meets Expectations' },
            { skill_name: 'Collaboration', achievement_level: 'Meets Expectations' },
            { skill_name: 'Creativity', achievement_level: 'Meets Expectations' }
        ];

        const [localMeta, setLocalMeta] = useState(studentMeta);
        const [localComps, setLocalComps] = useState(studentComps);

        return (
            <div className="modal-overlay" onClick={() => setSelectedStudentMeta(null)}>
                <div className="modal-content remarks-modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3>General Assessment: {student.student_name}</h3>
                        <button className="close-btn" onClick={() => setSelectedStudentMeta(null)}><X size={20} /></button>
                    </div>
                    <div className="modal-body">
                        <div className="admin-form-group">
                            <label>Attendance (Days Present / Total)</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={localMeta.attendance_present}
                                    onChange={e => setLocalMeta({ ...localMeta, attendance_present: parseInt(e.target.value) })}
                                />
                                <span>/</span>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={localMeta.attendance_total}
                                    onChange={e => setLocalMeta({ ...localMeta, attendance_total: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <div>
                                <label>Conduct</label>
                                <select
                                    className="form-control"
                                    value={localMeta.conduct_rating}
                                    onChange={e => setLocalMeta({ ...localMeta, conduct_rating: e.target.value })}
                                >
                                    <option>Excellent</option>
                                    <option>Good</option>
                                    <option>Satisfactory</option>
                                    <option>Needs Improvement</option>
                                </select>
                            </div>
                            <div>
                                <label>Punctuality</label>
                                <select
                                    className="form-control"
                                    value={localMeta.punctuality_rating}
                                    onChange={e => setLocalMeta({ ...localMeta, punctuality_rating: e.target.value })}
                                >
                                    <option>Excellent</option>
                                    <option>Good</option>
                                    <option>Satisfactory</option>
                                    <option>Needs Improvement</option>
                                </select>
                            </div>
                        </div>

                        <div className="competencies-entry-list" style={{ marginTop: '1rem' }}>
                            <label>Core Competencies</label>
                            {localComps.map((comp, idx) => (
                                <div key={idx} className="comp-entry-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.9rem' }}>{comp.skill_name}</span>
                                    <select
                                        className="form-control"
                                        style={{ width: 'auto' }}
                                        value={comp.achievement_level}
                                        onChange={e => {
                                            const newComps = [...localComps];
                                            newComps[idx].achievement_level = e.target.value;
                                            setLocalComps(newComps);
                                        }}
                                    >
                                        <option>Exceeds Expectations</option>
                                        <option>Meets Expectations</option>
                                        <option>Approaching Expectations</option>
                                        <option>Needs Support</option>
                                    </select>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '1rem' }}>
                            <label>Class Teacher's Remark</label>
                            <textarea
                                className="form-control"
                                value={localMeta.teacher_remark}
                                onChange={e => setLocalMeta({ ...localMeta, teacher_remark: e.target.value })}
                                rows="3"
                            ></textarea>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={() => setSelectedStudentMeta(null)}>Cancel</button>
                        <button className="btn btn-primary" onClick={() => handleSaveMetadata(student.id, localMeta, localComps)}>
                            {saving ? 'Saving...' : 'Save Assessment'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="admin-page-container">
            {selectedStudentMeta && <RemarksModal student={selectedStudentMeta} />}
            {showGuide && (
                <ImportGuideModal
                    type="grades"
                    onClose={() => setShowGuide(false)}
                    onProceed={() => {
                        setShowGuide(false);
                        document.getElementById('grades-file-input').click();
                    }}
                />
            )}
            <input
                id="grades-file-input"
                type="file"
                accept=".xlsx, .xls"
                onChange={handleBulkImport}
                style={{ display: 'none' }}
            />
            <div className="admin-header">
                <h2>Enter Student Marks</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {filters.class_grade && (
                        <>
                            <div style={{ borderRight: '1px solid #ddd', paddingRight: '1rem', marginRight: '0.5rem' }}>
                                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>All Subjects</span>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn btn-outline btn-sm" onClick={handleExportMultiSubjectTemplate} title="Download template with ALL subjects">
                                        <Download size={14} /> Full Template
                                    </button>
                                    <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                                        <Upload size={14} /> Import All
                                        <input
                                            type="file"
                                            accept=".xlsx, .xls"
                                            onChange={handleMultiSubjectImport}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                </div>
                            </div>
                        </>
                    )}
                    {filters.class_grade && filters.subject_id && (
                        <>
                            <button className="btn btn-outline" onClick={handleExportTemplate} title="Download Excel Template">
                                <Download size={18} /> Template
                            </button>
                            <label className="btn btn-outline" style={{ cursor: 'pointer' }} title="Upload Filled Excel" onClick={() => setShowGuide(true)}>
                                <Upload size={18} /> Import
                            </label>
                        </>
                    )}
                    {message && (
                        // ... existing render code ...
                        <div style={{
                            color: message.type === 'error' ? '#ef4444' : '#16a34a',
                            display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem'
                        }}>
                            {message.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                            {message.text}
                        </div>
                    )}
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={saving || students.length === 0}
                    >
                        {saving ? 'Saving...' : <><Save size={18} /> Save All</>}
                    </button>
                </div>
            </div>

            <div className="filters-bar">
                <select
                    value={filters.class_grade}
                    onChange={e => setFilters({ ...filters, class_grade: e.target.value, subject_id: '' })}
                    className="filter-select"
                >
                    <option value="">Select Class...</option>
                    <option value="Senior 1">Senior 1</option>
                    <option value="Senior 2">Senior 2</option>
                    <option value="Senior 3">Senior 3</option>
                    <option value="Senior 4">Senior 4</option>
                    <option value="Senior 5">Senior 5</option>
                    <option value="Senior 6">Senior 6</option>
                </select>

                <select
                    value={filters.subject_id}
                    onChange={e => setFilters({ ...filters, subject_id: e.target.value })}
                    className="filter-select"
                >
                    <option value="">Select Subject...</option>
                    {subjects.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                    ))}
                </select>

                <select
                    value={filters.term}
                    onChange={e => setFilters({ ...filters, term: e.target.value })}
                    className="filter-select"
                >
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Term 3">Term 3</option>
                </select>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading students...</div>
            ) : students.length > 0 ? (
                <div className="marks-grid">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Reg No</th>
                                <th style={{ width: '130px' }}>Marks (0-100)</th>
                                <th>Grade</th>
                                <th>General Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, index) => (
                                <tr key={student.id}>
                                    <td>{student.student_name}</td>
                                    <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{student.student_reg_number}</td>
                                    <td>
                                        <input
                                            id={`mark-input-${index}`}
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={marksData[student.id] || ''}
                                            onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            className="mark-input"
                                            placeholder="-"
                                        />
                                    </td>
                                    <td style={{ fontWeight: 'bold', color: calculateGrade(marksData[student.id]) === 'F' ? 'red' : 'green' }}>
                                        {calculateGrade(marksData[student.id])}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-outline btn-sm"
                                            onClick={() => setSelectedStudentMeta(student)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                                        >
                                            <FileText size={14} />
                                            {metadata[student.id] ? 'Edit Remarks' : 'Add Remarks'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    {filters.class_grade && filters.subject_id
                        ? 'No students found in this class.'
                        : 'Please select a Class and Subject to enter marks.'}
                </div>
            )}
        </div>
    );
};

export default AdminMarksEntry;
