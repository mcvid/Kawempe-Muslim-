"use client";

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";

export default function NavBarWrapper() {
    const pathname = usePathname();
    const isAdminPage = pathname?.startsWith("/admin");
    const isShopPage = pathname?.startsWith("/shop");
    const isEventsPage = pathname?.startsWith("/events");

    if (isAdminPage || isShopPage || isEventsPage) return null;

    return <NavBar />;
}
