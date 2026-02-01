"use client";

import { useState } from "react";
import StudentSidebar from "@/app/components/student/StudentSidebar";
import StudentHeader from "@/app/components/student/StudentHeader";
import { usePathname } from "next/navigation";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    const isLoginPage = pathname === "/student/login";

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[#F5F5F5] font-[var(--font-montserrat)]">
            {/* Sidebar */}
            <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <StudentHeader setSidebarOpen={setSidebarOpen} />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
