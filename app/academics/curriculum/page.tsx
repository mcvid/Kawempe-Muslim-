"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen, Target, Lightbulb, Users, Cpu, Rocket, Star, ArrowRight, CheckCircle2, Award, Zap } from "lucide-react";
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

export default function CurriculumPage() {
  const features = [
    { title: "Critical Thinking", desc: "Moving beyond rote memorization to analytical problem solving.", icon: Lightbulb, color: "blue" },
    { title: "Practical Skills", desc: "Hands-on learning that translates directly to real-world applications.", icon: Cpu, color: "green" },
    { title: "Innovation", desc: "Encouraging students to develop new solutions for modern challenges.", icon: Rocket, color: "red" },
    { title: "Collaboration", desc: "Building teamwork and communication through group projects.", icon: Users, color: "purple" },
    { title: "Competency Focus", desc: "Assessment based on what a student can actually do.", icon: Target, color: "orange" },
    { title: "Digital Literacy", desc: "Integrating technology as a core tool for learning and research.", icon: BookOpen, color: "indigo" },
    { title: "Life Skills", desc: "Developing empathy, time management, and ethical leadership.", icon: Star, color: "yellow" },
    { title: "Active Learning", desc: "Engaging students as the primary drivers of their own education.", icon: Zap, color: "emerald" },
  ];



  return (
    <main className={`min-h-screen bg-white ${poppins.variable} ${barlow.variable} font-[var(--font-poppins)] pt-24`}>
      {/* Introduction Header */}
      <section className="relative pt-12 pb-24 lg:pt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-7 space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full">
                < Award className="text-blue-600" size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">Competency-Based Learning</span>
              </div>

              <h1 className={`${barlow.className} text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tight leading-[0.9] lg:leading-[0.85]`}>
                A Future-Focused <br />
                <span className="text-red-600">Educational </span> Framework
              </h1>

              <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
                Kawempe Muslim Secondary School implements Uganda&apos;s New Competency-Based Curriculum, designed to move learners from theory-heavy instruction to practical, skills-driven education.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:col-span-5 relative aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl skew-y-1 lg:mt-12"
            >
              <Image
                src="/images/curriculum/hero.png"
                alt="Practical learning in action"
                fill
                className="object-cover -skew-y-1 scale-110"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Program Levels Highlights */}
      <section className="bg-slate-50 py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <h2 className={`${barlow.className} text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-none`}>
              Academic <span className="text-red-600">Programe</span>
            </h2>
            <p className="text-slate-500 text-lg uppercase font-bold tracking-[0.2em] mt-2 pb-2">O & A Level Pathways</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* O-Level */}
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white p-4 rounded-[48px] shadow-sm border border-slate-100 flex flex-col group overflow-hidden"
            >
              <div className="relative aspect-[16/9] w-full rounded-[40px] overflow-hidden mb-8">
                <Image src="/images/curriculum/olevel.png" alt="O Level Curriculum" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-8">
                  <span className="px-4 py-1.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Universal Education</span>
                </div>
              </div>
              <div className="px-4 pb-8">
                <h3 className={`${barlow.className} text-4xl font-black text-slate-900 uppercase tracking-tight mb-4`}>Ordinary Level</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-8">Focusing on core competencies, practical vocational skills, and strong foundations in sciences and humanities under the new 2020 curriculum.</p>
                <button className="flex items-center gap-4 text-slate-900 group-hover:text-red-600 transition-colors font-black uppercase tracking-[0.2em] text-xs">
                  Explore O-Level <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* A-Level */}
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white p-4 rounded-[48px] shadow-sm border border-slate-100 flex flex-col group overflow-hidden"
            >
              <div className="relative aspect-[16/9] w-full rounded-[40px] overflow-hidden mb-8">
                <Image src="/images/curriculum/alevel.png" alt="A Level Curriculum" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-8">
                  <span className="px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Advanced Level</span>
                </div>
              </div>
              <div className="px-4 pb-8">
                <h3 className={`${barlow.className} text-4xl font-black text-slate-900 uppercase tracking-tight mb-4`}>Advanced Level</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-8">Specialized subject combinations designed for university entry, leadership development, and higher-order research and analytical skills.</p>
                <button className="flex items-center gap-4 text-slate-900 group-hover:text-red-600 transition-colors font-black uppercase tracking-[0.2em] text-xs">
                  Explore A-Level <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mb-16">
            <h2 className={`${barlow.className} text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-6`}>
              What we are <span className="text-red-600">Implementing</span>
            </h2>
            <p className="text-slate-500 text-lg uppercase font-bold tracking-[0.2em] pb-2">Competency-Based Pillars</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 group hover:bg-slate-900 transition-all duration-500 flex flex-col h-full"
              >
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                  <feature.icon className="text-slate-900" size={24} />
                </div>
                <h4 className={`${barlow.className} text-2xl font-black text-slate-900 uppercase tracking-tight mb-3 group-hover:text-white transition-colors`}>
                  {feature.title}
                </h4>
                <p className="text-slate-500 group-hover:text-slate-400 transition-colors text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Excellence Call to Action */}
      <section className="bg-slate-900 py-24 relative overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className={`${barlow.className} text-5xl md:text-7xl font-black text-white uppercase tracking-tight mb-8`}>
            Achieve Academic Excellence
          </h2>
          <p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto">
            Join a community that values skills as much as certificates. Our curriculum is designed to prepare you for the challenges of tomorrow.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button className="px-12 py-5 bg-red-600 text-white rounded-full font-black uppercase tracking-[0.2em] text-sm shadow-2xl hover:scale-105 transition-all">
              Apply for Admission
            </button>
            <button className="px-12 py-5 bg-white/10 text-white border border-white/20 rounded-full font-black uppercase tracking-[0.2em] text-sm hover:bg-white/20 transition-all">
              View Departments
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
