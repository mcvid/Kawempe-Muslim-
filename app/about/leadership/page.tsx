"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Users } from "lucide-react";
import { supabase } from "@/app/lib/supabase";

type StaffMember = {
  id: string;
  name: string;
  role: string;
  image_url: string;
  sort_order: number;
};

const BoardCard = ({ name, role, image, size = "normal" }: { name: string, role: string, image?: string, size?: "large" | "normal" | "small" }) => {
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

export default function LeadershipPage() {
  const [loading, setLoading] = useState(true);
  const [boardMembers, setBoardMembers] = useState<StaffMember[]>([]);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const { data, error } = await supabase
        .from("administration")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }); // Fallback sorting

      if (error) throw error;
      setBoardMembers(data || []);
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  // Logic to split members (Assuming first is Chairman, next 2 are Execs, rest are Members)
  // This is a heuristic if the DB doesn't have explicit categories yet.
  // Ideally, you'd add a 'category' or 'tier' column to the 'administration' table.
  const tier1 = boardMembers.slice(0, 1);
  const tier2 = boardMembers.slice(1, 3);
  const tier3 = boardMembers.slice(3);

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
            School Leadership & Governance
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto"
          >
            The Board of Governors provides strategic direction and oversight to ensure the highest standards of education.
          </motion.p>
        </div>
      </section>

      {/* Hierarchy Grid Section */}
      <section className="py-24 px-6 relative bg-white">
        <div className="max-w-7xl mx-auto space-y-24">

          {loading ? (
            <div className="flex flex-col items-center gap-12">
              <div className="w-48 h-48 rounded-full bg-slate-200 animate-pulse" />
              <div className="flex gap-12">
                <div className="w-40 h-40 rounded-full bg-slate-200 animate-pulse" />
                <div className="w-40 h-40 rounded-full bg-slate-200 animate-pulse" />
              </div>
              <div className="grid grid-cols-3 gap-8">
                {[1, 2, 3].map(i => <div key={i} className="w-32 h-32 rounded-full bg-slate-200 animate-pulse" />)}
              </div>
            </div>
          ) : boardMembers.length === 0 ? (
            <div className="text-center text-slate-500 italic py-20">No leadership members listed.</div>
          ) : (
            <>
              {/* Tier 1: Chairman */}
              {tier1.length > 0 && (
                <div className="flex flex-col items-center">
                  <div className="inline-block px-6 py-2 rounded-full bg-blue-100 text-[#1E3A8A] font-bold text-sm mb-12 uppercase tracking-[0.2em] shadow-sm">
                    Chairman of the Board
                  </div>
                  <BoardCard
                    name={tier1[0].name}
                    role={tier1[0].role}
                    image={tier1[0].image_url}
                    size="large"
                  />
                </div>
              )}

              {tier2.length > 0 && (
                <>
                  <div className="flex flex-col items-center">
                    <div className="w-px h-24 bg-slate-300"></div>
                  </div>

                  {/* Tier 2: Executives */}
                  <div>
                    <div className="text-center mb-16">
                      <h2 className="text-2xl font-black text-[#1E3A8A] uppercase tracking-widest bg-white inline-block px-8 py-2 rounded-xl shadow-sm border border-slate-100">
                        Executive Committee
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 max-w-5xl mx-auto justify-items-center">
                      {tier2.map((member) => (
                        <BoardCard key={member.id} name={member.name} role={member.role} image={member.image_url} size="normal" />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {tier3.length > 0 && (
                <>
                  <div className="flex flex-col items-center">
                    <div className="w-px h-24 bg-slate-300"></div>
                  </div>

                  {/* Tier 3: Board Members */}
                  <div>
                    <div className="text-center mb-16">
                      <h2 className="text-2xl font-black text-[#1E3A8A] uppercase tracking-widest bg-white inline-block px-8 py-2 rounded-xl shadow-sm border border-slate-100">
                        Board Members
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-20 max-w-6xl mx-auto justify-items-center">
                      {tier3.map((member) => (
                        <BoardCard key={member.id} name={member.name} role={member.role} image={member.image_url} size="normal" />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          )}

        </div>
      </section>

    </div>
  );
}
