"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Users } from "lucide-react";

// Placeholder data for the hierarchy
const hierarchyData = {
  tier1: [
    { name: "Hajat Kibirige Zulaika", role: "Headteacher", image: "/hm.png" }, // Re-using HM image if available, else placeholder
  ],
  tier2: [
    { name: "Unknown", role: "Deputy Head (Administration)", image: "" },
    { name: "Unknown", role: "Deputy Head (Academics)", image: "" },
  ],
  tier3: [
    { name: "Staff Member 1", role: "Senior Teacher", image: "" },
    { name: "Staff Member 2", role: "Department Head", image: "" },
    { name: "Staff Member 3", role: "Senior Administrator", image: "" },
    { name: "Staff Member 4", role: "Finance Manager", image: "" },
    { name: "Staff Member 5", role: "Student Affairs", image: "" },
    { name: "Staff Member 6", role: "Operations Lead", image: "" },
  ]
};

const StaffCard = ({ name, role, image, size = "normal" }: { name: string, role: string, image?: string, size?: "large" | "normal" | "small" }) => {
  const isLarge = size === "large";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center group"
    >
      {/* Circular Avatar with Thick White Border */}
      <div className={`
        relative rounded-full border-[10px] border-white shadow-xl overflow-hidden bg-slate-100
        ${isLarge ? "w-64 h-64 md:w-80 md:h-80" : "w-48 h-48 md:w-56 md:h-56"}
        mb-6 transition-transform duration-500 group-hover:scale-105
      `}>
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <Users className={isLarge ? "w-24 h-24" : "w-16 h-16"} />
          </div>
        )}
      </div>

      {/* Name and Role with Divider */}
      <div className="text-center w-full max-w-[280px]">
        <h3 className={`font-bold text-[#1E3A8A] leading-tight mb-2 ${isLarge ? "text-3xl" : "text-xl"}`}>
          {name}
        </h3>
        <div className="w-full h-px bg-slate-300 mb-2"></div>
        <p className={`text-slate-600 font-medium italic ${isLarge ? "text-lg" : "text-base"}`}>
          {role}
        </p>
      </div>
    </motion.div>
  );
};

export default function StaffHierarchyPage() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Video Hero Section */}
      <section className="relative h-[90vh] w-full overflow-hidden bg-slate-900 flex items-center justify-center pt-32">
        {/* Placeholder for Video Background */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center opacity-50"></div>

        {/* Helper text about the video */}
        <div className="absolute inset-0 flex items-center justify-center z-0 opacity-20">
          <h1 className="text-9xl font-black text-white uppercase tracking-tighter">Video</h1>
        </div>

        <div className="relative z-20 text-center px-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto border border-white/30 cursor-pointer hover:bg-white/20 transition-all group">
              <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-white group-hover:scale-110 transition-transform" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight"
          >
            Our Leadership & Staff
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto"
          >
            Meet the dedicated team guiding Kawempe Muslim Secondary School towards excellence.
          </motion.p>
        </div>
      </section>

      {/* Hierarchy Grid Section */}
      <section className="py-24 px-6 relative bg-white">
        <div className="max-w-7xl mx-auto space-y-24">

          {/* Tier 1: Headteacher */}
          <div className="flex flex-col items-center">
            <div className="inline-block px-6 py-2 rounded-full bg-blue-100 text-[#1E3A8A] font-bold text-sm mb-12 uppercase tracking-[0.2em] shadow-sm">
              The Principal
            </div>
            <StaffCard
              {...hierarchyData.tier1[0]}
              size="large"
            />
          </div>

          <div className="flex flex-col items-center">
            <div className="w-px h-24 bg-slate-300"></div>
          </div>

          {/* Tier 2: Deputy Heads */}
          <div>
            <div className="text-center mb-16">
              <h2 className="text-2xl font-black text-[#1E3A8A] uppercase tracking-widest bg-white inline-block px-8 py-2 rounded-xl shadow-sm border border-slate-100">
                Administrative Council
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 max-w-5xl mx-auto justify-items-center">
              {hierarchyData.tier2.map((member, idx) => (
                <StaffCard key={idx} {...member} size="normal" />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-px h-24 bg-slate-300"></div>
          </div>

          {/* Tier 3: Senior Staff */}
          <div>
            <div className="text-center mb-16">
              <h2 className="text-2xl font-black text-[#1E3A8A] uppercase tracking-widest bg-white inline-block px-8 py-2 rounded-xl shadow-sm border border-slate-100">
                Academic & Staff Body
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-20 max-w-6xl mx-auto justify-items-center">
              {hierarchyData.tier3.map((member, idx) => (
                <StaffCard key={idx} {...member} size="normal" />
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

