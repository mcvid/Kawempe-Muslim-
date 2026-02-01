"use client";
import Link from 'next/link';

const AboutInfo = () => {
    const navItems = [
        { name: 'History', href: '/about/history' },
        { name: 'From the headteacher', href: '/about/headteacher-message' },
        { name: 'Administration', href: '/about/hierarchy' },
        { name: 'Board of governors', href: '/about/leadership' },
        { name: 'Strategic plan', href: '/about/strategic-plan' },
        { name: 'Mission & more', href: '/about/mission-more' },
        { name: 'Online store', href: '/shop' },
        { name: 'Strategic plan', href: '/about/strategic-plan' },
    ];

    return (
        <div className="flex flex-col lg:flex-row">
            {/* Main Content - Left */}
            <div className="flex-1 bg-[#E0F7FA] px-6 py-12 md:p-16 text-slate-800">
                <div className="max-w-4xl">
                    <h2 className="text-3xl font-bold uppercase mb-6 tracking-wide text-slate-900 font-[var(--font-barlow)]">ABOUT</h2>
                    <div className="prose prose-lg text-slate-700 max-w-none leading-relaxed">
                        <p className="mb-4">
                            Kawempe Muslim’s mission and purpose is to nurture young minds to grow in knowledge,
                            character, and faith, guided by Islamic values, while providing a strong and balanced
                            academic education.
                        </p>
                        <p className="mb-4">
                            The school offers Idaad studies as well as Uganda National Curriculum programs leading
                            to UCE and UACE. Kawempe Muslim is a warm and welcoming community that provides many
                            opportunities for academic excellence, leadership, teamwork, and spiritual growth.
                        </p>
                        <p>
                            In return, the school is enriched by the talents, dedication, and positive contributions
                            of its students to the wider community.
                        </p>
                    </div>

                    {/* At A Glance Section */}
                    <div className="mt-12 bg-[#D1D5DB] p-8 rounded-lg text-center">
                        <h3 className="text-xl font-normal uppercase mb-8 tracking-wide text-slate-900 border-b border-slate-400/30 pb-4 inline-block px-10">AT A GLANCE</h3>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {[
                                { label: '2008 Students', icon: null },
                                { label: '200 teachers', icon: null },
                                { label: '123 Support staff', icon: null },
                                { label: '134 classrooms', icon: null },
                                { label: 'Teacher-Student ratio', icon: null },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center gap-3 group">
                                    <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                                        {/* Placeholder for icons as per image style, usually icons would go here */}
                                        <div className="w-full h-full rounded-full border-2 border-transparent group-hover:border-[#006400]/10 transition-colors" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-900 capitalize leading-tight max-w-[100px]">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Side Navigation - Right */}
            <div className="w-full lg:w-[350px] bg-[#F7F23E] flex-shrink-0">
                <div className="bg-[#E6E125] px-8 py-6">
                    <h3 className="text-lg font-normal text-slate-900 capitalize">In this section</h3>
                </div>
                <ul className="py-2">
                    {navItems.map((item, index) => (
                        <li key={index}>
                            <Link
                                href={item.href}
                                className="block px-8 py-3.5 text-slate-900 hover:bg-[#E6E125]/50 transition-colors text-[15px] font-normal"
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AboutInfo;
