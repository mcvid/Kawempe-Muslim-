"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, Mail, Phone, MapPin, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./visit.css";

const timeSlots = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
];

const visitTypes = [
    { id: "campus_tour", label: "Campus Tour", desc: "Walk through our facilities" },
    { id: "meet_staff", label: "Meet the Staff", desc: "Talk to teachers & admins" },
    { id: "student_shadow", label: "Student Shadow Day", desc: "Experience a real school day" },
];

export default function ScheduleVisitPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        preferredDate: "",
        timeSlot: "",
        visitType: "campus_tour",
        notes: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
        if (!formData.preferredDate) newErrors.preferredDate = "Please select a date";
        if (!formData.timeSlot) newErrors.timeSlot = "Please select a time slot";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/visits", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/admissions/visit/success");
            } else {
                const data = await res.json();
                alert(data.error || "Something went wrong. Please try again.");
            }
        } catch {
            alert("Network error. Please check your connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Get minimum date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split("T")[0];

    return (
        <main className="visit-page">
            {/* Hero Section */}
            <section className="visit-hero">
                <div className="visit-hero-content">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >

                        <h1>Schedule Your Visit</h1>
                        <p>Experience the Kawempe Muslim difference firsthand. Tour our campus, meet our dedicated staff, and see why we're Uganda's leading Islamic secondary institution.</p>
                    </motion.div>
                </div>
                <div className="hero-ornament">
                    <svg viewBox="0 0 100 100" fill="none">
                        <path d="M70 15C50 15 30 35 30 60C30 85 50 105 70 105C55 105 40 90 40 60C40 30 55 15 70 15Z" fill="currentColor" />
                    </svg>
                </div>
            </section>

            {/* Main Form Section */}
            <section className="visit-form-section">
                <div className="visit-container">
                    <div className="visit-grid">
                        {/* Form */}
                        <motion.div
                            className="visit-form-card"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <form onSubmit={handleSubmit}>
                                <h2>Book Your Visit</h2>
                                <p className="form-subtitle">Fill out the form below and we'll confirm your visit within 24 hours.</p>

                                {/* Visit Type Selector */}
                                <div className="visit-type-selector">
                                    {visitTypes.map(type => (
                                        <label
                                            key={type.id}
                                            className={`visit-type-option ${formData.visitType === type.id ? "selected" : ""}`}
                                        >
                                            <input
                                                type="radio"
                                                name="visitType"
                                                value={type.id}
                                                checked={formData.visitType === type.id}
                                                onChange={handleChange}
                                            />
                                            <div className="option-content">
                                                <span className="option-label">{type.label}</span>
                                                <span className="option-desc">{type.desc}</span>
                                            </div>
                                            {formData.visitType === type.id && <CheckCircle2 size={20} className="check-icon" />}
                                        </label>
                                    ))}
                                </div>

                                {/* Name */}
                                <div className="form-group">
                                    <label htmlFor="fullName"><User size={18} /> Full Name</label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        placeholder="Enter your full name"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className={errors.fullName ? "error" : ""}
                                    />
                                    {errors.fullName && <span className="error-msg">{errors.fullName}</span>}
                                </div>

                                {/* Email */}
                                <div className="form-group">
                                    <label htmlFor="email"><Mail size={18} /> Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={errors.email ? "error" : ""}
                                    />
                                    {errors.email && <span className="error-msg">{errors.email}</span>}
                                </div>

                                {/* Phone */}
                                <div className="form-group">
                                    <label htmlFor="phone"><Phone size={18} /> Phone Number (Optional)</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        placeholder="+256 700 000 000"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Date & Time Row */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="preferredDate"><Calendar size={18} /> Preferred Date</label>
                                        <input
                                            type="date"
                                            id="preferredDate"
                                            name="preferredDate"
                                            min={minDate}
                                            value={formData.preferredDate}
                                            onChange={handleChange}
                                            className={errors.preferredDate ? "error" : ""}
                                        />
                                        {errors.preferredDate && <span className="error-msg">{errors.preferredDate}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="timeSlot"><Clock size={18} /> Time Slot</label>
                                        <select
                                            id="timeSlot"
                                            name="timeSlot"
                                            value={formData.timeSlot}
                                            onChange={handleChange}
                                            className={errors.timeSlot ? "error" : ""}
                                        >
                                            <option value="">Select a time</option>
                                            {timeSlots.map(slot => (
                                                <option key={slot} value={slot}>{slot}</option>
                                            ))}
                                        </select>
                                        {errors.timeSlot && <span className="error-msg">{errors.timeSlot}</span>}
                                    </div>
                                </div>

                                {/* Notes */}
                                <div className="form-group">
                                    <label htmlFor="notes">Additional Notes (Optional)</label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        placeholder="Any special requests or questions?"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows={3}
                                    />
                                </div>

                                {/* Submit */}
                                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                    {isSubmitting ? "Scheduling..." : "Schedule My Visit"}
                                </button>
                            </form>
                        </motion.div>

                        {/* Sidebar */}
                        <motion.aside
                            className="visit-sidebar"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <div className="sidebar-card trust-card">
                                <h3>Why Visit Us?</h3>
                                <ul>
                                    <li><CheckCircle2 size={18} /> See our state-of-the-art facilities</li>
                                    <li><CheckCircle2 size={18} /> Meet dedicated teachers & staff</li>
                                    <li><CheckCircle2 size={18} /> Experience our vibrant community</li>
                                    <li><CheckCircle2 size={18} /> Get all your questions answered</li>
                                </ul>
                            </div>

                            <div className="sidebar-card contact-card">
                                <h3>Need Help?</h3>
                                <p>Our admissions team is here to assist you.</p>
                                <div className="contact-info">
                                    <a href="tel:+256700000000"><Phone size={16} /> +256 700 000 000</a>
                                    <a href="mailto:admissions@kmss.ac.ug"><Mail size={16} /> admissions@kmss.ac.ug</a>
                                </div>
                            </div>

                            <div className="sidebar-card location-card">
                                <h3><MapPin size={18} /> Our Location</h3>
                                <p>Kawempe, Kampala, Uganda</p>
                                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="map-link">
                                    View on Map →
                                </a>
                            </div>

                            <div className="sidebar-card reassurance-card">
                                <p>✓ No payment required</p>
                                <p>✓ Cancel or reschedule anytime</p>
                                <p>✓ Confirmation within 24 hours</p>
                            </div>
                        </motion.aside>
                    </div>
                </div>
            </section>
        </main>
    );
}
