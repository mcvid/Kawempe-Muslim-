"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function RegisterStudentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        class_name: "",
        gender: "Male",
        admission_number: "",
        parent_name: "",
        parent_contact: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => formData.append(key, value));

            // Dynamically import action to avoid build issues if mixed
            const { registerStudent } = await import("@/app/actions/registerStudent");
            const result = await registerStudent(null, formData);

            if (result?.error) throw new Error(result.error);

            alert(`Success! Student registered.\n\nLogin ID: ${form.admission_number}\nPassword: ${form.admission_number}`);
            router.push("/admin/students");
        } catch (err: any) {
            console.error("Error registering student:", err);
            alert("Failed to register student: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto py-12 px-4">
            <Link
                href="/admin/students"
                className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 text-sm font-medium"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Students
            </Link>

            <h1 className="text-3xl font-bold text-slate-900 mb-2">Register New Student</h1>
            <p className="text-slate-500 mb-8">Fill in the details below to add a student to the registry.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. John Mugisha"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600/30 focus:border-green-600 transition-all"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Class</label>
                        <select
                            name="class_name"
                            value={form.class_name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600/30 focus:border-green-600 transition-all bg-white"
                        >
                            <option value="">Select Class</option>
                            <option value="S1">Senior 1</option>
                            <option value="S2">Senior 2</option>
                            <option value="S3">Senior 3</option>
                            <option value="S4">Senior 4</option>
                            <option value="S5">Senior 5</option>
                            <option value="S6">Senior 6</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                        <select
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600/30 focus:border-green-600 transition-all bg-white"
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Admission Number</label>
                    <input
                        type="text"
                        name="admission_number"
                        value={form.admission_number}
                        onChange={handleChange}
                        placeholder="e.g. KM-ST-2026-001"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600/30 focus:border-green-600 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Parent/Guardian Name</label>
                    <input
                        type="text"
                        name="parent_name"
                        value={form.parent_name}
                        onChange={handleChange}
                        placeholder="e.g. Mary Mugisha"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600/30 focus:border-green-600 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Parent Contact</label>
                    <input
                        type="tel"
                        name="parent_contact"
                        value={form.parent_contact}
                        onChange={handleChange}
                        placeholder="e.g. +256 7XX XXX XXX"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600/30 focus:border-green-600 transition-all"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-[#006400] hover:bg-green-800 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Registering...
                        </>
                    ) : (
                        "Register Student"
                    )}
                </button>
            </form>
        </div>
    );
}
