"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Calendar, Clock, Home, ArrowRight, Download, Mail } from "lucide-react";
import Link from "next/link";
import "./success.css";

export default function VisitSuccessPage() {
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        setShowConfetti(true);
        const timer = setTimeout(() => setShowConfetti(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <main className="success-page">
            {/* Confetti Effect */}
            {showConfetti && (
                <div className="confetti-container">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="confetti"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 0.5}s`,
                                backgroundColor: ["#D4AF37", "#1e6091", "#064E3B", "#fbbf24"][Math.floor(Math.random() * 4)],
                            }}
                        />
                    ))}
                </div>
            )}

            <section className="success-content">
                <motion.div
                    className="success-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                >
                    {/* Animated Checkmark */}
                    <motion.div
                        className="success-icon"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                        <CheckCircle2 size={60} />
                    </motion.div>

                    <h1>Visit Scheduled!</h1>
                    <p className="subtitle">
                        Thank you for scheduling a visit to Kawempe Muslim Secondary School. 
                        We're excited to meet you!
                    </p>

                    {/* Booking Summary */}
                    <div className="booking-summary">
                        <h3>What Happens Next?</h3>
                        <ul>
                            <li>
                                <Mail size={18} />
                                <span>You'll receive a confirmation email within 24 hours</span>
                            </li>
                            <li>
                                <Calendar size={18} />
                                <span>We'll confirm your preferred date and time</span>
                            </li>
                            <li>
                                <Clock size={18} />
                                <span>Arrive 10 minutes early on the day of your visit</span>
                            </li>
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="success-actions">
                        <button className="btn-secondary">
                            <Download size={18} />
                            Add to Calendar
                        </button>
                        <Link href="/" className="btn-primary">
                            <Home size={18} />
                            Back to Home
                        </Link>
                    </div>

                    {/* Next Steps */}
                    <div className="next-steps">
                        <h4>While You Wait</h4>
                        <div className="step-cards">
                            <Link href="/academics" className="step-card">
                                <span>Explore Our Programs</span>
                                <ArrowRight size={16} />
                            </Link>
                            <Link href="/admissions" className="step-card">
                                <span>View Admission Requirements</span>
                                <ArrowRight size={16} />
                            </Link>
                            <Link href="/about" className="step-card">
                                <span>Learn About Our History</span>
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}
