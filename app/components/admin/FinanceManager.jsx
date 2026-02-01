import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Save, Printer, CreditCard, DollarSign, FileText, Upload, Download } from 'lucide-react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import ImportGuideModal from '../../components/ImportGuideModal';

const FinanceManager = () => {
    const [activeTab, setActiveTab] = useState('bursar'); // bursar, structure
    const [feesStructure, setFeesStructure] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [studentResults, setStudentResults] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [recentPayments, setRecentPayments] = useState([]);
    const [showGuide, setShowGuide] = useState(false);
    const [selectedClass, setSelectedClass] = useState(''); // New state for filter

    useEffect(() => {
        fetchFeesStructure();
    }, []);

    const fetchFeesStructure = async () => {
        const { data } = await supabase.from('fees_structure').select('*').order('class_name');
        setFeesStructure(data || []);
    };

    const formatUGX = (amount) => {
        return new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX', minimumFractionDigits: 0 }).format(amount || 0);
    };

    // SEARCH FOR STUDENT
    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSelectedStudent(null);
        setBalance(null);

        let query = supabase
            .from('students')
            .select('*')
            .ilike('student_name', `%${searchTerm}%`);

        // Apply Class Filter if selected
        if (selectedClass) {
            query = query.eq('class_grade', selectedClass);
        }

        const { data, error } = await query;

        if (data) setStudentResults(data);
        setLoading(false);
    };

    // SELECT STUDENT & FETCH BALANCE
    const selectStudent = async (student) => {
        setSelectedStudent(student);
        setStudentResults([]); // Clear list
        setSearchTerm('');
        setLoading(true);

        // Call RPC logic
        const { data: bal, error } = await supabase.rpc('get_student_balance', { student_uuid: student.id });
        setBalance(bal);

        // Fetch recent payments
        const { data: payments } = await supabase
            .from('fee_payments')
            .select('*')
            .eq('student_id', student.id)
            .order('created_at', { ascending: false })
            .limit(5);
        setRecentPayments(payments || []);

        setLoading(false);
    };

    // RECORD PAYMENT
    const handlePayment = async (e) => {
        e.preventDefault();
        if (!selectedStudent || !paymentAmount) return;

        setLoading(true);
        try {
            const amount = parseFloat(paymentAmount);

            const { error } = await supabase.from('fee_payments').insert([{
                student_id: selectedStudent.id,
                amount_paid: amount,
                payment_method: 'cash', // Logic could expand here
                captured_by: null // Would be auth.user.id
            }]);

            if (error) throw error;

            setSuccessMsg(`Payment of ${formatUGX(amount)} recorded for ${selectedStudent.student_name}`);
            setPaymentAmount('');

            // Refresh
            selectStudent(selectedStudent);

            // Auto-hide success
            setTimeout(() => setSuccessMsg(''), 5000);

        } catch (err) {
            alert('Payment Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateFee = async (id, amount) => {
        const { error } = await supabase.from('fees_structure').update({ term_fee_amount: amount }).eq('id', id);
        if (error) alert('Error updating fee');
        else fetchFeesStructure();
    };

    // --- BULK IMPORT LOGIC START ---
    const handleDownloadTemplate = async () => {
        // Fetch all students to create a comprehensive template
        const { data: allStudents, error } = await supabase
            .from('students')
            .select('student_reg_number, student_name, class_grade')
            .order('class_grade', { ascending: true })
            .order('student_name', { ascending: true });

        if (error || !allStudents || allStudents.length === 0) {
            alert('No students found in database. Please add students first.');
            return;
        }

        // Create pre-filled template with all students
        const data = allStudents.map(s => ({
            "Reg No": s.student_reg_number,
            "Student Name": s.student_name,
            "Class": s.class_grade,
            "Amount": '', // Empty for bursar to fill
            "Date": new Date().toISOString().split('T')[0], // Today's date as default
            "Ref No": '' // Optional reference
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Payments_Template");
        XLSX.writeFile(workbook, `BHS_Payments_Template_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    // Helper: Convert Excel serial date to YYYY-MM-DD format
    const excelDateToJSDate = (serial) => {
        if (!serial) return new Date().toISOString();

        // If it's already a string date, return it
        if (typeof serial === 'string' && (serial.includes('-') || serial.includes('/'))) {
            return serial;
        }

        // If it's a number (Excel serial date)
        if (typeof serial === 'number') {
            const utc_days = Math.floor(serial - 25569);
            const utc_value = utc_days * 86400;
            const date_info = new Date(utc_value * 1000);

            return date_info.toISOString();
        }

        return new Date().toISOString();
    };

    const handleBulkImportPayments = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setLoading(true);

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

                // 1. Fetch ALL students to map Reg No -> ID (Optimization)
                const { data: allStudents } = await supabase.from('students').select('id, student_reg_number');
                const studentMap = {};
                allStudents.forEach(s => {
                    studentMap[s.student_reg_number] = s.id;
                });

                const validInserts = [];
                let skipped = 0;

                // 2. Process Rows
                data.forEach(row => {
                    const regNo = row["Reg No"];
                    const amount = row["Amount"];
                    const date = row["Date"]; // Ensure handled as text/date correctly
                    const ref = row["Ref No"];

                    if (regNo && studentMap[regNo] && amount) {
                        validInserts.push({
                            student_id: studentMap[regNo],
                            amount_paid: amount,
                            payment_date: excelDateToJSDate(date),
                            payment_method: 'cash',
                            remarks: ref || 'Imported via Bulk Upload'
                        });
                    } else {
                        skipped++;
                        console.warn(`Skipping row: RegNo ${regNo} not found or invalid data.`);
                    }
                });

                if (validInserts.length > 0) {
                    const { error } = await supabase.from('fee_payments').insert(validInserts);
                    if (error) throw error;
                    alert(`Successfully imported ${validInserts.length} payments. Skiped ${skipped} invalid rows.`);
                } else {
                    alert(`No valid payments found. Checked ${data.length} rows.`);
                }
            } catch (err) {
                console.error(err);
                alert('Import Failed: ' + err.message);
            } finally {
                setLoading(false);
                e.target.value = null; // Reset input
            }
        };
        reader.readAsBinaryString(file);
    };
    // --- BULK IMPORT LOGIC END ---

    const printReceipt = (payment) => {
        // Simple print logic - in production use react-pdf or a dedicated window
        const win = window.open('', 'Receipt', 'width=400,height=600');
        win.document.write(`
            <html>
                <body style="font-family: monospace; text-align: center; padding: 2rem;">
                    <h2>BUGISU HIGH SCHOOL</h2>
                    <p>Official Receipt</p>
                    <hr/>
                    <div style="text-align: left; margin: 20px 0;">
                        <p><strong>Receipt No:</strong> #${payment.receipt_no}</p>
                        <p><strong>Date:</strong> ${new Date(payment.created_at).toLocaleString()}</p>
                        <p><strong>Student:</strong> ${selectedStudent.student_name}</p>
                        <p><strong>Reg No:</strong> ${selectedStudent.student_reg_number}</p>
                    </div>
                    <hr/>
                    <h1>${formatUGX(payment.amount_paid)}</h1>
                    <hr/>
                    <p>Paid via: ${payment.payment_method}</p>
                    <p style="margin-top: 50px;">Thank you!</p>
                </body>
            </html>
        `);
        win.print();
    };

    return (
        <div className="admin-page-container">
            {showGuide && (
                <ImportGuideModal
                    type="payments"
                    onClose={() => setShowGuide(false)}
                    onProceed={() => {
                        setShowGuide(false);
                        document.getElementById('payments-file-input').click();
                    }}
                />
            )}
            <input
                id="payments-file-input"
                type="file"
                accept=".xlsx, .xls"
                onChange={handleBulkImportPayments}
                style={{ display: 'none' }}
            />
            <div className="admin-header">
                <h2>Finance & Fees Management</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div className="bulk-actions" style={{ display: 'flex', gap: '5px', marginRight: '20px', paddingRight: '20px', borderRight: '1px solid #ddd' }}>
                        <button className="btn btn-outline" onClick={handleDownloadTemplate} title="Download Excel Template" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                            <Download size={14} /> Template
                        </button>
                        <label className="btn btn-outline" style={{ cursor: 'pointer', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} title="Upload Payments" onClick={() => setShowGuide(true)}>
                            <Upload size={14} /> Import
                        </label>
                    </div>

                    <button className={`btn ${activeTab === 'bursar' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('bursar')}>
                        <CreditCard size={18} /> Bursar Station
                    </button>
                    <button className={`btn ${activeTab === 'structure' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('structure')}>
                        <DollarSign size={18} /> Fee Structure
                    </button>
                </div>
            </div>

            {activeTab === 'structure' && (
                <div className="admin-content">
                    <h3>Termly Fees per Class (UGX)</h3>
                    <div className="admin-list">
                        {feesStructure.map(fee => (
                            <div key={fee.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'white', marginBottom: '0.5rem', alignItems: 'center', borderRadius: '8px' }}>
                                <strong>{fee.class_name}</strong>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <span>UGX</span>
                                    <input
                                        type="number"
                                        defaultValue={fee.term_fee_amount}
                                        onBlur={(e) => handleUpdateFee(fee.id, e.target.value)}
                                        style={{ padding: '0.5rem', width: '120px', fontWeight: 'bold' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'bursar' && (
                <div className="admin-content" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                    {/* LEFT: Search & Results */}
                    <div className="bursar-left">
                        <div className="search-bar" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            <input
                                type="text"
                                placeholder="Search Student Name..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }}
                            />
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', background: 'white' }}
                            >
                                <option value="">All Classes</option>
                                <option value="Senior 1">Senior 1</option>
                                <option value="Senior 2">Senior 2</option>
                                <option value="Senior 3">Senior 3</option>
                                <option value="Senior 4">Senior 4</option>
                                <option value="Senior 5">Senior 5</option>
                                <option value="Senior 6">Senior 6</option>
                            </select>
                            <button className="btn btn-primary" onClick={handleSearch}><Search size={18} /></button>
                        </div>

                        {studentResults.length > 0 && (
                            <div className="student-results-list" style={{ background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
                                {studentResults.map(s => (
                                    <div key={s.id} onClick={() => selectStudent(s)}
                                        style={{ padding: '0.75rem', cursor: 'pointer', borderBottom: '1px solid #eee', hover: { background: '#f9f9f9' } }}>
                                        <strong>{s.student_name}</strong> <span style={{ color: '#666' }}>({s.class_grade})</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {selectedStudent && (
                            <div className="student-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                                <h3>{selectedStudent.student_name}</h3>
                                <p style={{ color: '#666' }}>{selectedStudent.student_reg_number}</p>
                                <hr style={{ margin: '1rem 0', borderColor: '#eee' }} />

                                <div style={{ textAlign: 'center', margin: '2rem 0' }}>
                                    <p style={{ textTransform: 'uppercase', fontSize: '0.8rem', color: '#666' }}>Current Outstanding Balance</p>
                                    <h1 style={{ fontSize: '2.5rem', color: (balance && balance > 0) ? '#ef4444' : '#22c55e', margin: '0.5rem 0' }}>
                                        {formatUGX(balance)}
                                    </h1>
                                    {(balance && balance > 0) && <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '4px 12px', borderRadius: '100px', fontSize: '0.8rem' }}>NOT CLEARED</span>}
                                    {(balance !== null && balance <= 0) && <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '100px', fontSize: '0.8rem' }}>CLEARED</span>}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Payment Form */}
                    <div className="bursar-right">
                        {selectedStudent ? (
                            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px' }}>
                                <h4>Record New Payment</h4>
                                <form onSubmit={handlePayment}>
                                    <div style={{ margin: '1rem 0' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Amount (UGX)</label>
                                        <input
                                            type="number"
                                            value={paymentAmount}
                                            onChange={e => setPaymentAmount(e.target.value)}
                                            style={{ width: '100%', padding: '1rem', fontSize: '1.2rem', borderRadius: '8px', border: '1px solid #ccc' }}
                                            placeholder="500000"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
                                        Confirm Payment
                                    </button>
                                </form>

                                {successMsg && (
                                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#ecfdf5', color: '#047857', borderRadius: '8px', textAlign: 'center' }}>
                                        {successMsg}
                                    </div>
                                )}

                                <div className="recent-payments" style={{ marginTop: '2rem' }}>
                                    <h5>Recent Transactions</h5>
                                    {recentPayments.map(p => (
                                        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid #eee', fontSize: '0.9rem' }}>
                                            <span>{new Date(p.created_at).toLocaleDateString()}</span>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <strong>{formatUGX(p.amount_paid)}</strong>
                                                <span style={{ fontSize: '0.75rem', color: '#666', textTransform: 'capitalize' }}>
                                                    {p.payment_method === 'mobile_money' ? 'Mobile Money' : p.payment_method}
                                                </span>
                                            </div>
                                            <button className="btn-icon" onClick={() => printReceipt(p)} title="Print Receipt"><Printer size={14} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', border: '2px dashed #e2e8f0', borderRadius: '12px' }}>
                                Select a student to collect fees.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinanceManager;
