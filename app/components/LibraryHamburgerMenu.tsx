"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Menu, X, Home, Award, ScrollText, BookOpen, GraduationCap, Library, FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type NavOption = {
    id: string;
    label: string;
    href: string;
    icon: React.ElementType;
};

const navOptions: NavOption[] = [
    { id: "library-home", label: "Library Home", href: "/academics/library", icon: Home },
    { id: "resources", label: "All Resources", href: "/academics/library/resources", icon: Library },
    { id: "past-papers", label: "Past Papers", href: "/academics/library/past-papers", icon: FileText },
    { id: "o-level", label: "O Level", href: "/academics/library/past-papers/o-level", icon: Award },
    { id: "idaad", label: "Idaad", href: "/academics/library/past-papers/idaad", icon: ScrollText },
    { id: "uce", label: "UCE", href: "/academics/library/past-papers/uce", icon: BookOpen },
    { id: "a-level", label: "A Level", href: "/academics/library/past-papers/a-level", icon: GraduationCap },
    { id: "main-home", label: "Back to School Site", href: "/", icon: Home },
];

export default function LibraryHamburgerMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
        const onScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", onScroll);
        // Initial check
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!mounted) return null;

    return createPortal(
        <>
            {/* Floating Hamburger Button - White, fixed */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
          fixed top-6 right-6 z-[9999]
          w-12 h-12 rounded-full
          bg-white text-[#1E3A8A]
          flex items-center justify-center
          shadow-lg transition-all duration-300
          hover:bg-blue-50 hover:shadow-xl
          ${(scrolled || isOpen) ? "scale-100 opacity-100" : "lg:scale-0 lg:opacity-0 max-lg:scale-100 max-lg:opacity-100"}
        `}
                aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[9990]"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Slide-out Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed top-0 right-0 h-full w-72 bg-white z-[9995] shadow-2xl flex flex-col font-sans"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <span className="text-sm font-bold text-[#1E3A8A] tracking-tight">Library Navigation</span>
                        </div>

                        {/* Navigation Links */}
                        <nav className="p-4 flex-grow overflow-y-auto">
                            <ul className="space-y-1">
                                {navOptions.map((option) => {
                                    const Icon = option.icon;
                                    let isActive = false;

                                    if (option.id === "main-home") {
                                        isActive = pathname === "/";
                                    } else if (option.id === "library-home") {
                                        isActive = pathname === "/academics/library";
                                    } else if (option.id === "past-papers") {
                                        // Specific handling for 'past-papers' to avoid active overlap with nested levels like 'o-level'
                                        // Active if strictly equal to /past-papers OR starts with it but isn't one of the other specific options
                                        const isSubLevel = pathname?.includes("/past-papers/") && (
                                            pathname.includes("/o-level") ||
                                            pathname.includes("/a-level") ||
                                            pathname.includes("/uce") ||
                                            pathname.includes("/idaad")
                                        );
                                        isActive = pathname?.startsWith(option.href) && !isSubLevel ? true : false;
                                    } else {
                                        isActive = pathname?.startsWith(option.href) ?? false;
                                    }

                                    return (
                                        <li key={option.id}>
                                            <Link
                                                href={option.href}
                                                onClick={() => setIsOpen(false)}
                                                className={`
                          flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                          ${isActive
                                                        ? "bg-blue-50 text-[#1E3A8A]"
                                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
                        `}
                                            >
                                                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                                                {option.label}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>


                        {/* Footer */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 bg-slate-50">
                            <p className="text-xs text-slate-500 text-center">
                                Kawempe Muslim Secondary School
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>,
        document.body
    );
}
