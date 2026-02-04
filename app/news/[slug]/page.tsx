"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Share2, Calendar, User, Tag } from "lucide-react";
import { Poppins, Crimson_Pro, Barlow_Condensed } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/app/components/Footer";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-poppins",
});

const crimson = Crimson_Pro({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    variable: "--font-crimson",
});

const barlow = Barlow_Condensed({
    subsets: ["latin"],
    weight: ["400", "700", "800"],
    variable: "--font-barlow",
});

type Article = {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    slug: string;
    image_url?: string;
    images?: string[]; // Potential for multiple images
    category?: string;
    author_name?: string;
    author_image?: string;
    published_at: string;
};

export default function NewsDetail() {
    const { slug } = useParams();
    const router = useRouter();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (slug) fetchArticle();
    }, [slug]);

    const fetchArticle = async () => {
        try {
            const { data, error } = await supabase
                .from("news")
                .select("*")
                .eq("slug", slug)
                .single();

            if (error) throw error;

            // Mocking multiple images if only one exists for demonstration
            const processedArticle = {
                ...data,
                images: data.images || (data.image_url ? [data.image_url] : ["/back.png"])
            };

            setArticle(processedArticle);
        } catch (error) {
            console.error("Error fetching article:", error);
        } finally {
            setLoading(false);
        }
    };

    const images = article?.images || ["/back.png"];

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    // Content splitting logic for mobile
    const splitContent = useMemo(() => {
        if (!article?.content) return { top: "", bottom: "" };

        // Split by paragraphs (double newlines)
        const paragraphs = article.content.split(/\n\n+/);
        if (paragraphs.length <= 2) return { top: article.content, bottom: "" };

        const midIndex = Math.ceil(paragraphs.length / 2);
        return {
            top: paragraphs.slice(0, midIndex).join('\n\n'),
            bottom: paragraphs.slice(midIndex).join('\n\n')
        };
    }, [article?.content]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#E5E7EB] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-[#E5E7EB] flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Article Not Found</h1>
                <p className="text-slate-600 mb-8">The news story you are looking for does not exist or has been moved.</p>
                <Link href="/news" className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider">
                    Back to News
                </Link>
            </div>
        );
    }

    const MediaSection = ({ isMobile = false }: { isMobile?: boolean }) => (
        <div className={`w-full ${isMobile ? 'h-[450px] my-12 rounded-[40px] shadow-2xl overflow-hidden' : 'h-screen sticky top-0'} bg-[#E11D48] relative group/media`}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute inset-0"
                >
                    <Image
                        src={images[currentImageIndex]}
                        alt={article.title}
                        fill
                        priority
                        className="object-cover"
                    />
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 bg-black/10 transition-opacity group-hover/media:opacity-30 pointer-events-none" />

            {images.length > 1 && (
                <>
                    <button
                        onClick={prevImage}
                        className="absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all z-20 group"
                    >
                        <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <button
                        onClick={nextImage}
                        className="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all z-20 group"
                    >
                        <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    <div className="absolute bottom-12 right-12 z-20 flex items-end gap-2 text-white">
                        <span className="text-4xl font-black leading-none">{currentImageIndex + 1}</span>
                        <span className="text-xl font-bold opacity-40 leading-none mb-1">/ {images.length}</span>
                    </div>
                </>
            )}

            <div className="absolute top-12 left-12 z-20 bg-white p-6 rounded-2xl shadow-2xl">
                <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Visual</span>
                <span className="block text-2xl font-black uppercase tracking-tighter text-slate-900 font-[var(--font-barlow)]">Gallery</span>
            </div>
        </div>
    );

    return (
        <main className={`min-h-screen bg-[#E5E7EB] ${poppins.variable} ${crimson.variable} ${barlow.variable} font-[var(--font-poppins)] overflow-hidden`}>
            <div className="flex flex-col lg:flex-row min-h-screen">

                {/* Left Side: Content */}
                <div className="w-full lg:w-[45%] lg:min-h-screen p-8 md:p-12 lg:p-20 flex flex-col bg-[#E5E7EB] lg:overflow-y-auto">
                    <Link href="/news" className="group inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-12">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold uppercase tracking-widest text-xs">All Updates</span>
                    </Link>

                    <div className="max-w-xl">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-[0.9] mb-4 font-[var(--font-barlow)]">
                            {article.title}
                        </h1>

                        <p className="text-lg text-slate-600 font-medium mb-10 leading-relaxed italic">
                            {article.excerpt}
                        </p>

                        <div className="space-y-6 text-slate-500 mb-12">
                            {article.author_name && (
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">By :</span>
                                    <span className="text-slate-900 font-bold uppercase tracking-tight">{article.author_name}</span>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-8">
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-slate-400" />
                                    <span className="text-xs font-bold uppercase tracking-wider">
                                        {new Date(article.published_at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                                {article.category && (
                                    <div className="flex items-center gap-2">
                                        <Tag size={14} className="text-slate-400" />
                                        <span className="text-xs font-bold uppercase tracking-wider">{article.category}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="w-20 h-1 bg-slate-900 mb-12" />

                        {/* Mobile: Embedded Media within text */}
                        <div className="lg:hidden">
                            <div
                                className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6 font-medium"
                                dangerouslySetInnerHTML={{ __html: splitContent.top ? splitContent.top.replace(/\n/g, '<br/>') : '' }}
                            />

                            <MediaSection isMobile />

                            <div
                                className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6 font-medium"
                                dangerouslySetInnerHTML={{ __html: splitContent.bottom ? splitContent.bottom.replace(/\n/g, '<br/>') : '' }}
                            />
                        </div>

                        {/* Desktop: Full Text */}
                        <div className="hidden lg:block">
                            <div
                                className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6 font-medium"
                                dangerouslySetInnerHTML={{ __html: article.content ? article.content.replace(/\n/g, '<br/>') : '' }}
                            />
                        </div>

                        <div className="mt-20 pt-10 border-t border-slate-300 flex items-center justify-between">
                            <button
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: article.title,
                                            url: window.location.href
                                        });
                                    }
                                }}
                                className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors group"
                            >
                                <Share2 size={18} />
                                <span className="font-bold uppercase tracking-widest text-[10px]">Share Story</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side: Media / Slideshow (Desktop Only) */}
                <div className="hidden lg:block lg:w-[55%]">
                    <MediaSection />
                </div>

            </div>
            <Footer />
        </main>
    );
}
