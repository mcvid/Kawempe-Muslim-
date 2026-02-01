"use client";
import { Crimson_Pro } from "next/font/google";
import Link from "next/link";
import {
  PhoneCall,
  ClipboardList,
  GraduationCap,
  Newspaper,
  ArrowRight,
} from "lucide-react";

const schoolFont = Crimson_Pro({
  subsets: ["latin"],
  weight: "400",
});

const QuickActions = () => {
  const actions = [
    {
      title: "Registration Inquiry",
      description:
        "Questions about admissions or enrollment? Get clarity on requirements, procedures, and timelines.",
      buttonText: "Contact Us",
      href: "/contact",
      icon: PhoneCall,
      gradient: "from-red-500 via-rose-500 to-orange-400",
    },
    {
      title: "Online Registration",
      description:
        "Apply online with ease. Start and complete your admission process from anywhere.",
      buttonText: "Apply Now",
      href: "/admissions",
      icon: ClipboardList,
      gradient: "from-emerald-400 via-green-500 to-teal-400",
    },
    {
      title: "Academics & Staff",
      description:
        "Explore academic programs, staff portals, and essential learning resources.",
      buttonText: "Learn More",
      href: "/academics",
      icon: GraduationCap,
      gradient: "from-blue-500 via-sky-500 to-cyan-400",
    },
    {
      title: "School News",
      description:
        "Stay in the loop with announcements, events, and key school updates.",
      buttonText: "View News",
      href: "/news",
      icon: Newspaper,
      gradient: "from-yellow-400 via-amber-400 to-orange-400",
    },
  ];

  return (
    <section className="text-slate-900 bg-white pb-28">
      <div className="max-w-7xl mx-auto px-6">
        <h2
          className={`text-4xl lg:text-5xl font-bold mb-14 text-center ${schoolFont.className}`}
        >
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {actions.map((action, idx) => {
            const Icon = action.icon;

            return (
              <div
                key={idx}
                className="group relative rounded-2xl p-[1px] overflow-hidden hover:scale-[1.03] transition-transform duration-300"
              >
                {/* Gradient border */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-80`}
                />

                {/* Card */}
                <div className="relative h-80 rounded-2xl bg-white/90 backdrop-blur-xl p-6 flex flex-col shadow-xl">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${action.gradient} text-white mb-4`}
                  >
                    <Icon size={22} />
                  </div>

                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {action.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-6">
                    {action.description}
                  </p>

                  <Link
                    href={action.href}
                    className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-gray-900 group-hover:text-blue-600 transition"
                  >
                    {action.buttonText}
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QuickActions;
