"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    BookOpen,
    Clock,
    Award,
    FileText,
    FolderOpen,
    Calendar,
    FileCode,
    CreditCard,
    DollarSign,
    Users,
    MapPin,
    Home,
    LogOut,
    X,
} from "lucide-react";

interface StudentSidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export default function StudentSidebar({ sidebarOpen, setSidebarOpen }: StudentSidebarProps) {
    const pathname = usePathname();

    const isActive = (href: string) => pathname === href;

    const sections = [
        {
            title: "Dashboard",
            items: [
                { name: "My class", href: "/student/class", icon: BookOpen },
                { name: "Class Schedule", href: "/student/schedule", icon: Clock },
                { name: "Grades & transcripts", href: "/student/grades", icon: Award },
                { name: "Assignments", href: "/student/assignments", icon: FileText },
                { name: "Projects", href: "/student/projects", icon: FolderOpen },
                { name: "Academics Calendar", href: "/student/calendar", icon: Calendar },
            ],
            isHeader: false,
        },
        {
            title: "Documents",
            items: [
                { name: "Report", href: "/student/reports", icon: FileCode },
                { name: "Certificates", href: "/student/certificates", icon: Award },
            ],
            isHeader: true,
        },
        {
            title: "Finance",
            items: [
                { name: "Tuition and fees", href: "/student/finance", icon: DollarSign },
                { name: "Payment history", href: "/student/payments", icon: CreditCard },
                { name: "Financial aid", href: "/student/aid", icon: DollarSign },
            ],
            isHeader: true,
        },
        {
            title: "Students life",
            items: [
                { name: "Clubs", href: "/student/clubs", icon: Users },
                { name: "Campus Events", href: "/student/events", icon: MapPin },
                { name: "Dormitory", href: "/student/dormitory", icon: Home },
            ],
            isHeader: true,
        },
    ];

    return (
        <>
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-[1001] w-[280px] bg-[#EAEAEA] text-[#333] transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] lg:translate-x-0 flex flex-col font-[var(--font-montserrat)] ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Header Section */}
                <div className="flex items-center gap-3 px-4 py-4 bg-white border-b border-gray-200">
                    <div className="w-10 h-10 flex items-center justify-center">
                        <Image src="/logo.png" alt="KMSS" width={32} height={32} className="object-contain" />
                    </div>
                    <div className="flex-1 bg-[#EFAFAF] py-2 px-3 rounded-md">
                        <h4 className="text-sm font-bold text-[#333] uppercase">My portal</h4>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden ml-auto p-1 text-gray-500 hover:text-gray-800"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                    {sections.map((section, idx) => (
                        <div key={idx}>
                            {section.isHeader ? (
                                <div className="bg-[#EFAFAF] px-3 py-1.5 rounded-md mb-3">
                                    <h5 className="text-sm font-bold text-[#333]">{section.title}</h5>
                                </div>
                            ) : (
                                <h5 className="px-3 mb-2 text-sm font-semibold text-[#333]">{section.title}</h5>
                            )}

                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.href);
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors group ${active
                                                    ? "bg-white shadow-sm font-medium text-[#006400]"
                                                    : "text-gray-600 hover:bg-white/50 hover:text-black"
                                                }`}
                                        >
                                            <Icon size={18} className={active ? "text-[#006400]" : "text-gray-500 group-hover:text-black"} />
                                            <span>{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Footer / Logout */}
                <div className="p-4 bg-[#EAEAEA] border-t border-gray-200">
                    <Link href="/student/login" className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <LogOut size={18} />
                        <span className="font-semibold">Log out</span>
                    </Link>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-[1000] bg-black/30 backdrop-blur-sm lg:hidden transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </>
    );
}
