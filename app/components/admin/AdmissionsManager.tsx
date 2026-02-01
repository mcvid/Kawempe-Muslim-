"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import {
    Plus, Trash2, Save, X,
    Settings, MessageSquare, CheckCircle,
    Users, Eye, Search, Download
} from 'lucide-react';
import { sendApplicationApprovalEmail, sendApplicationRejectionEmail } from '@/app/utils/emailService';

const AdmissionsManager = () => {
    const [activeTab, setActiveTab] = useState('applications');
    const [settings, setSettings] = useState<any>({});
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewApp, setViewApp] = useState<any>(null);
    const [selectedHouse, setSelectedHouse] = useState('Kyaddondo');
    const [searchQuery, setSearchQuery] = useState('');

    const houses = [
        { name: 'Kyaddondo', color: 'bg-blue-600', text: 'text-blue-600' },
        { name: 'Mivule', color: 'bg-green-600', text: 'text-green-600' },
        { name: 'Mbogo', color: 'bg-red-600', text: 'text-red-600' },
        { name: 'Kakungulu', color: 'bg-yellow-500', text: 'text-yellow-600' }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [s, inq, apps] = await Promise.all([
                supabase.from('admissions_settings').select('*').maybeSingle(),
                supabase.from('admissions_inquiries').select('*').order('created_at', { ascending: false }),
                supabase.from('admission_applications').select('*').order('created_at', { ascending: false }),
            ]);

            if (s.data) setSettings(s.data);
            setInquiries(inq.data || []);
            setApplications(apps.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        try {
            const { error } = await supabase.from('admissions_settings').update(settings).eq('id', settings.id);
            if (error) throw error;
            alert('Settings updated successfully');
            fetchData();
        } catch (error: any) {
            alert('Error updating settings: ' + error.message);
        }
    };

    const updateApplicationStatus = async (id: string, status: string) => {
        try {
            const { data, error } = await supabase // Changed to destructure data and error
                .from('admission_applications')
                .update({ status })
                .eq('id', id);

            if (error) throw error;

            if (status === 'rejected' && viewApp) {
                await sendApplicationRejectionEmail(viewApp);
            }

            alert(`Application status updated to ${status}`);
            fetchData();
            if (viewApp && viewApp.id === id) setViewApp({ ...viewApp, status });
        } catch (error: any) {
            alert('Error updating application: ' + error.message);
        }
    };

    const updateInquiryStatus = async (id: string, status: string) => {
        const { error } = await supabase.from('admissions_inquiries').update({ status }).eq('id', id);
        if (error) alert(error.message);
        else fetchData();
    };

    const handleApprove = async (app: any) => {
        if (!confirm(`Approve application for ${app.student_name} and create student record?`)) return;

        try {
            const year = new Date().getFullYear();
            const random = Math.floor(1000 + Math.random() * 9000);
            const regNo = `KMS/${year}/${random}`;

            const { error: studentError } = await supabase.from('students').insert([{
                student_name: app.student_name,
                student_reg_number: regNo,
                parent_name: app.parent_name,
                parent_email: app.parent_email,
                parent_phone: app.parent_phone,
                house: selectedHouse,
                class_grade: app.entry_class || 'Senior 1',
                valid_until: `${year + 4}-12-31`
            }]);

            if (studentError) throw studentError;

            const { error: appError } = await supabase
                .from('admission_applications')
                .update({ status: 'approved' })
                .eq('id', app.id);

            if (appError) throw appError;

            await sendApplicationApprovalEmail(app, regNo);

            alert(`Success! Student created with Reg No: ${regNo} in ${selectedHouse} House.`);
            setViewApp(null);
            fetchData();

        } catch (error: any) {
            console.error('Approval Error:', JSON.stringify(error, null, 2));
            const msg = error.message || error.details || 'Unknown error occurred. Check console for details.';
            alert('Failed to approve: ' + msg);
        }
    };

    const handleDeleteInquiry = async (id: string) => {
        if (!window.confirm('Delete this inquiry?')) return;
        const { error } = await supabase.from('admissions_inquiries').delete().eq('id', id);
        if (error) alert(error.message);
        else fetchData();
    };

    const filteredApplications = applications.filter(app =>
        app.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.reference_no && app.reference_no.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const renderApplicationModal = () => {
        if (!viewApp) return null;

        const parent = viewApp.parent_details || {};
        const mother = parent.mother || {};
        const father = parent.father || {};
        const emergency = parent.emergency || {};
        const docs = viewApp.documents || {};
        const interests = viewApp.interests || {};

        return (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-[2000] p-4 lg:pl-80">
                <div className="bg-white w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-xl border border-slate-200 relative shadow-2xl">
                    <button
                        onClick={() => setViewApp(null)}
                        className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="p-8 md:p-10">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row gap-8 items-start mb-10 pb-10 border-b border-slate-100">
                            <div className="w-28 h-28 rounded-2xl bg-slate-50 border border-slate-100 flex-shrink-0 overflow-hidden">
                                {(docs.photo_url || viewApp.photo_url) ? (
                                    <img src={docs.photo_url || viewApp.photo_url} alt={viewApp.student_name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Users className="w-10 h-10 text-slate-200" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${viewApp.status === 'approved' ? 'bg-green-100 text-green-700' :
                                        viewApp.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {viewApp.status}
                                    </span>
                                    <span className="text-slate-400 font-mono text-xs">REF: {viewApp.reference_no}</span>
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900 font-[var(--font-barlow)] uppercase tracking-tight mb-1">
                                    {viewApp.student_name}
                                </h2>
                                <p className="text-slate-500 text-sm">Targeting <span className="text-[#006400] font-bold">{viewApp.entry_class}</span> • Shared on {new Date(viewApp.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-10">
                            {/* Student Data */}
                            <div className="lg:col-span-1 space-y-8">
                                <div>
                                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Student Details</h3>
                                    <div className="space-y-4">
                                        <InfoField label="Gender" value={viewApp.gender} />
                                        <InfoField label="Date of Birth" value={viewApp.date_of_birth} />
                                        <InfoField label="Address" value={viewApp.address} />
                                        <InfoField label="Nationality" value={viewApp.nationality} />
                                        <InfoField label="Religion" value={viewApp.religion} />
                                        <InfoField label="Program" value={viewApp.program} />
                                        <InfoField label="Previous School" value={viewApp.previous_school} />
                                        <InfoField label="PLE Aggregates" value={viewApp.ple_aggregates} />
                                        {viewApp.uce_aggregates && <InfoField label="UCE Aggregates" value={viewApp.uce_aggregates} />}
                                        <InfoField label="Disability Status" value={viewApp.disability || 'None Reported'} />
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Personal Statement</h3>
                                    <p className="text-xs text-slate-500 italic mb-1">&quot;The student is {viewApp.entry_class} candidate...&quot;</p>
                                    <p className="text-xs text-slate-500 italic mb-1">Previous School: &quot;{viewApp.previous_school}&quot;</p>
                                    <p className="text-sm text-slate-600 italic leading-relaxed">
                                        &quot;{viewApp.description || 'No description provided'}&quot;
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Documents</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {docs.ple_slip_url && <DocLink label="PLE Slip" url={docs.ple_slip_url} />}
                                        {docs.uce_slip_url && <DocLink label="UCE Slip" url={docs.uce_slip_url} />}
                                        {docs.recommendation_url && <DocLink label="Rec. Letter" url={docs.recommendation_url} />}
                                        {docs.mother_id_url && <DocLink label="Mother ID" url={docs.mother_id_url} />}
                                        {docs.father_id_url && <DocLink label="Father ID" url={docs.father_id_url} />}
                                    </div>
                                </div>
                            </div>

                            {/* Family Data */}
                            <div className="lg:col-span-1 space-y-8 border-l border-slate-100 pl-12">
                                <div>
                                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Mother&apos;s Details ({mother.status || 'N/A'})</h3>
                                    {mother.surname ? (
                                        <div className="space-y-3 text-sm">
                                            <p><span className="text-slate-400">Name:</span> <strong>{mother.surname} {mother.given_name}</strong></p>
                                            <p><span className="text-slate-400">Phone:</span> <strong>{mother.phone}</strong></p>
                                            <p><span className="text-slate-400">Job:</span> <strong>{mother.occupation}</strong></p>
                                        </div>
                                    ) : <p className="text-xs text-slate-300 italic">No mother details provided</p>}
                                </div>

                                <div>
                                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Father&apos;s Details ({father.status || 'N/A'})</h3>
                                    {father.surname ? (
                                        <div className="space-y-3 text-sm">
                                            <p><span className="text-slate-400">Name:</span> <strong>{father.surname} {father.given_name}</strong></p>
                                            <p><span className="text-slate-400">Phone:</span> <strong>{father.phone}</strong></p>
                                            <p><span className="text-slate-400">Job:</span> <strong>{father.occupation}</strong></p>
                                        </div>
                                    ) : <p className="text-xs text-slate-300 italic">No father details provided</p>}
                                </div>

                                <div>
                                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Emergency Contact</h3>
                                    <div className="p-4 bg-orange-50/50 rounded-lg text-sm border border-orange-100">
                                        <p className="font-bold text-orange-900">{emergency.surname} {emergency.given_name}</p>
                                        <p className="text-orange-700">{emergency.relation} • {emergency.phone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Interests Data */}
                            <div className="lg:col-span-1 space-y-8 border-l border-slate-100 pl-12">
                                <div>
                                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Student Interests</h3>
                                    <div className="space-y-6">
                                        {Object.entries(interests).map(([category, list]: [string, any]) => (
                                            list.length > 0 && (
                                                <div key={category}>
                                                    <span className="block text-[10px] text-slate-400 uppercase font-bold mb-1.5">{category}</span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {list.map((item: string, i: number) => (
                                                            <span key={i} className="px-2 py-1 bg-slate-100 rounded text-[10px] font-medium text-slate-600 uppercase">
                                                                {item}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Panel */}
                        <div className="pt-10 border-t border-slate-100">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex-1">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Assign House</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {houses.map(h => (
                                            <button
                                                key={h.name}
                                                onClick={() => setSelectedHouse(h.name)}
                                                className={`px-4 py-2 rounded-lg text-[10px] font-bold transition-all border ${selectedHouse === h.name
                                                    ? `${h.color} text-white border-transparent`
                                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                                    }`}
                                            >
                                                {h.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => updateApplicationStatus(viewApp.id, 'under_review')}
                                        className="px-6 py-3 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-slate-50"
                                    >
                                        Mark Under Review
                                    </button>
                                    <button
                                        onClick={() => handleApprove(viewApp)}
                                        className="px-8 py-3 bg-[#006400] text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-green-800 flex items-center gap-2"
                                    >
                                        <CheckCircle className="w-4 h-4" /> Accept &amp; Enroll
                                    </button>
                                    <button
                                        onClick={() => updateApplicationStatus(viewApp.id, 'rejected')}
                                        className="px-6 py-3 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-red-100 hover:bg-red-100"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {renderApplicationModal()}

            {/* Header Area */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 font-[var(--font-barlow)] uppercase tracking-tight">
                        Admissions <span className="text-[#006400]">Manager</span>
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Refined enrollment pipeline and inquiry management.</p>
                </div>

                <div className="flex gap-4 border-l border-slate-200 pl-6">
                    {[
                        { id: 'applications', label: 'Applications', icon: Users },
                        { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
                        { id: 'settings', label: 'Settings', icon: Settings },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === tab.id
                                ? 'bg-[#006400] text-white'
                                : 'text-slate-500 hover:bg-slate-100'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4 text-slate-400">
                    <div className="w-8 h-8 border-2 border-slate-200 border-t-[#006400] rounded-full animate-spin" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">Loading Pipeline...</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {activeTab === 'applications' && (
                        <div className="space-y-6">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                <input
                                    type="text"
                                    placeholder="Search by student name or reference number..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006400] font-medium text-sm"
                                />
                            </div>

                            {/* Table */}
                            <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200">
                                            <th className="px-4 md:px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Applicant</th>
                                            <th className="hidden md:table-cell px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reference</th>
                                            <th className="hidden md:table-cell px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entry Class</th>
                                            <th className="px-4 md:px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                            <th className="px-4 md:px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Review</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredApplications.map(app => (
                                            <tr key={app.id} className="hover:bg-slate-50/50">
                                                <td className="px-4 md:px-6 py-4">
                                                    <div className="font-bold text-slate-700 text-sm">{app.student_name}</div>
                                                    <div className="md:hidden font-mono text-[9px] text-[#006400]">#{app.reference_no}</div>
                                                </td>
                                                <td className="hidden md:table-cell px-6 py-4 font-mono text-xs text-[#006400]">#{app.reference_no}</td>
                                                <td className="hidden md:table-cell px-6 py-4 text-slate-500 text-sm">{app.entry_class}</td>
                                                <td className="px-4 md:px-6 py-4">
                                                    <span className={`px-2 py-1 text-[9px] md:text-[10px] font-bold uppercase rounded ${app.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                        app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                                        }`}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 md:px-6 py-4 text-right">
                                                    <button onClick={() => setViewApp(app)} className="text-slate-400 hover:text-[#006400]">
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'inquiries' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {inquiries.map(inq => (
                                <div key={inq.id} className="bg-white p-6 rounded-xl border border-slate-200 border-l-4 border-l-[#006400]">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-bold text-slate-900">{inq.name}</h3>
                                        <span className={`px-2 py-0.5 text-[8px] font-bold uppercase rounded ${inq.status === 'pending' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400'
                                            }`}>{inq.status}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded italic">{inq.message}</p>
                                    <div className="flex justify-between items-center pt-2">
                                        <div className="text-[10px] text-slate-400">
                                            {inq.email} • {inq.phone}
                                        </div>
                                        <div className="flex gap-1">
                                            {inq.status === 'pending' && (
                                                <button onClick={() => updateInquiryStatus(inq.id, 'reviewed')} className="p-1.5 text-green-600 hover:bg-green-50 rounded">
                                                    <CheckCircle className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button onClick={() => handleDeleteInquiry(inq.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="bg-white rounded-xl border border-slate-200 p-10 max-w-3xl">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 uppercase">System Configuration</h3>
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Portal Title</label>
                                        <input type="text" value={settings.title || ''} onChange={e => setSettings({ ...settings, title: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-sm" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Academic Year</label>
                                        <input type="text" value={settings.academic_year || ''} onChange={e => setSettings({ ...settings, academic_year: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-sm" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Notification Email</label>
                                    <input type="email" value={settings.inquiry_email || ''} onChange={e => setSettings({ ...settings, inquiry_email: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-sm" />
                                </div>
                                <button onClick={handleSaveSettings} className="px-8 py-3 bg-[#006400] text-white text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-2">
                                    <Save className="w-4 h-4" /> Save Configuration
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const InfoField = ({ label, value }: { label: string, value: string }) => (
    <div>
        <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">{label}</span>
        <span className="font-semibold text-slate-800 text-sm">{value || 'N/A'}</span>
    </div>
);

const DocLink = ({ label, url }: { label: string, url: string }) => (
    <a href={url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded text-[10px] font-bold text-[#006400] hover:bg-slate-100 transition-all flex items-center gap-1.5 uppercase">
        <Download className="w-3 h-3" /> {label}
    </a>
);

export default AdmissionsManager;
