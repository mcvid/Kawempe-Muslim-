"use client";
import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/app/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Search, MessageSquare, Heart, X, Send } from "lucide-react";
import { Poppins, Barlow_Condensed } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";
import MotionLoader from "../components/MotionLoader";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
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
  slug: string;
  image_url?: string;
  category?: string;
  author_name?: string;
  author_image?: string;
  published_at: string;
  likes: number;
  comments_count: number;
  news_comments: Comment[];
};

type Comment = {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
};

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [likedArticles, setLikedArticles] = useState<Set<string>>(new Set());

  // Comment Modal State
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [userName, setUserName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = useMemo(() => {
    const cats = ["All", ...new Set(articles.map(a => a.category || "General"))];
    return cats;
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles
      .filter(a => {
        const matchCat = activeCategory === "All" || (a.category || "General") === activeCategory;
        const matchSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (a.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) || "");
        return matchCat && matchSearch;
      })
      .sort((a, b) => (b.likes || 0) - (a.likes || 0));
  }, [articles, activeCategory, searchQuery]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from("news")
        .select("*, news_comments(id, author_name, content, created_at)")
        .eq("is_published", true)
        .order("likes", { ascending: false });

      if (error) {
        console.error("Supabase Error fetching news:", error.message, error.details, error.hint);
        throw error;
      }

      // Sort comments by date desc for each article locally since basic relational sorting has limits
      const articlesWithSortedComments = (data || []).map((article: any) => ({
        ...article,
        news_comments: (article.news_comments || []).sort((a: Comment, b: Comment) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      }));

      setArticles(articlesWithSortedComments);
    } catch (error: any) {
      console.error("Catch Exception fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (articleId: string) => {
    if (likedArticles.has(articleId)) return;
    try {
      const { error } = await supabase.rpc('increment_news_likes', { article_id: articleId });
      if (error) throw error;
      setLikedArticles(prev => new Set(prev).add(articleId));
      setArticles(prev => prev.map(a =>
        a.id === articleId ? { ...a, likes: (a.likes || 0) + 1 } : a
      ));
    } catch (error) {
      console.error("Error liking article:", error);
    }
  };

  // Comments Logic
  const fetchComments = async (articleId: string) => {
    try {
      const { data, error } = await supabase
        .from("news_comments")
        .select("*")
        .eq("news_id", articleId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handlePostComment = async () => {
    if (!selectedArticle || !commentContent.trim() || !userName.trim()) return;
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("news_comments")
        .insert([{
          news_id: selectedArticle.id,
          author_name: userName,
          content: commentContent
        }])
        .select();

      if (error) throw error;

      const newComment = data[0];

      // Update local count
      await supabase.rpc('increment_news_comments', { article_id: selectedArticle.id });

      setComments(prev => [newComment, ...prev]);
      setCommentContent("");

      // Update article state to include new comment immediately
      setArticles(prev => prev.map(a =>
        a.id === selectedArticle.id ? {
          ...a,
          comments_count: (a.comments_count || 0) + 1,
          news_comments: [newComment, ...(a.news_comments || [])]
        } : a
      ));

    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openComments = (article: Article) => {
    setSelectedArticle(article);
    setComments(article.news_comments || []); // Use pre-fetched comments initially
    // Optionally fetch fresh comments in background
    fetchComments(article.id);
  };

  return (
    <main className={`min-h-screen bg-white ${poppins.variable} ${barlow.variable} font-[var(--font-poppins)] pt-24 md:pt-32`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-24 text-slate-900">

        {/* Desktop Header */}
        <div className="hidden md:block mb-16">
          <h1 className="text-6xl lg:text-8xl font-black text-slate-900 uppercase tracking-tighter font-[var(--font-barlow)] leading-[0.9] mb-4">
            Latest <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Updates</span>
          </h1>
          <div className="flex justify-between items-center mt-8">
            <div className="flex gap-4">
              {categories.slice(0, 5).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all border
                    ${activeCategory === cat ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'}
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-72">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full bg-slate-50 border border-slate-200 py-3 pl-12 pr-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Stories Bar - Mobile Only */}
        <div className="md:hidden flex gap-4 overflow-x-auto no-scrollbar py-4 mb-6">
          {categories.map((cat) => {
            const isAll = cat === "All";
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="flex flex-col items-center gap-2 shrink-0 group"
              >
                <div className={`
                  w-16 h-16 rounded-full p-0.5 border-2 transition-all
                  ${activeCategory === cat ? 'border-blue-500' : 'border-slate-200'}
                `}>
                  <div className={`w-full h-full rounded-full flex items-center justify-center text-xl font-bold border-2 border-white ${isAll ? 'bg-slate-900 text-white' : 'bg-blue-500 text-white'}`}>
                    {cat[0]}
                  </div>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${activeCategory === cat ? 'text-blue-500' : 'text-slate-400'}`}>
                  {cat}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        {loading ? (
          <MotionLoader />
        ) : filteredArticles.length === 0 ? (
          <div className="py-24 text-center">
            <h3 className="text-xl font-bold text-slate-900">No articles found</h3>
          </div>
        ) : (
          <>
            {/* Desktop View: Cinematic Cards (900x400) */}
            <div className="hidden md:flex flex-col items-center gap-12">
              {filteredArticles.map((article) => (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  key={article.id}
                  className="relative w-full md:w-[900px] h-[400px] rounded-[40px] overflow-hidden group bg-slate-900"
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
                      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/80" />
                    </div>
                  )}

                  <div className="relative z-20 h-full p-12 flex flex-col">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-white/20 bg-white/10 flex items-center justify-center overflow-hidden backdrop-blur-md">
                          {article.author_image ? (
                            <Image src={article.author_image} width={40} height={40} alt={article.author_name || ""} />
                          ) : (
                            <span className="text-xs font-bold text-white">KM</span>
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white leading-none mb-1">{article.author_name || "Kawempe Muslim"}</h4>
                          <p className="text-[10px] text-white/60 font-medium tracking-wider uppercase">@{article.category?.toLowerCase() || "news"}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                        {new Date(article.published_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="mt-auto max-w-2xl">
                      <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tighter mb-4 group-hover:text-blue-400 transition-colors uppercase font-[var(--font-barlow)]">
                        {article.title}
                      </h2>
                      <p className="text-base text-white/70 line-clamp-2 mb-8 font-medium">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center gap-6">
                        <button
                          onClick={() => handleLike(article.id)}
                          className={`flex items-center gap-2 group/btn transition-all ${likedArticles.has(article.id) ? 'text-red-500' : 'text-white/60 hover:text-red-500'}`}
                        >
                          <Heart size={20} fill={likedArticles.has(article.id) ? "currentColor" : "none"} className="transition-transform group-active/btn:scale-125" />
                          <span className="text-sm font-black">{article.likes || 0}</span>
                        </button>
                        <button
                          onClick={() => openComments(article)}
                          className="flex items-center gap-2 text-white/60 hover:text-blue-400 transition-colors"
                        >
                          <MessageSquare size={20} />
                          <span className="text-sm font-black">{article.comments_count || 0}</span>
                        </button>

                        <Link
                          href={`/news/${article.slug}`}
                          className="ml-auto bg-white px-6 py-3 rounded-2xl flex items-center gap-2 w-fit shadow-xl hover:shadow-2xl transition-all group/link"
                        >
                          <span className="font-black uppercase text-xs text-slate-900">read</span>
                          <ChevronRight size={16} className="text-slate-900 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile View: Horizontal Carousel UI */}
            <div className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-8 px-4 -mx-4">
              {filteredArticles.map((article, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  key={article.id}
                  className="bg-white flex flex-col min-w-[85vw] snap-center rounded-[32px] overflow-hidden"
                >
                  <div className="pt-2"> {/* Removed large padding to match old UI tightness */}
                    {/* Author Info */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden">
                          {article.author_image ? (
                            <Image src={article.author_image} width={40} height={40} alt={article.author_name || ""} />
                          ) : (
                            <span className="text-sm font-bold text-slate-400">KM</span>
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 leading-none mb-1">{article.author_name || "Kawempe Muslim"}</h4>
                          <p className="text-[10px] text-slate-400 font-medium">@{article.category?.toLowerCase() || "news"}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-300 uppercase letter-spacing-widest">
                        {new Date(article.published_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                      </span>
                    </div>

                    <Link href={`/news/${article.slug}`} className="group block mb-4">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors mb-4 uppercase font-[var(--font-barlow)]">
                        {article.title}
                      </h3>
                      {article.image_url && (
                        <div className="relative w-full aspect-[4/3] rounded-[24px] overflow-hidden mb-5 shadow-sm">
                          <Image
                            src={article.image_url}
                            fill
                            className="object-cover"
                            alt=""
                          />
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black uppercase text-slate-900 shadow-sm border border-white/20">
                            {article.category || "General"}
                          </div>
                        </div>
                      )}
                      <p className="text-sm text-slate-500 line-clamp-3 mb-2 leading-relaxed font-medium">
                        {article.excerpt}
                      </p>
                    </Link>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-6 mb-4">
                      <button
                        onClick={() => handleLike(article.id)}
                        className={`flex items-center gap-2 transition-all ${likedArticles.has(article.id) ? 'text-red-500' : 'text-slate-400'}`}
                      >
                        <Heart size={20} fill={likedArticles.has(article.id) ? "currentColor" : "none"} />
                        <span className="text-xs font-black">{article.likes || 0}</span>
                      </button>
                      <button
                        onClick={() => openComments(article)}
                        className="flex items-center gap-2 text-slate-400"
                      >
                        <MessageSquare size={20} />
                        <span className="text-xs font-black">{article.comments_count || 0}</span>
                      </button>
                      <Link
                        href={`/news/${article.slug}`}
                        className="ml-auto w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all"
                      >
                        <ChevronRight size={20} />
                      </Link>
                    </div>

                    {/* Inline Comments for Mobile */}
                    {article.news_comments && article.news_comments.length > 0 && (
                      <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                        {article.news_comments.slice(0, 3).map((comment) => (
                          <div key={comment.id} className="text-xs">
                            <span className="font-bold text-slate-900 mr-2">{comment.author_name}</span>
                            <span className="text-slate-600 line-clamp-2">{comment.content}</span>
                          </div>
                        ))}
                        {article.comments_count > 3 && (
                          <button
                            onClick={() => openComments(article)}
                            className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mt-2 w-full text-left"
                          >
                            View {article.comments_count - 3} more comments
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

      </div>

      {/* Modern Comment Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h3 className="font-black text-2xl text-slate-900 uppercase tracking-tight">Comments</h3>
                  <p className="text-sm text-slate-400 font-medium leading-none mt-1">On "{selectedArticle.title}"</p>
                </div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                {comments.length === 0 ? (
                  <div className="py-12 text-center text-slate-300 font-medium">
                    No comments yet. Be the first to share your thoughts!
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs shrink-0">
                        {comment.author_name[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-bold text-slate-900">{comment.author_name}</h4>
                          <span className="text-[10px] text-slate-300 font-bold uppercase">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl rounded-tl-none">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Modern Comment Input */}
              <div className="p-8 bg-slate-50 border-t border-slate-100">
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full bg-white border border-slate-200 px-6 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium text-slate-700"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  <div className="relative">
                    <textarea
                      placeholder="Write a comment..."
                      rows={3}
                      className="w-full bg-white border border-slate-200 px-6 py-4 rounded-[24px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium text-slate-700 resize-none pr-16"
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                    />
                    <button
                      onClick={handlePostComment}
                      disabled={isSubmitting || !commentContent.trim() || !userName.trim()}
                      className={`
                        absolute right-4 bottom-4 w-10 h-10 rounded-xl flex items-center justify-center transition-all
                        ${isSubmitting || !commentContent.trim() || !userName.trim() ? 'bg-slate-100 text-slate-300 pointer-events-none' : 'bg-blue-600 text-white shadow-lg hover:shadow-blue-200 hover:scale-105 active:scale-95'}
                      `}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
