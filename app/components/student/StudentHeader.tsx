"use client";

import { Bell, MessageSquare, Search, Menu, User } from "lucide-react";
import Image from "next/image";

interface StudentHeaderProps {
    setSidebarOpen: (open: boolean) => void;
}

export default function StudentHeader({ setSidebarOpen }: StudentHeaderProps) {
    return (
        <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 z-50">
            {/* Left Section: Mobile Toggle & Welcome Message */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                    <Menu size={24} />
                </button>

                {/* Desktop Welcome Message */}
                <div className="hidden md:block bg-gray-200/80 px-6 py-2 rounded-full">
                    <span className="text-gray-800 font-medium text-sm">Welcome back Rahim</span>
                </div>

                {/* Mobile Logo (visible when Sidebar is hidden) */}
                <div className="lg:hidden w-8 h-8">
                    <Image src="/logo.png" alt="KMSS" width={32} height={32} className="object-contain" />
                </div>
            </div>

            {/* Center Section: Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full bg-gray-200/80 text-gray-700 text-sm py-2 px-12 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 placeholder:text-center placeholder:text-gray-500"
                    />
                    {/* Search logic usually goes here, putting icon center-ish if placeholder is center is tricky, standard left icon for now or just text */}
                </div>
            </div>

            {/* Right Section: Actions & Profile */}
            <div className="flex items-center gap-3 md:gap-4">
                {/* Mobile Search Icon */}
                <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                    <Search size={20} />
                </button>

                <button className="p-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors relative">
                    <MessageSquare size={24} strokeWidth={2} />
                    {/* Badge placeholder */}
                    {/* <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span> */}
                </button>

                <button className="p-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors relative">
                    <Bell size={24} strokeWidth={2} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#006400] rounded-full ring-2 ring-white"></span>
                </button>

                <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center overflow-hidden ml-1 cursor-pointer hover:ring-2 hover:ring-blue-100 transition-all">
                    {/* Placeholder Avatar */}
                    <Image
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rahim"
                        alt="Profile"
                        width={40}
                        height={40}
                        className="object-cover"
                    />
                </div>
            </div>
        </header>
    );
}
