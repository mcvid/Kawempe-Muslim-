"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    FileText,
    Calendar,
    Image as ImageIcon,
    MessageSquare,
    LogOut,
    Layers,
    Menu,
    X,
    DollarSign,
    BookOpen,
    Mail,
    ClipboardList,
    Camera,
    Newspaper,
    Settings,
    Navigation,
    ShoppingBag,
    Bell,
} from "lucide-react";
import { supabase } from "@/app/lib/supabase";

// Navigation structure organized by importance
const navSections = [
    {
        title: "Main Dashboard",
        items: [
            { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
            { name: "Admissions", href: "/admin/admissions", icon: FileText },
            { name: "Students", href: "/admin/students", icon: Users },
            { name: "Teachers", href: "/admin/teachers", icon: GraduationCap },
            { name: "Finance", href: "/admin/finance", icon: DollarSign },
        ],
    },
    {
        title: "Web Content",
        items: [
            { name: "News & Updates", href: "/admin/news", icon: Newspaper },
            { name: "Events", href: "/admin/events", icon: Calendar },
            { name: "Gallery", href: "/admin/gallery", icon: Camera },
            { name: "Virtual Tour", href: "/admin/tour", icon: Navigation },
            { name: "Hero Slides", href: "/admin/hero", icon: ImageIcon },
            { name: "Announcements", href: "/admin/announcements", icon: Bell },
            { name: "School Shop", href: "/admin/shop", icon: ShoppingBag },
            { name: "Administration", href: "/admin/administration", icon: Users },
        ],
    },
    {
        title: "Communication",
        items: [
            { name: "Contact Messages", href: "/admin/contact", icon: MessageSquare },
            { name: "Parent Emails", href: "/admin/parent-emails", icon: Mail },
        ],
    },
    {
        title: "Academic Portal",
        items: [
            { name: "Marks Entry", href: "/admin/marks", icon: ClipboardList },
            { name: "Timetables", href: "/admin/timetables", icon: Calendar },
            { name: "Departments", href: "/admin/departments", icon: Layers },
            { name: "Subjects & Notes", href: "/admin/resources", icon: GraduationCap },
            { name: "Past Papers", href: "/admin/papers", icon: BookOpen },
        ],
    },
];

// Bottom nav items (Tier 1 - most important)
const bottomNavItems = [
    { name: "Home", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Admissions", href: "/admin/admissions", icon: FileText },
    { name: "Finance", href: "/admin/finance", icon: DollarSign },
    { name: "News", href: "/admin/news", icon: Newspaper },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState<{ email?: string; role?: string } | null>(null);
    const [loading, setLoading] = useState(true);

    // Check auth on mount
    useEffect(() => {
        const checkAuth = async () => {
            console.log("AdminLayout: checkAuth starting...");
            try {
                const { data: { session } } = await supabase.auth.getSession();
                console.log("AdminLayout: Session check:", session ? "Found" : "Not Found");

                if (!session && pathname !== "/admin/login") {
                    console.log("AdminLayout: No session, redirecting to login...");
                    router.push("/admin/login");
                } else if (session) {
                    // Fetch user profile to get role
                    console.log("AdminLayout: Fetching role for:", session.user.id);
                    const { data: profiles, error: profileError } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', session.user.id);

                    if (profileError) console.warn("AdminLayout: Profile fetch error:", profileError);

                    const profile = profiles?.[0];
                    console.log("AdminLayout: Role determined:", profile?.role || 'admin');

                    setUser({
                        email: session.user.email,
                        role: profile?.role || 'admin'
                    });
                }
            } catch (err) {
                console.error("AdminLayout: Critical auth error:", err);
            } finally {
                console.log("AdminLayout: Setting loading to false");
                setLoading(false);
            }
        };
        checkAuth();
    }, [pathname, router]);

    // Don't show layout on login page
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
    };

    const isActive = (href: string) => pathname === href;


    if (loading) return null; // Or a loading spinner



    // ADMIN LAYOUT (Default)
    return (
        <div className="flex h-screen overflow-hidden bg-[#F8F8F8] font-[var(--font-montserrat)]">
            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-[1000] bg-black/30 backdrop-blur-sm lg:hidden transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Admin Sidebar (Fixed Desktop, Slide-in Mobile) */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-[1001] w-[260px] bg-[#1C1C1C] text-white transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] lg:translate-x-0 flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Logo Section */}
                <div className="flex items-center gap-3.5 px-6 py-6 border-b border-white/5 flex-shrink-0">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                        <Image
                            src="/logo.png"
                            alt="KMSS"
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                    </div>
                    <div className="min-w-0">
                        <h4 className="text-[42px] tracking-wider font-[var(--font-barlow)] leading-none text-[#FFD700]">KMSS</h4>
                        <p className="text-[11px] text-white/50 uppercase tracking-[2.5px] mt-1 font-semibold">Admin Panel</p>
                    </div>
                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden ml-auto p-2 text-white/40 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* User Context */}
                <div className="px-6 py-4 border-b border-white/5 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#006400] rounded-full flex items-center justify-center text-white font-bold text-xs overflow-hidden border border-white/10">
                            {user?.email?.charAt(0).toUpperCase() || "A"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold truncate font-[var(--font-barlow)] uppercase tracking-wide">
                                {user?.email?.split('@')[0] || "Admin"}
                            </p>
                            <p className="text-[10px] text-[#FFD700] uppercase font-bold tracking-wider flex items-center gap-1">
                                Online
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation - Dedicated scrolling area inside aside */}
                <nav className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-8">
                    {navSections.map((section) => (
                        <div key={section.title}>
                            <p className="px-3 mb-3 text-[11px] font-medium text-white/30 uppercase tracking-[3px]">
                                {section.title}
                            </p>
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.href);
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-300 group ${active
                                                ? "bg-white/10 text-white"
                                                : "text-white/60 hover:text-white hover:bg-white/5"
                                                }`}
                                        >
                                            <Icon className={`w-4 h-4 transition-colors ${active ? "text-[#FFD700]" : "text-white/30 group-hover:text-[#FFD700]"}`} />
                                            <span className="font-[var(--font-barlow)] uppercase tracking-wide truncate">{item.name}</span>
                                            {active && <div className="w-1 h-3.5 bg-[#FFD700] ml-auto rounded-full" />}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Logout Button (Bottom) */}
                <div className="p-4 bg-[#1C1C1C] border-t border-white/5 flex-shrink-0">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Wrapper */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar (Sticky in flex column) */}
                <header className="flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div>
                            <h4 className="text-base md:text-[30px] font-semibold text-slate-900 font-[var(--font-barlow)] uppercase tracking-tight">
                                {navSections.flatMap(s => s.items).find(i => isActive(i.href))?.name || "Dashboard"}
                            </h4>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center p-2 border border-slate-100 rounded-xl bg-white shadow-sm">
                            <Image
                                src="/logo.png"
                                alt="KMSS"
                                width={60}
                                height={60}
                                className="object-contain"
                            />
                        </div>
                    </div>
                </header>

                {/* Page Content - Dedicated scrolling area */}
                <main className="flex-1 overflow-y-auto bg-slate-50/50 p-4 md:p-10">
                    <div className="max-w-7xl mx-auto pb-32 md:pb-10">
                        {children}
                    </div>
                </main>

                {/* Mobile Bottom Navigation */}
                {!sidebarOpen && (
                    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[1001] bg-white border-t border-slate-100 px-6 py-3">
                        <nav className="flex justify-between items-center max-w-md mx-auto">
                            {bottomNavItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl transition-all duration-300 ${active
                                            ? "bg-[#006400]/10 text-[#006400]"
                                            : "text-slate-400"
                                            }`}
                                    >
                                        <Icon className={`w-5 h-5 ${active ? "text-[#006400]" : "text-slate-400"}`} />
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${active ? "text-[#006400]" : "text-slate-500"}`}>
                                            {item.name}
                                        </span>
                                    </Link>
                                );
                            })}
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="flex flex-col items-center gap-1.5 px-4 py-2 text-slate-400"
                            >
                                <Settings className="w-5 h-5" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">More</span>
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
}
