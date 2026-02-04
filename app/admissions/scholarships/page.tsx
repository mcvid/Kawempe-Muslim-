"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Trophy, BookOpen, CheckCircle2, ArrowRight, UserCheck, Star } from "lucide-react";
import { Poppins, Barlow_Condensed } from "next/font/google";
import Footer from "@/app/components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-barlow",
});

export default function ScholarshipsPage() {
  const beneficiaries = [
    {
      id: 1,
      name: "Musa Okello",
      title: "O-Level Bursary Recipient",
      description: "Musa achieved distinction in his PLE exams and has maintained top-tier academic performance throughout S.1 and S.2 through our Merit Scholarship.",
      image: "/images/scholarships/beneficiary1.png",
      year: "Class of 2026",
    },
    {
      id: 2,
      name: "Sarah Namukasa",
      title: "Sports & Talent Scholar",
      description: "A star athlete on our football team, Sarah's dedication to both her sport and her studies earned her a full scholarship for her S-Level journey.",
      image: "/images/scholarships/beneficiary2.png",
      year: "Class of 2025",
    },
  ];

  return (
    <main className={`min-h-screen bg-slate-50/50 ${poppins.variable} ${barlow.variable} font-[var(--font-poppins)] pt-24`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-6 space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-700">Admissions 2026 Open</span>
            </div>

            <h1 className={`${barlow.className} text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tight leading-[0.9] lg:leading-[0.85]`}>
              The smartest way to <span className="text-red-600">dodge </span><br />
              <span className="bg-slate-900 text-white px-2 py-1 transform -rotate-1 inline-block">school fees </span> hustle
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
              We believe financial constraints shouldn't limit bright minds. Access full bursaries, sports scholarships, and merit-based grants designed for the next generation of leaders.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-8 py-4 bg-red-600 text-white rounded-full font-black uppercase tracking-widest text-xs shadow-xl shadow-red-100 hover:scale-105 transition-all">
                Apply Now
              </button>
              <div className="flex items-center gap-4 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer group">
                <span className="text-[10px] font-black uppercase tracking-widest">Learn More</span>
                <ArrowRight className="group-hover:translate-x-2 transition-transform" size={16} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-6 relative aspect-[4/3] lg:aspect-square rounded-[40px] overflow-hidden shadow-2xl skew-y-1"
          >
            <Image
              src="/images/scholarships/hero.png"
              alt="Bright student searching for scholarships"
              fill
              className="object-cover -skew-y-1 scale-110"
            />
          </motion.div>
        </div>
      </section>

      {/* Category Boxes */}
      <section className="bg-white py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "O-Level Bursaries", icon: BookOpen, desc: "For bright P.7 leavers entering S.1 with exceptional results.", color: "red" },
              { title: "A-Level Merit", icon: GraduationCap, desc: "Scholarships for top performers in UCE entering S.5.", color: "green" },
              { title: "Sports & Talent", icon: Trophy, desc: "Rewarding exceptional skills in football, basketball, and more.", color: "blue" }
            ].map((cat, i) => (
              <motion.div
                whileHover={{ y: -10 }}
                key={cat.title}
                className="bg-slate-50 p-10 rounded-[32px] group hover:bg-slate-900 transition-all duration-500 border border-slate-100 flex flex-col h-full"
              >
                <div className={`w-14 h-14 rounded-2xl bg-${cat.color === 'red' ? 'red-100' : cat.color === 'green' ? 'green-100' : 'blue-100'} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <cat.icon className={cat.color === 'red' ? 'text-red-600' : cat.color === 'green' ? 'text-green-600' : 'text-blue-600'} size={28} />
                </div>
                <h3 className={`${barlow.className} text-3xl font-black text-slate-900 uppercase tracking-tight group-hover:text-white transition-colors mb-4`}>
                  {cat.title}
                </h3>
                <p className="text-slate-500 group-hover:text-slate-400 transition-colors text-sm leading-relaxed flex-1">
                  {cat.desc}
                </p>
                <div className="mt-8 pt-8 border-t border-slate-200/50 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-600 group-hover:text-white transition-colors">Apply</span>
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg transform group-hover:rotate-45 transition-transform">
                    <ArrowRight size={14} className="text-slate-900" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficiaries/Success Stories */}
      <section className="py-24 bg-slate-50/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 text-center md:text-left">
            <div className="max-w-xl">
              <h2 className={`${barlow.className} text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-6`}>
                Meet Our <span className="text-red-600">Scholars</span>
              </h2>
              <p className="text-slate-500 text-lg uppercase font-bold tracking-[0.2em] pb-2">Beneficiaries</p>
            </div>
            <div className="hidden md:flex gap-4">
              <div className="px-6 py-4 bg-white rounded-2xl border border-slate-100 flex items-center gap-4">
                <UserCheck className="text-green-600" size={24} />
                <div className="leading-none">
                  <span className="block text-xl font-bold text-slate-900">120+</span>
                  <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Active Scholars</span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:grid grid-cols-1 gap-32">
            {beneficiaries.map((b, i) => (
              <div key={b.id} className={`flex flex-col lg:flex-row items-center gap-16 ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="flex-1 relative aspect-square w-full max-w-[500px] rounded-[48px] overflow-hidden shadow-2xl">
                  <Image src={b.image} alt={b.name} fill className="object-cover" />
                </div>
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-2">
                    <Star className="text-yellow-400 fill-yellow-400" size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600">Student Spotlight</span>
                  </div>
                  <h3 className={`${barlow.className} text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-tight leading-none`}>
                    {b.name} <span className="text-slate-300 block text-2xl mt-1">{b.year}</span>
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">{b.title}</p>
                  <p className="text-xl text-slate-600 leading-relaxed italic font-light">
                    "{b.description}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Carousel (Simple Horizontal Scroll) */}
          <div className="md:hidden">
            <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-6 pb-8">
              {beneficiaries.map((b) => (
                <div key={b.id} className="min-w-[85vw] snap-center">
                  <div className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-slate-50 flex flex-col h-full">
                    <div className="relative h-64 w-full">
                      <Image src={b.image} alt={b.name} fill className="object-cover" />
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="text-yellow-400 fill-yellow-400" size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600">{b.year}</span>
                      </div>
                      <h3 className={`${barlow.className} text-3xl font-black text-slate-900 uppercase tracking-tight leading-none mb-2`}>
                        {b.name}
                      </h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.1em] mb-4">{b.title}</p>
                      <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">"{b.description}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll Indicator */}
            <div className="flex items-center justify-center gap-2">
              {beneficiaries.map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              ))}
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 opacity-60 flex items-center justify-center gap-3 mt-4">
              <span className="w-6 h-0.5 bg-slate-100 rounded-full" />
              Swipe to see more
              <span className="w-6 h-0.5 bg-slate-100 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="mb-16">
            <h2 className={`${barlow.className} text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-none`}>
              How it works
            </h2>
            <div className="w-20 h-1 bg-red-600 mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { step: "01", title: "Apply", desc: "Submit your application form with PLE or UCE results." },
              { step: "02", title: "Review", desc: "Our committee evaluates academic and extra-curricular excellence." },
              { step: "03", title: "Interview", desc: "Shortlisted candidates are invited for a professional panel interview." },
              { step: "04", title: "Award", desc: "Successful candidates receive full or partial fee coverage." }
            ].map((s, i) => (
              <div key={s.title} className="space-y-4">
                <span className={`${barlow.className} text-6xl font-black text-white/10 group-hover:text-white/20 transition-colors`}>{s.step}</span>
                <h4 className="text-lg font-bold text-white uppercase tracking-widest">{s.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-white py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-10">
            <CheckCircle2 className="text-green-600" size={32} />
          </div>
          <h2 className={`${barlow.className} text-5xl font-black text-slate-900 uppercase tracking-tight mb-8`}>
            Ready to Join KMSS?
          </h2>
          <p className="text-lg text-slate-600 mb-12 leading-relaxed">
            Take the first step towards a bright academic future. Apply for our 2026 scholarship program today.
          </p>
          <button className="px-12 py-5 bg-slate-900 text-white rounded-full font-black uppercase tracking-[0.2em] text-sm shadow-2xl hover:bg-red-600 transition-all transform hover:-translate-y-1">
            Download Application Form
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
