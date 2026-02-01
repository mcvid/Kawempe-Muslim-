"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { GraduationCap, BookOpen, Home, Award, ScrollText } from "lucide-react";
import Link from "next/link";

type NavOption = {
    id: string;
    label: string;
    href: string;
    icon: React.ElementType;
};

const navOptions: NavOption[] = [
    { id: "o-level", label: "O Level", href: "/academics/library/past-papers/o-level", icon: Award },
    { id: "idaad", label: "Idaad", href: "/academics/library/past-papers/idaad", icon: ScrollText },
    { id: "uce", label: "UCE", href: "/academics/library/past-papers/uce", icon: BookOpen },
    { id: "a-level", label: "A Level", href: "/academics/library/past-papers/a-level", icon: GraduationCap },
];

export default function LibraryNavBar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", onScroll);
        // Initial check
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div
            className={`w-full flex justify-center transition-opacity duration-500 ${scrolled ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
            <div className="flex items-center gap-4 overflow-x-auto px-4 scrollbar-hide">

                {/* Nav Options */}
                {navOptions.map((option) => {
                    const isActive = pathname.startsWith(option.href);
                    const Icon = option.icon;

                    return (
                        <Link
                            key={option.id}
                            href={option.href}
                            className={`
                flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300
                whitespace-nowrap border
                ${isActive
                                    ? "bg-slate-800 text-white border-slate-800"
                                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400"}
              `}
                        >
                            <Icon size={18} />
                            {option.label}
                        </Link>
                    );
                })}

                {/* Home Link (at the end per the image) */}
                <Link
                    href="/"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 whitespace-nowrap"
                >
                    <Home size={18} />
                    Home
                </Link>
            </div>
        </div>
    );
}
