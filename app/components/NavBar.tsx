"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo, useRef } from "react";
import {
  Menu,
  X,
  ChevronDown,
  Search,
  FileText,
  BookOpen,
  Users,
  GraduationCap,
  Calendar,
  Mail,
  MapPin,
  Newspaper,
} from "lucide-react";
import Image from "next/image";
import Fuse from "fuse.js";
import { supabase } from "@/app/lib/supabase";

// Search data for global search
const searchData = [
  // Academics
  {
    title: "Academics Overview",
    href: "/academics",
    category: "Academics",
    icon: "graduation",
    keywords: "study excellence curriculum school high"
  },
  {
    title: "Curriculum Overview",
    href: "/academics/curriculum",
    category: "Academics",
    icon: "book",
    keywords: "syllabus subjects learning teaching"
  },
  {
    title: "Subject Departments",
    href: "/academics/departments",
    category: "Academics",
    icon: "book",
    keywords: "teachers faculty math science english"
  },
  {
    title: "E-learning Portal",
    href: "/academics/e-learning",
    category: "Academics",
    icon: "book",
    keywords: "online classes students portal"
  },
  {
    title: "Academic Calendar",
    href: "/academics/calendar",
    category: "Academics",
    icon: "calendar",
    keywords: "dates term holidays events schedule"
  },
  {
    title: "Library",
    href: "/academics/library",
    category: "Academics",
    icon: "book",
    keywords: "books research reading study"
  },
  {
    title: "Library Search",
    href: "/academics/library/search",
    category: "Academics",
    icon: "search",
    keywords: "find books resources papers"
  },
  {
    title: "Past Papers",
    href: "/academics/library/past-papers",
    category: "Academics",
    icon: "file",
    keywords: "exams revision o-level a-level papers"
  },
  {
    title: "O-Level Resources",
    href: "/academics/library/resources/o-level",
    category: "Academics",
    icon: "book",
    keywords: "o-level notes revision study"
  },
  {
    title: "A-Level Resources",
    href: "/academics/library/resources/a-level",
    category: "Academics",
    icon: "book",
    keywords: "a-level notes advanced level study"
  },
  {
    title: "Study Tips",
    href: "/academics/study-tips",
    category: "Academics",
    icon: "book",
    keywords: "revision advice help grades success"
  },
  {
    title: "Timetables",
    href: "/academics/timetables",
    category: "Academics",
    icon: "calendar",
    keywords: "classes schedule time table"
  },
  {
    title: "Academic Success",
    href: "/academics/success",
    category: "Academics",
    icon: "graduation",
    keywords: "results achievements excellence"
  },
  // About
  { title: "About Us", href: "/about", category: "About", icon: "users", keywords: "school profile information who we are" },
  {
    title: "Our History",
    href: "/about/history",
    category: "About",
    icon: "users",
    keywords: "background origin past founder"
  },
  {
    title: "Headteacher's Message",
    href: "/about/headteacher-message",
    category: "About",
    icon: "mail",
    keywords: "welcome principal message head teacher"
  },
  {
    title: "Strategic Plan",
    href: "/about/strategic-plan",
    category: "About",
    icon: "file",
    keywords: "goals future planning roadmap"
  },
  {
    title: "Mission, Vision & Values",
    href: "/about/mission-more",
    category: "About",
    icon: "users",
    keywords: "philosophy core values aims"
  },
  {
    title: "School Leadership",
    href: "/about/leadership",
    category: "About",
    icon: "users",
    keywords: "management board governors directors"
  },
  {
    title: "Staff Hierarchy",
    href: "/about/hierarchy",
    category: "About",
    icon: "users",
    keywords: "teachers structure organization"
  },
  {
    title: "Campus Life",
    href: "/about/campus-life",
    category: "About",
    icon: "users",
    keywords: "students environment activities school life"
  },
  {
    title: "Credentials & Partners",
    href: "/about/credentials",
    category: "About",
    icon: "users",
    keywords: "accreditation partners connections"
  },
  {
    title: "Virtual Tour",
    href: "/about/virtual-tour",
    category: "About",
    icon: "map",
    keywords: "map walkthrough 360 view campus"
  },
  // Admissions
  {
    title: "Admissions Overview",
    href: "/admissions",
    category: "Admissions",
    icon: "graduation",
    keywords: "join apply enrollment admission"
  },
  {
    title: "Online Application",
    href: "/admissions/apply",
    category: "Admissions",
    icon: "file",
    keywords: "apply online form registration"
  },
  {
    title: "School Fees",
    href: "/fees",
    category: "Admissions",
    icon: "file",
    keywords: "payment cost money structure tuition"
  },
  {
    title: "Scholarships",
    href: "/admissions/scholarships",
    category: "Admissions",
    icon: "graduation",
    keywords: "bursary help financial aid support"
  },
  {
    title: "Admissions FAQs",
    href: "/admissions/faqs",
    category: "Admissions",
    icon: "file",
    keywords: "questions answers help information"
  },
  // Portal
  {
    title: "Student Portal",
    href: "/student/login",
    category: "Portal",
    icon: "users",
    keywords: "login results account student"
  },
  {
    title: "Staff Portal",
    href: "/portal/staff",
    category: "Portal",
    icon: "users",
    keywords: "teacher login administration"
  },
  {
    title: "Grade Submissions",
    href: "/portal/grade-submissions",
    category: "Portal",
    icon: "file",
    keywords: "marks exams entry teacher"
  },
  {
    title: "Internal Messaging",
    href: "/portal/messages",
    category: "Portal",
    icon: "mail",
    keywords: "chat communicate inbox mail"
  },
  {
    title: "Admin Dashboard",
    href: "/admin/dashboard",
    category: "Portal",
    icon: "users",
    keywords: "management control panel admin"
  },
  // News & Contact
  { title: "Latest News", href: "/news", category: "News", icon: "news", keywords: "updates information blog" },
  {
    title: "Upcoming Events",
    href: "/events",
    category: "News",
    icon: "calendar",
    keywords: "calendar schedule what is happening"
  },
  {
    title: "Student Onboarding",
    href: "/events/onboarding",
    category: "News",
    icon: "users",
    keywords: "new students orientation help welcome"
  },
  {
    title: "Newsletters",
    href: "/newsletters",
    category: "News",
    icon: "news",
    keywords: "papers weekly monthly updates"
  },
  { title: "Press Releases", href: "/press", category: "News", icon: "news", keywords: "media announcements" },
  { title: "Contact Us", href: "/contact", category: "Contact", icon: "mail", keywords: "email phone address talk to us" },
  {
    title: "Our Location",
    href: "/location",
    category: "Contact",
    icon: "map",
    keywords: "map directions where we are kawempe"
  },
  {
    title: "Parent-Teacher Hub",
    href: "/communication/parent-teacher",
    category: "Contact",
    icon: "users",
    keywords: "meeting communication parents"
  },
];

const navLinksLeft = [
  {
    title: "Academics",
    href: "/academics",
    sublinks: [
      { title: "Academics Overview", href: "/academics" },
      { title: "Curriculum Overview", href: "/academics/curriculum" },
      { title: "Subject Departments", href: "/academics/departments" },
      { title: "E-learning", href: "/academics/e-learning" },
      { title: "Academic Calendar", href: "/academics/calendar" },
      {
        title: "Library",
        href: "#",
        sublinks: [
          { title: "Resources", href: "/academics/library/resources" },
          { title: "Past Papers", href: "/academics/library/past-papers" },
        ],
      },
      { title: "Study Tips", href: "/academics/study-tips" },
      { title: "Timetables", href: "/academics/timetables" },
    ],
  },
  {
    title: "About",
    href: "/about",
    sublinks: [
      { title: "About Overview", href: "/about" },
      { title: "Our History", href: "/about/history" },
      { title: "Foundations", href: "/#foundations" },
      { title: "Leadership", href: "/about/leadership" },
      { title: "Staff Hierarchy", href: "/about/hierarchy" },
      { title: "Campus Life", href: "/about/campus-life" },
      { title: "Credentials & Partners", href: "/about/credentials" },
      { title: "Virtual Tour", href: "/about/virtual-tour" },
      { title: "Strategic Plan", href: "/about/strategic-plan" },
      { title: "Mission & More", href: "/about/mission-more" },
      { title: "School Shop", href: "/shop/uniforms" },
    ],
  },
];

const navLinksRight = [
  {
    title: "Admissions",
    href: "/admissions",
    sublinks: [
      { title: "Admissions Overview", href: "/admissions" },
      { title: "Online Application", href: "/admissions/apply" },
      { title: "School Fees", href: "/fees" },
      { title: "Scholarships", href: "/admissions/scholarships" },
      { title: "FAQs", href: "/admissions/faqs" },
    ],
  },
  {
    title: "Portal",
    href: "/portal",
    sublinks: [
      { title: "Portal Overview", href: "/portal" },
      { title: "Student Login", href: "/student/login" },
      { title: "Staff Portal", href: "/portal/staff" },
      { title: "Grade Submissions", href: "/portal/grade-submissions" },
      { title: "Internal Messaging", href: "/portal/messages" },
    ],
  },
];

const allNavLinks: {
  title: string;
  href: string;
  sublinks?: {
    title: string;
    href: string;
    sublinks?: { title: string; href: string }[];
  }[];
}[] = [
    {
      title: "Home",
      href: "/",
    },
    ...navLinksLeft,
    ...navLinksRight,
    {
      title: "News",
      href: "/news",
      sublinks: [
        { title: "News Overview", href: "/news" },
        { title: "Latest News", href: "/news" },
        { title: "Upcoming Events", href: "/events" },
        { title: "Newsletters", href: "/newsletters" },
        { title: "Press Releases", href: "/press" },
      ],
    },
    {
      title: "Contact",
      href: "/contact",
      sublinks: [
        { title: "Contact Overview", href: "/contact" },
        { title: "Contact Us", href: "/contact" },
        { title: "Our Location", href: "/location" },
        { title: "Parent-Teacher Hub", href: "/communication/parent-teacher" },
      ],
    },
  ];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const [mobileSubOpen, setMobileSubOpen] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Robust Secret Admin Triggers
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const keyBufferRef = useRef<string>("");

  const triggerAdminAccess = async () => {
    try {
      sessionStorage.setItem("secretAccess", "true");
      await supabase.auth.signOut();
      router.push("/admin/login");
    } catch (error) {
      console.error("Error during admin access trigger:", error);
      // Fallback: still attempt navigation if signOut fails
      router.push("/admin/login");
    }
  };

  // Keyboard Triggers (Shift + A & 'admin' keyword)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in inputs
      const target = e.target as HTMLElement;
      if (
        ["INPUT", "TEXTAREA"].includes(target.tagName) ||
        target.isContentEditable
      )
        return;

      // 1. Shift + A
      if (e.shiftKey && (e.key === "A" || e.key === "a")) {
        triggerAdminAccess();
      }

      // 2. Magic Keyword 'admin'
      keyBufferRef.current += e.key.toLowerCase();
      if (keyBufferRef.current.length > 5) {
        keyBufferRef.current = keyBufferRef.current.slice(-5);
      }
      if (keyBufferRef.current === "admin") {
        triggerAdminAccess();
        keyBufferRef.current = ""; // Reset
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Multi-Click Trigger (7 clicks in 2s)
  useEffect(() => {
    let resetTimer: NodeJS.Timeout;
    if (clickCount > 0) {
      resetTimer = setTimeout(() => setClickCount(0), 2000);
    }
    if (clickCount >= 7) {
      triggerAdminAccess();
      // Use a small timeout to avoid the synchronous state update lint in the effect
      setTimeout(() => setClickCount(0), 0);
    }
    return () => clearTimeout(resetTimer);
  }, [clickCount]);

  const handleLogoClick = () => {
    // Increment click count for secret trigger
    setClickCount((prev) => prev + 1);
  };

  const startLongPress = () => {
    longPressTimerRef.current = setTimeout(triggerAdminAccess, 3000);
  };

  const endLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  // Fuse.js search instance
  const fuse = useMemo(
    () =>
      new Fuse(searchData, {
        keys: [
          { name: "title", weight: 0.7 },
          { name: "keywords", weight: 0.5 },
          { name: "category", weight: 0.3 },
        ],
        threshold: 0.3,
        includeScore: true,
      }),
    [],
  );

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return fuse.search(searchQuery).slice(0, 8);
  }, [searchQuery, fuse]);

  // Get icon component based on type
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "graduation":
        return <GraduationCap size={16} />;
      case "book":
        return <BookOpen size={16} />;
      case "file":
        return <FileText size={16} />;
      case "calendar":
        return <Calendar size={16} />;
      case "users":
        return <Users size={16} />;
      case "mail":
        return <Mail size={16} />;
      case "map":
        return <MapPin size={16} />;
      case "news":
        return <Newspaper size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  // Category colors
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Academics":
        return "bg-green-500";
      case "About":
        return "bg-blue-500";
      case "Admissions":
        return "bg-amber-400";
      case "Portal":
        return "bg-red-500";
      case "News":
        return "bg-green-600";
      case "Contact":
        return "bg-blue-600";
      default:
        return "bg-slate-500";
    }
  };

  const isHome = pathname === "/";
  const isAcademics = pathname === "/academics";
  const isSuccess = pathname === "/academics/success";
  const isAbout = pathname === "/about";
  const isHeadteacherMsg = pathname === "/about/headteacher-message";
  const isHierarchy = pathname === "/about/hierarchy";
  const isLeadership = pathname === "/about/leadership";
  const isVirtualTour = pathname === "/about/virtual-tour";
  const isHistory = pathname === "/about/history";
  const isStrategicPlan = pathname === "/about/strategic-plan";
  // Text color logic: White on pages with dark hero backgrounds (Home, Academics, Success, About) when not scrolled. Otherwise dark.
  const hasDarkHero =
    isHome ||
    isAcademics ||
    isSuccess ||
    isAbout ||
    isHistory ||
    isStrategicPlan ||
    isHeadteacherMsg ||
    isHierarchy ||
    isLeadership;
  // Text color logic
  let textColorClass =
    "text-slate-700 hover:border-slate-700 hover:bg-slate-50";
  let hoverClass = "group-hover:bg-white group-hover:text-green-600"; // Default hover behavior
  let fontWeightClass = "font-bold";

  if (hasDarkHero && !scrolled) {
    if (isSuccess) {
      // Success Page: Dark contrast text for visibility on bright image
      textColorClass = "text-slate-900 hover:text-green-700";
      hoverClass = "group-hover:bg-slate-100/50";
      fontWeightClass = "font-black tracking-wide";
    } else {
      // Other Dark Heroes: White text
      textColorClass = "text-white hover:border-white";
    }
  }

  const iconColorClass =
    hasDarkHero && !scrolled && !isSuccess ? "text-white" : "text-slate-700";

  // Helper to close dropdowns on click (removes focus)
  const handleLinkClick = () => {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      activeElement.blur();
    }
    setOpen(false); // Also close mobile menu if open
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      if (window.scrollY > 20) setOpen(false);
    };
    window.addEventListener("scroll", onScroll);
    setTimeout(() => setLoaded(true), 0);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (
    pathname?.startsWith("/academics/library") ||
    pathname?.startsWith("/portal") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/student")
  ) return null;

  return (
    <>
      {/* FULL NAVBAR (BEFORE SCROLL) */}
      <nav
        className={`
          fixed top-0 left-0 w-full z-50 py-6
          transition-all duration-500
          ${scrolled ? "opacity-0 -translate-y-10 pointer-events-none" : "opacity-100"}
        `}
      >
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-center lg:gap-10">
          {/* LEFT NAV */}
          <ul className="hidden lg:flex gap-6 items-center">
            <li>
              <Link
                href="/"
                className={`${iconColorClass} hover:text-green-400 transition-colors`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-home"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </Link>
            </li>
            {navLinksLeft.map((link, idx) => (
              <li
                key={link.title}
                className={`relative group transform transition-all duration-500 ease-out ${loaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
                  }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center">
                  <Link
                    href={link.href}
                    className={`px-6 py-2.5 rounded-full border-2 border-transparent transition ${fontWeightClass} uppercase text-sm cursor-pointer flex items-center gap-1 ${hoverClass} ${textColorClass}`}
                  >
                    {link.title}{" "}
                    {link.sublinks && (
                      <ChevronDown
                        size={14}
                        className="group-hover:rotate-180 transition-transform"
                      />
                    )}
                  </Link>
                </div>

                {link.sublinks && (
                  <div className="absolute left-0 top-full pt-2 w-64 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto transition-all duration-300 z-[60]">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-visible border border-slate-100">
                      <div className="py-2">
                        {link.sublinks.map((sub: any) => (
                          <div key={sub.title} className="relative group/sub">
                            <Link
                              href={sub.href}
                              onClick={
                                sub.sublinks
                                  ? (e) => e.preventDefault()
                                  : handleLinkClick
                              }
                              className={`block px-6 py-3 text-slate-700 hover:bg-green-50 hover:text-green-600 transition text-sm font-medium flex justify-between items-center ${sub.sublinks ? "cursor-default" : ""}`}
                            >
                              {sub.title}
                              {sub.sublinks && (
                                <ChevronDown size={12} className="-rotate-90" />
                              )}
                            </Link>

                            {/* Level 3 Dropdown (Flyout to the right) */}
                            {sub.sublinks && (
                              <div className="absolute left-full top-0 ml-0 w-56 opacity-0 translate-x-2 pointer-events-none group-hover/sub:opacity-100 group-hover/sub:translate-x-0 group-hover/sub:pointer-events-auto transition-all duration-300 z-[70]">
                                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 mx-2">
                                  <div className="py-2">
                                    {sub.sublinks.map((nested: any) => (
                                      <Link
                                        key={nested.title}
                                        href={nested.href}
                                        onClick={handleLinkClick}
                                        className="block px-6 py-3 text-slate-700 hover:bg-green-50 hover:text-green-600 transition text-sm font-medium"
                                      >
                                        {nested.title}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div
            className="flex-shrink-0 z-50 cursor-pointer"
            onMouseDown={startLongPress}
            onMouseUp={endLongPress}
            onMouseLeave={endLongPress}
            onTouchStart={startLongPress}
            onTouchEnd={endLongPress}
          >
            <div
              className="flex flex-col items-center"
              onClick={handleLogoClick}
            >
              <Image
                src="/logo.png"
                width={80}
                height={80}
                className="w-20 h-20 drop-shadow-2xl"
                alt="Logo"
                priority
              />
              <div className="hidden lg:block text-center mt-1">
                <p
                  className={`text-[10px] uppercase font-bold tracking-[0.3em] ${hasDarkHero && !scrolled ? "text-white" : "text-slate-800"}`}
                >
                  Go Higher
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT NAV */}
          <ul className="hidden lg:flex gap-6 items-center">
            {navLinksRight.map((link, idx) => (
              <li
                key={link.title}
                className={`relative group transform transition-all duration-500 ease-out ${loaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
                  }`}
                style={{ transitionDelay: `${(idx + 2) * 100}ms` }}
              >
                <div className="flex items-center">
                  <Link
                    href={link.href}
                    className={`px-6 py-2.5 rounded-full border-2 border-transparent transition ${fontWeightClass} uppercase text-sm cursor-pointer flex items-center gap-1 ${hoverClass} ${textColorClass}`}
                  >
                    {link.title}{" "}
                    {link.sublinks && (
                      <ChevronDown
                        size={14}
                        className="group-hover:rotate-180 transition-transform"
                      />
                    )}
                  </Link>
                </div>

                {link.sublinks && (
                  <div className="absolute right-0 top-full pt-2 w-64 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto transition-all duration-300 z-[60]">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                      <div className="py-2">
                        {link.sublinks.map((sub) => (
                          <Link
                            key={sub.title}
                            href={sub.href}
                            onClick={handleLinkClick}
                            className="block px-6 py-3 text-slate-700 hover:bg-green-50 hover:text-green-600 transition text-sm font-medium"
                          >
                            {sub.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
            <li className="flex gap-4 ml-2">
              {/* Users Icon - News & Events Dropdown */}
              <div className="relative group">
                <button
                  className={`${iconColorClass} hover:text-green-400 transition-colors cursor-pointer`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-users"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </button>
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full pt-2 w-48 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto transition-all duration-300 z-[60]">
                  <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                    <div className="py-2">
                      <Link
                        href="/news"
                        onClick={handleLinkClick}
                        className="block px-6 py-3 text-slate-700 hover:bg-green-50 hover:text-green-600 transition text-sm font-medium"
                      >
                        News
                      </Link>
                      <Link
                        href="/events"
                        onClick={handleLinkClick}
                        className="block px-6 py-3 text-slate-700 hover:bg-green-50 hover:text-green-600 transition text-sm font-medium"
                      >
                        Events
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Headphones Icon - Communication Link */}
              <Link
                href="/communication"
                className={`${iconColorClass} hover:text-green-400 transition-colors`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-headphones"
                >
                  <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
                </svg>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* FLOATING HAMBURGER (ALWAYS VISIBLE ON MOBILE, OR AFTER SCROLL ON DESKTOP) */}
      <button
        onClick={() => setOpen(!open)}
        className={`
          fixed top-6 right-6 z-[70]
          w-14 h-14 rounded-full
          bg-green-600 text-white
          flex items-center justify-center
          shadow-xl transition-all duration-500
          ${scrolled || open ? "scale-100 opacity-100" : "lg:scale-0 lg:opacity-0 max-lg:scale-100 max-lg:opacity-100"}
        `}
      >
        {open ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* CURVED REVEAL MENU */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[60]">
            {/* OVERLAY */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
              onClick={() => setOpen(false)}
            />

            {/* CURVED BACKGROUND */}
            <svg
              className="fixed top-0 right-0 h-full w-full pointer-events-none z-50 overflow-visible"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <motion.path
                initial={{ d: "M 100 0 L 100 100 L 100 100 Q 100 50 100 0 Z" }}
                animate={{
                  d: [
                    "M 100 0 L 100 100 L 100 100 Q 100 50 100 0 Z",
                    "M 100 0 L 100 100 L -10 100 Q -50 50 -10 0 Z",
                    "M 100 0 L 100 100 L 0 100 Q 0 50 0 0 Z",
                  ],
                }}
                exit={{
                  d: [
                    "M 100 0 L 100 100 L 0 100 Q 0 50 0 0 Z",
                    "M 100 0 L 100 100 L -10 100 Q -50 50 -10 0 Z",
                    "M 100 0 L 100 100 L 100 100 Q 100 50 100 0 Z",
                  ],
                }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                fill="#16a34a"
                className="pointer-events-auto"
              />
            </svg>

            {/* MENU CONTENT (FULL SCREEN MOBILE) */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.76, 0, 0.24, 1],
                delay: 0.1,
              }}
              className="fixed top-0 right-0 h-full w-full z-[60] flex flex-col items-center justify-start pt-24 px-10 text-white pointer-events-auto overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="flex flex-col items-center gap-4 mb-6 shrink-0 cursor-pointer"
                onClick={handleLogoClick}
                onMouseDown={startLongPress}
                onMouseUp={endLongPress}
                onMouseLeave={endLongPress}
                onTouchStart={startLongPress}
                onTouchEnd={endLongPress}
              >
                <Image
                  src="/logo.png"
                  width={80}
                  height={80}
                  alt="Logo"
                  className="w-20 h-20"
                />
                <div className="text-center">
                  <h2 className="text-3xl font-bold leading-tight uppercase tracking-widest">
                    KMSS{" "}
                  </h2>
                  <p className="text-sm opacity-80 tracking-[0.4em] uppercase">
                    Go Higher
                  </p>
                </div>
              </div>

              {/* GLOBAL SEARCH BAR */}
              <div className="w-full max-w-md mb-8 relative">
                <div
                  className={`relative transition-all duration-300 ${searchFocused ? "scale-105" : ""}`}
                >
                  <Search
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-green-200"
                  />
                  <input
                    type="text"
                    placeholder="Search pages, resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() =>
                      setTimeout(() => setSearchFocused(false), 200)
                    }
                    className="w-full py-3.5 pl-12 pr-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder:text-white/50 focus:bg-white/20 focus:border-amber-400 outline-none transition-all text-base"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>

                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {searchQuery && searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[50vh] overflow-y-auto"
                    >
                      {searchResults.map((result, idx) => (
                        <Link
                          key={result.item.href}
                          href={result.item.href}
                          onClick={() => {
                            setSearchQuery("");
                            setOpen(false);
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                        >
                          <div
                            className={`w-8 h-8 rounded-lg ${getCategoryColor(result.item.category)} text-white flex items-center justify-center`}
                          >
                            {getIcon(result.item.icon)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-800 font-semibold text-sm truncate">
                              {result.item.title}
                            </p>
                            <p className="text-slate-400 text-xs">
                              {result.item.category}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* No Results */}
                <AnimatePresence>
                  {searchQuery && searchResults.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl p-6 text-center"
                    >
                      <Search
                        size={32}
                        className="mx-auto text-slate-300 mb-2"
                      />
                      <p className="text-slate-500 text-sm">
                        No results found for &quot;{searchQuery}&quot;
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <ul className="flex flex-col gap-4 w-full max-w-md pb-10">
                {allNavLinks.map((link, idx) => (
                  <motion.li
                    key={link.title}
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + idx * 0.05 }}
                    className="flex flex-col gap-2"
                  >
                    {!link.sublinks ? (
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between w-full text-2xl font-semibold py-3 border-b border-white/10 uppercase tracking-wide"
                      >
                        {link.title}
                      </Link>
                    ) : (
                      <>
                        <button
                          onClick={() =>
                            setMobileOpen(
                              mobileOpen === link.title ? null : link.title,
                            )
                          }
                          className="flex items-center justify-between w-full text-2xl font-semibold py-3 border-b border-white/10"
                        >
                          <span className="uppercase tracking-wide">
                            {link.title}
                          </span>
                          <ChevronDown
                            className={`transition-transform duration-300 ${mobileOpen === link.title ? "rotate-180" : ""}`}
                            size={22}
                          />
                        </button>

                        <AnimatePresence>
                          {mobileOpen === link.title && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="flex flex-col gap-4 py-2 pl-4 overflow-hidden bg-white/5 rounded-xl mt-1"
                            >
                              {link.sublinks.map((sub: any) => (
                                <div key={sub.title}>
                                  {sub.sublinks ? (
                                    <>
                                      <button
                                        onClick={() =>
                                          setMobileSubOpen(
                                            mobileSubOpen === sub.title
                                              ? null
                                              : sub.title,
                                          )
                                        }
                                        className="w-full text-left text-lg opacity-80 hover:opacity-100 transition-all py-1 flex justify-between items-center"
                                      >
                                        {sub.title}
                                        <ChevronDown
                                          className={`transition-transform duration-300 ${mobileSubOpen === sub.title ? "rotate-180" : ""}`}
                                          size={16}
                                        />
                                      </button>
                                      <AnimatePresence>
                                        {mobileSubOpen === sub.title && (
                                          <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{
                                              height: "auto",
                                              opacity: 1,
                                            }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="flex flex-col gap-2 pl-4 border-l border-white/20 ml-2 mt-1 mb-2"
                                          >
                                            {sub.sublinks.map((nested: any) => (
                                              <Link
                                                key={nested.title}
                                                href={nested.href}
                                                onClick={() => setOpen(false)}
                                                className="text-base opacity-70 hover:opacity-100 transition-all py-1 block"
                                              >
                                                {nested.title}
                                              </Link>
                                            ))}
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </>
                                  ) : (
                                    <Link
                                      href={sub.href}
                                      onClick={() => setOpen(false)}
                                      className="text-lg opacity-80 hover:opacity-100 transition-all py-1 block"
                                    >
                                      {sub.title}
                                    </Link>
                                  )}
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
