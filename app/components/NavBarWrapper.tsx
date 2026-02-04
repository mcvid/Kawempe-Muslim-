"use client";

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";

export default function NavBarWrapper() {
    const pathname = usePathname();
    const isNewsDetailPage = pathname?.startsWith("/news/") && pathname !== "/news";
    const isAdminPage = pathname?.startsWith("/admin");
    const isShopPage = pathname?.startsWith("/shop");
    const isEventsPage = pathname?.startsWith("/events");
    const isElearningPage = pathname?.startsWith("/academics/e-learning");

    if (isAdminPage || isShopPage || isEventsPage || isElearningPage || isNewsDetailPage) return null;

    return <NavBar />;
}
