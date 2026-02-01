import React from 'react';
import Image from 'next/image';

const timelineEvents = [
    {
        title: "FOUNDING",
        description: "Kawempe Muslim Secondary School traces its roots to the outstanding academic performance of Kawempe Muslim Primary School. The success of the primary section inspired the creation of a secondary school to continue nurturing academic excellence within a strong Islamic foundation.",
        image: "/c1.jpg",
        side: "left"
    },
    {
        title: "Establishment",
        description: "Established in 1984, Kawempe Muslim Secondary School was founded as a government-owned institution with strong Islamic origins. From the beginning, the school was committed to providing quality education grounded in Islamic values, discipline, and moral integrity.",
        image: "/c2.jpg",
        side: "right"
    },
    {
        title: "The 21st Century",
        description: "Entering the 21st century, Kawempe Muslim Secondary School experienced remarkable growth under visionary leadership, including leaders such as Hajji Bruhane Mugerwa. During this period, the school expanded its academic offerings to include advanced science programs and Islamic theology, further enhancing its national reputation.",
        image: "/c3.jpg",
        side: "left"
    },
    {
        title: "Campus Expansion",
        description: "As enrollment increased, the school invested heavily in infrastructure development. New classrooms, laboratories, dormitories, and sports facilities were added, supporting both academic excellence and co-curricular activities.",
        image: "/c4.jpg",
        side: "right"
    },
    {
        title: "Best Muslim Secondary School",
        description: "Today, Kawempe Muslim Secondary School is widely recognized as one of the leading Muslim secondary schools in Uganda. It consistently ranks among top performers in UCE and UACE, is renowned for its strong Islamic values, and has gained national acclaim for its elite girls' football team. Guided by the motto \"Go Higher,\" the school continues to produce well-rounded, versatile individuals prepared for leadership and service.",
        image: "/c5.jpg",
        side: "left"
    }
];

const Timeline = () => {
    return (
        <section className="py-20 bg-slate-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative">
                {/* Central Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-green-600/30 -translate-x-1/2 hidden md:block" />

                <div className="space-y-24 md:space-y-40 relative">
                    {timelineEvents.map((event, index) => (
                        <div key={index} className={`flex flex-col md:flex-row items-center gap-12 ${event.side === 'right' ? 'md:flex-row-reverse' : ''}`}>

                            {/* Content Side */}
                            <div className={`flex-1 w-full ${event.side === 'left' ? 'md:text-right' : 'md:text-left'}`}>
                                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 font-[var(--font-barlow)] uppercase">
                                    {event.title}
                                </h3>
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    {event.description}
                                </p>
                            </div>

                            {/* Dot in Center */}
                            <div className="relative z-10 hidden md:block">
                                <div className="w-12 h-12 bg-white border-4 border-indigo-700 rounded-full flex items-center justify-center p-2 shadow-lg">
                                    <div className="w-full h-full bg-indigo-700 rounded-full" />
                                </div>
                            </div>

                            {/* Image Side */}
                            <div className="flex-1 w-full">
                                <div className={`relative aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border-8 border-white ${event.side === 'left' ? 'md:-rotate-2' : 'md:rotate-2'} transition-transform hover:rotate-0 duration-500`}>
                                    <Image
                                        src={event.image}
                                        alt={event.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-indigo-900/10" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Timeline;
