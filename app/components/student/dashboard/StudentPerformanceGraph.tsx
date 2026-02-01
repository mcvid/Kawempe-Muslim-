"use client";

import { ChevronDown } from "lucide-react";

export default function StudentPerformanceGraph() {
    return (
        <div className="bg-[#E0E0E0] p-6 lg:p-8 min-h-[400px] flex flex-col relative">
            {/* Header Controls */}
            <div className="flex justify-between items-start mb-10">

                {/* Average Dropdown */}
                <div className="flex items-center gap-2 cursor-pointer group">
                    <span className="text-xl md:text-2xl text-black">Average</span>
                    <ChevronDown className="text-black w-6 h-6 group-hover:translate-y-0.5 transition-transform" />
                </div>

                {/* Term Dropdown */}
                <div className="flex items-center gap-2 cursor-pointer group">
                    <span className="text-xl md:text-2xl text-black">Term</span>
                    <ChevronDown className="text-black w-6 h-6 group-hover:translate-y-0.5 transition-transform" />
                </div>
            </div>

            {/* Graph Placeholder */}
            <div className="flex-1 flex items-center justify-center">
                <span className="text-3xl text-black font-normal">Graph</span>
            </div>
        </div>
    );
}
