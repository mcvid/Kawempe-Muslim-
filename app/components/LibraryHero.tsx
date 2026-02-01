import { Search, FileText, Users, User } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface LibraryHeroProps {
    title: string;
    description: string;
    searchPlaceholder?: string;
    stats?: {
        papersCount: number;
        classesCount: number;
        teacherName: string;
    };
}

export default function LibraryHero({
    title,
    description,
    searchPlaceholder = "Search Papers",
    stats = { papersCount: 1120, classesCount: 12, teacherName: "Library Support" }
}: LibraryHeroProps) {
    return (
        <div className="bg-[#1E3A8A] text-white py-12 px-6 md:px-12 relative overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-8 relative z-10">

                {/* Title */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight max-w-4xl">
                    {title}
                </h1>

                {/* Description */}
                <p className="text-sm text-blue-100 max-w-3xl leading-relaxed opacity-90">
                    {description}
                </p>

                {/* Buttons & Cards Row */}
                <div className="flex flex-col gap-6 md:gap-8">
                    {/* Buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            href="/academics/library/past-papers"
                            className="px-5 py-2.5 bg-white text-[#1E3A8A] rounded-lg font-medium text-sm hover:bg-blue-50 transition-all shadow-sm"
                        >
                            Browse all papers
                        </Link>

                        <div className="relative group">
                            {/* Search Bar */}
                            <Link href="/academics/library/search">
                                <button className="flex items-center gap-2 md:gap-3 px-4 py-2.5 rounded-lg border border-blue-400/30 bg-blue-900/20 text-blue-100 hover:bg-blue-900/40 hover:border-blue-400/50 transition-all text-sm font-medium">
                                    <Search className="w-4 h-4" />
                                    <span>{searchPlaceholder}</span>
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Stats Cards Row (Added as requested) */}
                    <motion.div
                        className="flex flex-wrap items-center gap-3 md:gap-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        {/* Past Papers Card */}
                        <div className="bg-white/10 text-white rounded-lg px-4 py-2.5 flex items-center gap-3 min-w-[120px] border border-white/5">
                            <FileText className="w-5 h-5 text-blue-200" strokeWidth={1.5} />
                            <div>
                                <p className="text-[10px] font-medium text-blue-200 uppercase leading-none mb-1">Past Papers</p>
                                <p className="text-sm font-bold leading-none">{stats.papersCount}</p>
                            </div>
                        </div>

                        {/* Classes Card */}
                        <div className="bg-white/10 text-white rounded-lg px-4 py-2.5 flex items-center gap-3 min-w-[100px] border border-white/5">
                            <Users className="w-5 h-5 text-blue-200" strokeWidth={1.5} />
                            <p className="text-sm font-bold whitespace-nowrap leading-none">{stats.classesCount} Classes</p>
                        </div>

                        {/* Support/Teacher Card */}
                        <div className="bg-white/10 text-white rounded-lg px-4 py-2.5 flex items-center gap-3 border border-white/5">
                            <div className="w-8 h-8 rounded-full bg-blue-800 overflow-hidden flex-shrink-0 flex items-center justify-center text-white">
                                <User className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] font-medium text-blue-200 uppercase leading-none mb-1">Support info</p>
                                <p className="text-xs font-bold leading-none">{stats.teacherName}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Horizontal Line */}
                <div className="w-full h-[1px] bg-slate-700/50 mt-4 mb-2"></div>
            </div>

            {/* Background decoration (optional/inferred) */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-purple-900/20 to-transparent pointer-events-none"></div>
        </div>
    );
}
