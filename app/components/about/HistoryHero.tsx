import React from 'react';
import Image from 'next/image';

const HistoryHero = ({ title = "Our History" }: { title?: string }) => {
    return (
        <div className="relative h-[50vh] min-h-[400px] w-full bg-slate-900 overflow-hidden">
            <div className="absolute inset-0">
                <Image
                    src="/images/about/history-hero.png"
                    alt="Students laughing together"
                    fill
                    className="object-cover object-top"
                    priority
                />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white font-[var(--font-barlow)] uppercase tracking-wider drop-shadow-lg text-center px-4">
                    {title}
                </h1>
            </div>
        </div>
    );
};

export default HistoryHero;
