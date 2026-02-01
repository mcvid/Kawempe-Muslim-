"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import {
    CheckCircle,
    ChevronRight,
    ChevronLeft,
    Upload,
    FileText,
    User,
    Camera,
    Mail,
    MapPin,
} from "lucide-react";
import { Poppins } from "next/font/google";
import Image from "next/image";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-poppins",
});

type ParentDetails = {
    status: 'Alive' | 'Deceased';
    surname: string;
    given_name: string;
    phone: string;
    occupation: string;
    address_district: string;
    address_province: string;
};

type EmergencyContact = {
    relation: string;
    surname: string;
    given_name: string;
    phone: string;
    occupation: string;
    address_district: string;
    address_province: string;
};

type Interests = {
    academic: string[];
    sports: string[];
    creative: string[];
    social: string[];
    technology: string[];
};

type FormData = {
    student_name: string;
    address: string;
    date_of_birth: string;
    gender: string;
    class_of_interest: string;
    disability: string;
    description: string;

    // New structures
    mother: ParentDetails;
    father: ParentDetails;
    emergency: EmergencyContact;
    interests: Interests;

    // Kept for backward compatibility or simple view if needed, but mainly replaced
    parent_name: string;
    parent_phone: string;
    parent_email: string;

    photo_url: string;
    ple_slip_url: string;
    uce_slip_url: string;
    recommendation_url: string;
};

type FileState = {
    photo: File | null;
    ple_slip: File | null;
    uce_slip: File | null;
    recommendation: File | null;

    // Parent Files
    mother_id: File | null;
    mother_passport: File | null;
    mother_financial: File | null;

    father_id: File | null;
    father_passport: File | null;
    father_financial: File | null;
};

const ApplicationForm = () => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [referenceNo, setReferenceNo] = useState("");

    const [formData, setFormData] = useState<FormData>({
        student_name: "",
        address: "",
        date_of_birth: "",
        gender: "",
        class_of_interest: "S1",
        disability: "",
        description: "",

        mother: { status: 'Alive', surname: '', given_name: '', phone: '', occupation: '', address_district: '', address_province: '' },
        father: { status: 'Alive', surname: '', given_name: '', phone: '', occupation: '', address_district: '', address_province: '' },
        emergency: { relation: '', surname: '', given_name: '', phone: '', occupation: '', address_district: '', address_province: '' },

        interests: {
            academic: [],
            sports: [],
            creative: [],
            social: [],
            technology: []
        },

        parent_name: "",
        parent_phone: "",
        parent_email: "",
        photo_url: "",
        ple_slip_url: "",
        uce_slip_url: "",
        recommendation_url: "",
    });

    const [files, setFiles] = useState<FileState>({
        photo: null,
        ple_slip: null,
        uce_slip: null,
        recommendation: null,
        mother_id: null,
        mother_passport: null,
        mother_financial: null,
        father_id: null,
        father_passport: null,
        father_financial: null,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleParentChange = (parent: 'mother' | 'father', field: keyof ParentDetails, value: string) => {
        setFormData(prev => ({
            ...prev,
            [parent]: { ...prev[parent], [field]: value }
        }));
    };

    const handleEmergencyChange = (field: keyof EmergencyContact, value: string) => {
        setFormData(prev => ({
            ...prev,
            emergency: { ...prev.emergency, [field]: value }
        }));
    };

    const handleInterestChange = (category: keyof Interests, value: string) => {
        setFormData(prev => {
            const current = prev.interests[category];
            const updated = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return {
                ...prev,
                interests: { ...prev.interests, [category]: updated }
            };
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: keyof FileState) => {
        const file = e.target.files?.[0];
        if (file) {
            setFiles({ ...files, [type]: file });
        }
    };

    const uploadFile = async (file: File, path: string): Promise<string> => {
        const fileExt = file.name.split(".").pop();
        const fileName = `${path}/${Date.now()}.${fileExt}`;
        const { error } = await supabase.storage.from("applications").upload(fileName, file);

        if (error) throw error;

        const { data } = supabase.storage.from("applications").getPublicUrl(fileName);
        return data.publicUrl;
    };

    const generateRef = (): string => {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let result = "";
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Upload files
            let photoUrl = "";
            let pleSlipUrl = "";
            let uceSlipUrl = "";
            let recommendationUrl = "";
            let motherIdUrl = "";
            let fatherIdUrl = "";

            // Helper for uploading if file exists
            if (files.photo) photoUrl = await uploadFile(files.photo, "photos");
            if (files.ple_slip) pleSlipUrl = await uploadFile(files.ple_slip, "ple-slips");
            if (files.uce_slip) uceSlipUrl = await uploadFile(files.uce_slip, "uce-slips");
            if (files.recommendation) recommendationUrl = await uploadFile(files.recommendation, "recommendations");
            if (files.mother_id) motherIdUrl = await uploadFile(files.mother_id, "parent-ids");
            if (files.father_id) fatherIdUrl = await uploadFile(files.father_id, "parent-ids");


            const ref = generateRef();
            setReferenceNo(ref);

            // Construct Payload matching the new Schema
            const payload = {
                reference_no: ref,
                student_name: formData.student_name,
                gender: formData.gender,
                date_of_birth: formData.date_of_birth,
                address: formData.address,
                entry_class: formData.class_of_interest, // Mapped to entry_class
                disability: formData.disability,
                description: formData.description,

                // Parent / Guardian / Emergency Data -> JSONB
                parent_details: {
                    mother: formData.mother,
                    father: formData.father,
                    emergency: formData.emergency,
                    guardian_name: formData.parent_name || `${formData.father.surname} ${formData.father.given_name}`, // Fallback
                    guardian_phone: formData.parent_phone || formData.father.phone,
                    guardian_email: formData.parent_email
                },

                // Interests -> JSONB
                interests: formData.interests,

                // Documents -> JSONB
                documents: {
                    photo_url: photoUrl,
                    ple_slip_url: pleSlipUrl,
                    uce_slip_url: uceSlipUrl,
                    recommendation_url: recommendationUrl,
                    mother_id_url: motherIdUrl,
                    father_id_url: fatherIdUrl
                },

                // Backwards compatibility columns (optional, can keep or remove if schema allows nulls)
                parent_name: `${formData.father.surname} ${formData.father.given_name}`.trim() || formData.parent_name,
                parent_phone: formData.father.phone || formData.parent_phone,
                parent_email: formData.parent_email,
                photo_url: photoUrl, // Keep main photo in root col if exists
                result_slip_url: pleSlipUrl, // Map PLE to result slip generic
                nationality: (formData as any).nationality,
                religion: (formData as any).religion,
                ple_aggregates: (formData as any).ple_aggregates,
                uce_aggregates: (formData as any).uce_aggregates,
                program: (formData as any).program,
                previous_school: (formData as any).previous_school,

                status: "pending",
            };

            const { error } = await supabase.from("admission_applications").insert([payload]);

            if (error) throw error;
            setSuccess(true);
        } catch (error) {
            console.error("Error submitting application:", error);
            alert("Failed to submit application. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const isStep1Valid =
        formData.student_name && formData.date_of_birth && formData.gender && formData.address;
    const isStep2Valid = formData.parent_name && formData.parent_phone;

    // Success Screen
    if (success) {
        return (
            <div className={`min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-6 ${poppins.variable}`}>
                <div className="bg-white rounded-3xl p-10 max-w-lg w-full text-center shadow-xl">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <h2 className={`text-3xl font-bold text-gray-900 mb-4 ${poppins.className}`}>
                        Application Submitted!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Your application has been received successfully. Please save your reference number.
                    </p>

                    <div className="bg-green-50 border-2 border-dashed border-green-400 rounded-2xl p-6 mb-6">
                        <p className="text-sm text-green-700 font-semibold uppercase tracking-wider mb-2">
                            Reference Number
                        </p>
                        <h1 className={`text-4xl font-bold text-green-600 tracking-widest ${poppins.className}`}>
                            {referenceNo}
                        </h1>
                        <p className="text-sm text-green-600 mt-2">Keep this safe for status tracking</p>
                    </div>

                    <p className="text-gray-500 text-sm mb-6">
                        We will contact you within 3-5 business days regarding your application status.
                    </p>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => router.push("/")}
                            className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                        >
                            Return Home
                        </button>
                        <button
                            onClick={() => router.push("/admissions")}
                            className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                        >
                            Track Status
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-[#ECF7F8] pt-28 pb-8 px-4 sm:px-6 ${poppins.variable}`}>
            <div className="max-w-4xl mx-auto">
                {/* Progress Bar */}
                <div className="flex items-center justify-center mb-10">
                    {[1, 2, 3, 4, 5].map((num) => (
                        <React.Fragment key={num}>
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${step >= num
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 text-gray-500"
                                    }`}
                            >
                                {num}
                            </div>
                            {num < 5 && (
                                <div
                                    className={`w-8 sm:w-16 h-1 mx-1 rounded transition-all duration-300 ${step > num ? "bg-green-500" : "bg-gray-200"
                                        }`}
                                    style={{ borderStyle: "dotted" }}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Step 1: Student Details */}
                    {step === 1 && (
                        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className={`text-2xl font-bold text-gray-900 ${poppins.className}`}>
                                    Student&apos;s Details
                                </h2>
                                {/* Camera Icon */}
                                <label className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                                    <Camera className="w-6 h-6 text-gray-600" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, "photo")}
                                    />
                                </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        name="student_name"
                                        value={formData.student_name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Full name"
                                    />
                                </div>

                                {/* Class of Interest */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Class of interest
                                    </label>
                                    <select
                                        name="class_of_interest"
                                        value={formData.class_of_interest}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                    >
                                        <option value="S1">Senior 1</option>
                                        <option value="S2">Senior 2</option>
                                        <option value="S3">Senior 3</option>
                                        <option value="S4">Senior 4</option>
                                        <option value="S5">Senior 5</option>
                                        <option value="S6">Senior 6</option>
                                    </select>
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 pr-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                            placeholder="Home address"
                                        />
                                        <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>

                                {/* Disability */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Disability</label>
                                    <input
                                        type="text"
                                        name="disability"
                                        value={formData.disability}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-purple-50 border border-purple-100 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        placeholder="None or specify"
                                    />
                                </div>

                                {/* Date of Birth */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of birth</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            name="date_of_birth"
                                            value={formData.date_of_birth}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                    <div className="flex gap-6 items-center py-3">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="Male"
                                                checked={formData.gender === "Male"}
                                                onChange={handleChange}
                                                className="w-5 h-5 text-blue-500 focus:ring-blue-500"
                                            />
                                            <span className="text-gray-700">Male</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="Female"
                                                checked={formData.gender === "Female"}
                                                onChange={handleChange}
                                                className="w-5 h-5 text-green-500 focus:ring-green-500"
                                            />
                                            <span className="text-gray-700">Female</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Nationality */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                                    <input
                                        type="text"
                                        name="nationality"
                                        value={(formData as any).nationality || ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        placeholder="e.g. Ugandan"
                                    />
                                </div>

                                {/* Religion */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                                    <select
                                        name="religion"
                                        value={(formData as any).religion || ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                    >
                                        <option value="">Select Religion</option>
                                        <option value="Islam">Islam</option>
                                        <option value="Christian">Christian</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {/* Program */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Program Interested In</label>
                                    <select
                                        name="program"
                                        value={(formData as any).program || ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                    >
                                        <option value="">Select Program</option>
                                        <option value="Day">Day</option>
                                        <option value="Boarding">Boarding</option>
                                    </select>
                                </div>

                                {/* Previous School */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Previous School</label>
                                    <input
                                        type="text"
                                        name="previous_school"
                                        value={(formData as any).previous_school || ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        placeholder="e.g. Greenhill Academy"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                                    placeholder="Define yourself why are you interested in KMSS"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Parent/Guardian Details (Enhanced) */}
                    {step === 2 && (
                        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm">
                            <h2 className={`text-2xl font-bold text-gray-900 mb-2 ${poppins.className}`}>
                                Parent/Guardians&apos; details
                            </h2>
                            <p className="text-gray-500 mb-8">Parental information</p>

                            <ParentSection
                                title="Mother"
                                data={formData.mother}
                                onChange={(field, val) => handleParentChange('mother', field, val)}
                                files={{
                                    id: files.mother_id,
                                    passport: files.mother_passport,
                                    financial: files.mother_financial
                                }}
                                onFileChange={(type, file) => setFiles({ ...files, [`mother_${type}`]: file })}
                            />

                            <ParentSection
                                title="Father"
                                data={formData.father}
                                onChange={(field, val) => handleParentChange('father', field, val)}
                                files={{
                                    id: files.father_id,
                                    passport: files.father_passport,
                                    financial: files.father_financial
                                }}
                                onFileChange={(type, file) => setFiles({ ...files, [`father_${type}`]: file })}
                            />

                            {/* Emergency Contact */}
                            <div className="p-6 bg-white border-t border-gray-100">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Emergency Contact</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <input
                                        type="text"
                                        placeholder="RELATION (e.g. Uncle)"
                                        value={formData.emergency.relation}
                                        onChange={(e) => handleEmergencyChange('relation', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none text-sm"
                                    />
                                    <input
                                        type="tel"
                                        placeholder="TELEPHONE"
                                        value={formData.emergency.phone}
                                        onChange={(e) => handleEmergencyChange('phone', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none text-sm"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <input
                                        type="text"
                                        placeholder="SURNAME"
                                        value={formData.emergency.surname}
                                        onChange={(e) => handleEmergencyChange('surname', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none text-sm"
                                    />
                                    <input
                                        type="text"
                                        placeholder="GIVEN NAME"
                                        value={formData.emergency.given_name}
                                        onChange={(e) => handleEmergencyChange('given_name', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Interests (New) */}
                    {step === 3 && (
                        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm">
                            <div className="flex flex-col lg:flex-row gap-12">
                                {/* Left Column: Checkboxes */}
                                <div className="flex-1">
                                    <h2 className={`text-3xl font-bold text-gray-900 mb-2 leading-tight ${poppins.className}`}>
                                        LET US KNOW<br />YOUR CHILD&apos;S<br />INTERESTS...!
                                    </h2>
                                    <div className="h-1 w-20 bg-green-500 mb-8 rounded-full"></div>

                                    <InterestGroup
                                        title="What are your academic interests?"
                                        options={["Mathematics", "Sciences", "Computer/coding", "Reading", "Languages", "General knowledge", "Problem solving"]}
                                        selected={formData.interests.academic}
                                        onChange={(val) => handleInterestChange('academic', val)}
                                    />

                                    <InterestGroup
                                        title="Sports & physical activities"
                                        options={["Football", "Chess", "Athletics", "Running", "Table tennis", "Basketball"]}
                                        selected={formData.interests.sports}
                                        onChange={(val) => handleInterestChange('sports', val)}
                                    />

                                    <InterestGroup
                                        title="Creative & arts interests"
                                        options={["Drawing", "Music&Dance", "Dance", "Craft", "Photography"]}
                                        selected={formData.interests.creative}
                                        onChange={(val) => handleInterestChange('creative', val)}
                                    />

                                    <InterestGroup
                                        title="Technology & innovation"
                                        options={["Computers", "Robotics", "Coding", "Gaming", "Graphic"]}
                                        selected={formData.interests.technology}
                                        onChange={(val) => handleInterestChange('technology', val)}
                                    />

                                    <InterestGroup
                                        title="Social & personal interests"
                                        options={["Leadership", "Public speaking", "Group activities", "Community service", "Environmental activities"]}
                                        selected={formData.interests.social}
                                        onChange={(val) => handleInterestChange('social', val)}
                                    />
                                </div>

                                {/* Right Column: Image */}
                                <div className="lg:w-1/3">
                                    <div className="sticky top-24 rounded-3xl overflow-hidden shadow-2xl h-[500px] relative">
                                        <Image
                                            src="/wemps images/robotics.jpg"
                                            alt="Child exploring interests"
                                            className="object-cover"
                                            fill
                                            onError={(e) => {
                                                // Handling simple fallback if possible is harder with next/image
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                                            <p className="text-white font-medium italic">"Nurturing talent is at the heart of what we do."</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Academic Documents (Was Step 3) */}
                    {step === 4 && (
                        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm">
                            <h2 className={`text-2xl font-bold text-gray-900 mb-8 ${poppins.className}`}>
                                Academic Documents
                            </h2>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                {/* PLE Slip */}
                                <UploadBox
                                    label="Submit PLE Slip"
                                    file={files.ple_slip}
                                    onChange={(e) => handleFileChange(e, "ple_slip")}
                                    icon={<FileText className="w-10 h-10 text-amber-500" />}
                                />

                                {/* UCE Slip */}
                                <UploadBox
                                    label="Submit UCE Slip"
                                    file={files.uce_slip}
                                    onChange={(e) => handleFileChange(e, "uce_slip")}
                                    icon={<Upload className="w-10 h-10 text-amber-500" />}
                                />

                                {/* Passport Photos */}
                                <UploadBox
                                    label="Upload passport photos"
                                    file={files.photo}
                                    onChange={(e) => handleFileChange(e, "photo")}
                                    icon={<User className="w-10 h-10 text-pink-400" />}
                                />

                                {/* Recommendation Letter */}
                                <UploadBox
                                    label="RECOMMENDATION LETTER"
                                    file={files.recommendation}
                                    onChange={(e) => handleFileChange(e, "recommendation")}
                                    icon={<Mail className="w-10 h-10 text-yellow-500" />}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">PLE Aggregates (Sum of Best 4)</label>
                                    <input
                                        type="text"
                                        name="ple_aggregates"
                                        value={(formData as any).ple_aggregates || ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        placeholder="e.g. 5"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">UCE Aggregates (Sum of Best 8)</label>
                                    <input
                                        type="text"
                                        name="uce_aggregates"
                                        value={(formData as any).uce_aggregates || ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        placeholder="e.g. 10"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Review & Submit (Was Step 4) */}
                    {step === 5 && (
                        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm">
                            <h2 className={`text-2xl font-bold text-gray-900 mb-8 ${poppins.className}`}>
                                Review & Submit
                            </h2>

                            <div className="space-y-6">
                                <ReviewSection title="Student Details">
                                    <ReviewItem label="Name" value={formData.student_name} />
                                    <ReviewItem label="Date of Birth" value={formData.date_of_birth} />
                                    <ReviewItem label="Gender" value={formData.gender} />
                                    <ReviewItem label="Address" value={formData.address} />
                                    <ReviewItem label="Class" value={formData.class_of_interest} />
                                </ReviewSection>

                                <ReviewSection title="Mother's Information">
                                    <ReviewItem label="Status" value={formData.mother.status} />
                                    {formData.mother.status === 'Alive' && (
                                        <>
                                            <ReviewItem label="Name" value={`${formData.mother.surname} ${formData.mother.given_name}`} />
                                            <ReviewItem label="Phone" value={formData.mother.phone} />
                                            <ReviewItem label="Occupation" value={formData.mother.occupation} />
                                            <ReviewItem label="Address" value={`${formData.mother.address_district}, ${formData.mother.address_province}`} />
                                        </>
                                    )}
                                </ReviewSection>

                                <ReviewSection title="Father's Information">
                                    <ReviewItem label="Status" value={formData.father.status} />
                                    {formData.father.status === 'Alive' && (
                                        <>
                                            <ReviewItem label="Name" value={`${formData.father.surname} ${formData.father.given_name}`} />
                                            <ReviewItem label="Phone" value={formData.father.phone} />
                                            <ReviewItem label="Occupation" value={formData.father.occupation} />
                                            <ReviewItem label="Address" value={`${formData.father.address_district}, ${formData.father.address_province}`} />
                                        </>
                                    )}
                                </ReviewSection>

                                <ReviewSection title="Emergency Contact">
                                    <ReviewItem label="Name" value={`${formData.emergency.surname} ${formData.emergency.given_name}`} />
                                    <ReviewItem label="Relation" value={formData.emergency.relation} />
                                    <ReviewItem label="Phone" value={formData.emergency.phone} />
                                </ReviewSection>

                                <ReviewSection title="Interests">
                                    <ReviewItem label="Academic" value={formData.interests.academic.join(", ") || "None"} />
                                    <ReviewItem label="Sports" value={formData.interests.sports.join(", ") || "None"} />
                                    <ReviewItem label="Creative" value={formData.interests.creative.join(", ") || "None"} />
                                </ReviewSection>

                                <ReviewSection title="Documents">
                                    <ReviewItem label="Student Photo" value={files.photo?.name || "Not uploaded"} />
                                    <ReviewItem label="PLE Slip" value={files.ple_slip?.name || "Not uploaded"} />
                                    <ReviewItem label="Parents' IDs" value={files.mother_id ? "Mother ID Uploaded" : files.father_id ? "Father ID Uploaded" : "Not uploaded"} />
                                </ReviewSection>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                        <button
                            type="button"
                            onClick={() => (step === 1 ? router.push("/admissions") : setStep(step - 1))}
                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors flex items-center gap-2"
                        >
                            {step === 1 ? "Cancel" : <><ChevronLeft className="w-5 h-5" /> Back</>}
                        </button>

                        {step < 5 ? (
                            <button
                                type="button"
                                onClick={() => setStep(step + 1)}
                                disabled={step === 1 ? !isStep1Valid : false} // Relaxed validation for demo/dev
                                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Save & next <ChevronRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? "Submitting..." : "Submit Application"}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

// Upload Box Component
const UploadBox = ({
    label,
    file,
    onChange,
    icon,
}: {
    label: string;
    file: File | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon: React.ReactNode;
}) => (
    <label className="cursor-pointer group">
        <div
            className={`bg-purple-50 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[160px] transition-all duration-300 hover:bg-purple-100 border-2 ${file ? "border-green-400" : "border-transparent"
                }`}
        >
            <p className="text-xs text-pink-500 font-medium text-center mb-3 uppercase">{label}</p>
            <div className="mb-2">{icon}</div>
            {file && (
                <p className="text-xs text-green-600 text-center mt-2 truncate max-w-full">
                    ✓ {file.name.slice(0, 15)}...
                </p>
            )}
        </div>
        <input type="file" accept="image/*,.pdf" className="hidden" onChange={onChange} />
    </label>
);

// Review Section Component
const ReviewSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="border border-gray-100 rounded-2xl p-5">
        <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="grid grid-cols-2 gap-4">{children}</div>
    </div>
);

const ParentSection = ({
    title,
    data,
    onChange,
    files,
    onFileChange,
}: {
    title: string;
    data: ParentDetails;
    onChange: (field: keyof ParentDetails, value: string) => void;
    files: { id: File | null; passport: File | null; financial: File | null };
    onFileChange: (type: 'id' | 'passport' | 'financial', file: File) => void;
}) => (
    <div className="mb-10 p-6 bg-gray-50/50 rounded-3xl border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h3 className={`text-lg font-bold text-gray-900 ${poppins.className}`}>{title}</h3>

            {/* Status Toggle */}
            <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        checked={data.status === 'Alive'}
                        onChange={() => onChange('status', 'Alive')}
                        className="w-5 h-5 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700 font-medium">Alive</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        checked={data.status === 'Deceased'}
                        onChange={() => onChange('status', 'Deceased')}
                        className="w-5 h-5 text-gray-400 focus:ring-gray-400"
                    />
                    <span className="text-gray-500">Deceased</span>
                </label>
            </div>
        </div>

        {data.status === 'Alive' && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="SURNAME NAME"
                        value={data.surname}
                        onChange={(e) => onChange('surname', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors uppercase placeholder:text-gray-400 text-sm"
                    />
                    <input
                        type="text"
                        placeholder="GIVEN NAME"
                        value={data.given_name}
                        onChange={(e) => onChange('given_name', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors uppercase placeholder:text-gray-400 text-sm"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 ml-1">Telephone number</label>
                        <input
                            type="tel"
                            value={data.phone}
                            onChange={(e) => onChange('phone', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-100/50 border-none rounded-xl focus:ring-2 focus:ring-green-500/20 outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 ml-1">Occupation</label>
                        <input
                            type="text"
                            value={data.occupation}
                            onChange={(e) => onChange('occupation', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-100/50 border-none rounded-xl focus:ring-2 focus:ring-green-500/20 outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                        <label className="text-xs font-semibold text-gray-700 ml-1">Address</label>
                        <MapPin className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="District"
                            value={data.address_district}
                            onChange={(e) => onChange('address_district', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-100/50 border-none rounded-xl focus:ring-2 focus:ring-green-500/20 outline-none placeholder:text-gray-400 text-sm"
                        />
                        <input
                            type="text"
                            placeholder="Province/County"
                            value={data.address_province}
                            onChange={(e) => onChange('address_province', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-100/50 border-none rounded-xl focus:ring-2 focus:ring-green-500/20 outline-none placeholder:text-gray-400 text-sm"
                        />
                    </div>
                </div>

                {/* File Uploads for Parent */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                    <UploadBoxSmall
                        label="National ID photocopy"
                        file={files.id}
                        onChange={(e) => e.target.files?.[0] && onFileChange('id', e.target.files[0])}
                        icon={<User className="w-6 h-6 text-slate-600" />}
                        bgColor="bg-indigo-50"
                    />
                    <UploadBoxSmall
                        label="3 passport photos"
                        file={files.passport}
                        onChange={(e) => e.target.files?.[0] && onFileChange('passport', e.target.files[0])}
                        icon={<Camera className="w-6 h-6 text-slate-600" />}
                        bgColor="bg-indigo-50"
                    />
                    <UploadBoxSmall
                        label="Proof of financial capacity"
                        file={files.financial}
                        onChange={(e) => e.target.files?.[0] && onFileChange('financial', e.target.files[0])}
                        icon={<FileText className="w-6 h-6 text-slate-600" />}
                        bgColor="bg-indigo-50"
                    />
                </div>
            </div>
        )}
    </div>
);

const UploadBoxSmall = ({
    label,
    file,
    onChange,
    icon,
    bgColor = "bg-purple-50"
}: {
    label: string;
    file: File | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon: React.ReactNode;
    bgColor?: string;
}) => (
    <label className="cursor-pointer group block">
        <div className={`${bgColor} rounded-xl p-4 flex flex-col items-center justify-center h-32 text-center transition-all border-2 border-transparent hover:border-blue-200 group-hover:shadow-md ${file ? "border-green-400" : ""}`}>
            <div className="mb-2 p-2 bg-white rounded-lg shadow-sm">{icon}</div>
            <p className="text-[10px] text-slate-600 font-semibold uppercase leading-tight px-2">{label}</p>
            {file && <div className="mt-1 w-2 h-2 bg-green-500 rounded-full"></div>}
        </div>
        <input type="file" accept="image/*,.pdf" className="hidden" onChange={onChange} />
    </label>
);

const InterestGroup = ({
    title,
    options,
    selected,
    onChange
}: {
    title: string;
    options: string[];
    selected: string[];
    onChange: (val: string) => void;
}) => (
    <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-900 mb-3">{title}</h4>
        <div className="space-y-2">
            {options.map((opt) => (
                <label key={opt} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer group transition-colors">
                    <span className="text-gray-700 text-sm group-hover:text-gray-900">{opt}</span>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selected.includes(opt) ? "bg-green-500 border-green-500" : "border-gray-300 bg-white"}`}>
                        {selected.includes(opt) && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <input
                        type="checkbox"
                        className="hidden"
                        checked={selected.includes(opt)}
                        onChange={() => onChange(opt)}
                    />
                </label>
            ))}
        </div>
    </div>
);

// Review Item Component
const ReviewItem = ({ label, value }: { label: string; value: string }) => (
    <div>
        <span className="text-sm text-gray-500">{label}</span>
        <p className="font-medium text-gray-900">{value}</p>
    </div>
);

export default ApplicationForm;
