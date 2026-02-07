"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import React from "react";
import "./Breadcrumbs.css";

interface BreadcrumbsProps {
  colorClass?: string;
}

const Breadcrumbs = ({ colorClass }: BreadcrumbsProps) => {
  const pathname = usePathname();

  // Don't show on home page
  if (pathname === "/" || !pathname) return null;

  // Split path into segments
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  // Helper to capitalize and format segment names
  const formatSegment = (segment: string) => {
    return segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs-container">
      <div className="breadcrumbs-content">
        <ol className="breadcrumbs-list">
          <li className="breadcrumb-item">
            <Link href="/" className={`breadcrumb-link home-link ${colorClass || ""}`}>
              <Home size={16} />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          {pathSegments.map((segment, index) => {
            const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
            const isLast = index === pathSegments.length - 1;

            return (
              <React.Fragment key={href}>
                <li className={`breadcrumb-separator ${colorClass || ""}`}>
                  <ChevronRight size={14} />
                </li>
                <li className="breadcrumb-item">
                  {isLast ? (
                    <span className={`breadcrumb-current ${colorClass || ""}`} aria-current="page">
                      {formatSegment(segment)}
                    </span>
                  ) : (
                    <Link href={href} className={`breadcrumb-link ${colorClass || ""}`}>
                      {formatSegment(segment)}
                    </Link>
                  )}
                </li>
              </React.Fragment>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
