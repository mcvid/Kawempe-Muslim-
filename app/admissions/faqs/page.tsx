"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Minus,
  HelpCircle,
  BookOpen,
  Users,
  Award,
  Coffee,
  Search,
  ArrowRight,
  School,
  Backpack,
  Trophy
} from "lucide-react";
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

// Fallback for missing icon
const Library = BookOpen;

const FAQ_DATA = [
  {
    category: "General",
    questions: [
      {
        q: "Where is Kawempe Muslim Secondary School located?",
        a: "We are located along Kawempe Hill Road, approximately 6 kilometers from Kampala city center. Our campus is situated in a serene environment conducive for learning.",
        icon: School
      },
      {
        q: "Is KMSS a boarding or day school?",
        a: "We offer both boarding and day options for our students. Our boarding facilities are modern, secure, and provide a home-away-from-home experience.",
        icon: Backpack
      }
    ]
  },
  {
    category: "Admissions",
    questions: [
      {
        q: "How do I apply for a place at KMSS?",
        a: "Applications can be made in person at our registrar's office or by downloading the application form from our Admissions page. You will need to attach previous academic results (PLE or UCE).",
        icon: BookOpen
      },
      {
        q: "What are the requirements for S1 admission?",
        a: "Candidates must have successfully completed PLE with a first-grade or strong second-grade aggregate. An admission interview and original result slips are required.",
        icon: Users
      },
      {
        q: "Does the school offer scholarships or bursaries?",
        a: "Yes, we offer merit-based scholarships for high achievers in PLE/UCE and talent-based bursaries for exceptional students in sports and creative arts.",
        icon: Award
      }
    ]
  },
  {
    category: "Academics",
    questions: [
      {
        q: "Which curriculum does the school follow?",
        a: "We follow the Uganda National Curriculum. For O-Level, we have fully transitioned to the New Competency-Based Curriculum (CBC) which focuses on skills and practical learning.",
        icon: HelpCircle
      },
      {
        q: "What subject combinations are available at A-Level?",
        a: "We offer a wide range of Arts and Science combinations including PEM, BCM, PCB/M, HEG, DEG, and more, all aligned with UNEB standards.",
        icon: Library
      }
    ]
  },
  {
    category: "Student Life",
    questions: [
      {
        q: "What extra-curricular activities are available?",
        a: "We have vibrant clubs (Debate, ICT, Wildlife), and highly competitive sports teams in football, basketball, and athletics. Our students consistently excel in national competitions.",
        icon: Trophy
      },
      {
        q: "How is the religious life at the school?",
        a: "As an Islamic-founded school, we emphasize moral and religious values. We provide facilities for prayers and offer religious education, while remaining inclusive to all.",
        icon: Coffee
      }
    ]
  }
];


export default function FAQsPage() {
  const [activeCategory, setActiveCategory] = useState("General");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = FAQ_DATA.find(cat => cat.category === activeCategory)?.questions || [];

  return (
    <main className={`min-h-screen bg-slate-50/50 ${poppins.variable} ${barlow.variable} font-[var(--font-poppins)] pt-24`}>
      {/* Header Section */}
      <section className="pt-16 pb-12 text-center px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 border border-yellow-200 rounded-full"
          >
            <HelpCircle className="text-yellow-700" size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-800">Help Center</span>
          </motion.div>

          <h1 className={`${barlow.className} text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tight leading-none`}>
            Frequently Asked <span className="text-red-600">Questions</span>
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            These are the most commonly asked questions about KMSS. Can&apos;t find what you are looking for?
            <a href="/contact" className="text-red-600 font-bold hover:underline ml-2 inline-flex items-center gap-1 group">
              Contact Us <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 bg-white p-2 rounded-[32px] shadow-sm border border-slate-100 w-fit mx-auto">
            {FAQ_DATA.map((cat) => (
              <button
                key={cat.category}
                onClick={() => {
                  setActiveCategory(cat.category);
                  setOpenIndex(null);
                }}
                className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeCategory === cat.category
                  ? "bg-yellow-400 text-slate-900 shadow-lg shadow-yellow-100 scale-105"
                  : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                  }`}
              >
                {cat.category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Accordion Section */}
      <section className="pb-32 px-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              {filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-[24px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full text-left p-6 md:p-8 flex items-start gap-6"
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${openIndex === index ? "bg-yellow-400 text-slate-900" : "bg-slate-50 text-slate-400 group-hover:bg-yellow-50"
                      }`}>
                      <faq.icon size={22} />
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className={`${barlow.className} text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight leading-tight group-hover:text-red-600 transition-colors`}>
                        {faq.q}
                      </h3>
                      <div className={`mt-4 text-slate-600 leading-relaxed overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                        }`}>
                        <p className="pb-4 border-l-2 border-yellow-400 pl-6 italic">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                    <div className={`mt-2 shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}>
                      {openIndex === index ? <Minus size={20} className="text-red-600" /> : <Plus size={20} className="text-slate-300" />}
                    </div>
                  </button>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
              <HelpCircle size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-medium">No questions found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Stay Updated CTA */}
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h2 className={`${barlow.className} text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-8`}>
            Still have <span className="text-yellow-400">Questions?</span>
          </h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Our team is always ready to help. Feel free to reach out via phone, email, or visit our campus for a personalized talk.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-10 py-4 bg-yellow-400 text-slate-900 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-all">
              Contact Admissions
            </button>
            <button className="px-10 py-4 bg-white/10 text-white border border-white/20 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white/20 transition-all">
              Live Chat Support
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
