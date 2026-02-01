"use client";
import React from 'react';

import Image from 'next/image';

export const AcademicCard = ({ title, imgSrc }: { title: string, imgSrc: string }) => (
    <div className="relative bg-[#F3F4F6] p-8 rounded-[2.5rem] min-h-[280px] overflow-hidden group hover:shadow-lg transition-all duration-300">
        <h3 className="text-2xl md:text-3xl font-bold w-full md:w-2/3 leading-tight text-gray-900 relative z-10">{title}</h3>
        <div className="absolute bottom-4 right-4 w-32 h-32 md:w-40 md:h-40 transition-transform duration-500 group-hover:scale-110">
            <Image
                src={imgSrc}
                className="object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                alt="Achievement icon"
                fill
                onError={(e) => {
                    // Fallback handled by parent or alternative mechanism, typical onError doesn't work same way on next/image 
                    // For now keeping simple, ideally use a state for error handling if needed
                }}
            />
        </div>
    </div>
);
