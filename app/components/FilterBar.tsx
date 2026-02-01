"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Home, Award, ScrollText } from "lucide-react";
import Link from "next/link";

type FilterOption = {
    id: string;
    label: string;
    icon: any;
};

const filters: FilterOption[] = [
    { id: "o-level", label: "O Level", icon: Award },
    { id: "idaad", label: "Idaad", icon: ScrollText },
    { id: "uce", label: "UCE", icon: BookOpen },
    { id: "a-level", label: "A Level", icon: GraduationCap },
];

interface FilterBarProps {
    activeFilter: string;
    onFilterChange: (id: string) => void;
}

export default function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
    return (
        <div className="w-full flex justify-center py-8">
            <div className="flex items-center gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide">

                {/* Filter Options */}
                {filters.map((filter) => {
                    const isActive = activeFilter === filter.id;
                    const Icon = filter.icon;

                    return (
                        <button
                            key={filter.id}
                            onClick={() => onFilterChange(filter.id)}
                            className={`
                flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300
                whitespace-nowrap border
                ${isActive
                                    ? "bg-green-600 text-white border-green-600 shadow-lg shadow-green-600/20 scale-105"
                                    : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 hover:border-slate-300"}
              `}
                        >
                            <Icon size={18} />
                            {filter.label}
                        </button>
                    );
                })}

                {/* Home Link (Always at the end) */}
                <Link
                    href="/"
                    className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 hover:border-slate-300 transition-all duration-300 whitespace-nowrap"
                >
                    <Home size={18} />
                    Home
                </Link>
            </div>
        </div>
    );
}
