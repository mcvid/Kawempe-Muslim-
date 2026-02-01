"use client";
import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Crimson_Pro, Poppins } from "next/font/google";
import { supabase } from "@/app/lib/supabase";
import Link from "next/link";
import Image from "next/image";

const crimson = Crimson_Pro({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-crimson",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-poppins",
});

type Article = {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  image_url?: string;
  category?: string;
  published_at: string;
};

// Bento layout helper for homepage (fewer items than full page)
const getHomeCardSpan = (index: number) => {
  if (index === 0) return "md:col-span-2 md:row-span-2"; // Featured
  return "md:col-span-1 md:row-span-1";
};

const cardStyles = [
  { bg: "bg-slate-900", text: "text-white", accent: "text-slate-400", btn: "text-slate-900" },
  { bg: "bg-gradient-to-br from-[#D2B48C] to-[#C19A6B]", text: "text-white", accent: "text-white/80", btn: "text-[#D2B48C]" },
  { bg: "bg-gradient-to-br from-indigo-600 to-blue-700", text: "text-white", accent: "text-blue-100", btn: "text-blue-600" },
  { bg: "bg-gradient-to-br from-emerald-500 to-teal-600", text: "text-white", accent: "text-emerald-100", btn: "text-teal-600" },
  { bg: "bg-gradient-to-br from-rose-500 to-pink-600", text: "text-white", accent: "text-rose-100", btn: "text-rose-600" },
];

const LatestNews = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <section className={`bg-white py-20 lg:py-32 relative overflow-hidden ${crimson.variable} ${poppins.variable} font-[var(--font-poppins)]`}>

      <div className="max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <div className="flex justify-between items-end mb-16">
          <div>
            <h3 className="text-amber-500 font-bold uppercase tracking-[0.2em] text-sm mb-2 font-[var(--font-poppins)]">School Updates</h3>
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter font-[var(--font-barlow)] leading-none">Latest <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">News</span></h2>
          </div>
          <Link href="/news" className="group flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-900 transition-all">
            <span className="font-black uppercase text-xs text-slate-900">View All News</span>
            <ChevronRight size={16} className="text-slate-900 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[400px] md:w-[900px]">
          {loading ? (
            <>
              <div className="md:col-span-2 md:row-span-2 bg-slate-50 rounded-[40px] animate-pulse" />
              <div className="md:col-span-1 md:row-span-1 bg-slate-50 rounded-[40px] animate-pulse" />
              <div className="md:col-span-1 md:row-span-1 bg-slate-50 rounded-[40px] animate-pulse" />
            </>
          ) : articles.length === 0 ? (
            <div className="md:col-span-3 text-center py-20 text-slate-400 font-medium">No updates available at the moment.</div>
          ) : (
            articles.map((article, idx) => {
              const span = getHomeCardSpan(idx);
              const style = cardStyles[idx % cardStyles.length];
              return (
                <div
                  key={article.id}
                  className={`
                    ${span} relative rounded-[40px] overflow-hidden
                    p-8 md:p-10 flex flex-col group transition-all duration-500 hover:scale-[0.99]
                    h-[500px] md:h-auto
                    ${!article.image_url ? style.bg : 'bg-slate-900'}
                  `}
                >
                  {/* Background Image */}
                  {article.image_url && (
                    <div className="absolute inset-0 z-0">
                      <Image
                        src={article.image_url}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-60"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/80`} />
                    </div>
                  )}

                  <div className="relative z-20">
                    <span className={`uppercase font-black tracking-widest text-[10px] mb-4 block ${article.image_url ? 'text-white/80' : style.accent}`}>
                      {article.category || "General"}
                    </span>
                    <h4 className={`
                      font-bold tracking-tight text-white
                      ${idx === 0 ? 'text-3xl md:text-5xl leading-[1.0]' : 'text-2xl leading-tight'}
                    `}>
                      {article.title}
                    </h4>
                  </div>

                  {/* Read More Button */}
                  <div className="mt-auto relative z-20">
                    <Link
                      href={`/news/${article.slug}`}
                      className="bg-white px-5 py-2.5 rounded-xl flex items-center gap-2 w-fit shadow-lg hover:shadow-xl transition-all group/btn"
                    >
                      <span className={`font-black uppercase text-[10px] ${style.btn}`}>read more</span>
                      <ChevronRight size={14} className={`${style.btn} group-hover/btn:translate-x-1 transition-transform`} />
                    </Link>
                  </div>

                  {!article.image_url && (
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent z-0 opacity-20" />
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
};

export default LatestNews;
