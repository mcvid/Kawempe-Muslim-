"use client";
import React from 'react';
import Image from 'next/image';

const WempianSection = () => {
  return (
    <section className="relative bg-[#FAF9F6] p-12 md:p-24 overflow-hidden">
      {/* Decorative SVG Line */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 1000">
        <path d="M 600 50 H 50 V 450 H 250" fill="none" stroke="#2E7D32" strokeWidth="2" />
      </svg>

      <div className="relative z-10 grid grid-cols-12 gap-8 items-start">
        {/* Top Left Image - Image 1 */}
        <div className="col-span-12 md:col-span-5 relative h-[300px] max-w-md mx-auto md:mx-0 w-full">
          <Image
            src="/Wemps Images/IMG-20260113-WA0019.jpg"
            className="rounded-[2.5rem] shadow-lg object-cover"
            alt="Study"
            fill
          />
        </div>

        {/* Top Right Text - Text 1 */}
        <div className="col-span-12 md:col-span-5 md:col-start-8 pt-10 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-serif font-bold uppercase leading-none text-gray-900">
            Get to Know a <br /> Wempian
          </h2>
          <p className="mt-6 text-gray-600 max-w-sm mx-auto md:mx-0">
            Our students come from all walks of life, united by a passion for learning and a drive to excel.
          </p>
        </div>

        {/* Center Overlap Image - Image 2 */}
        <div className="col-span-12 md:col-span-4 md:col-start-4 md:-translate-y-24 z-20 relative h-[300px] md:h-[400px] mt-8 md:mt-0 max-w-md mx-auto md:mx-0 w-full">
          <Image
            src="/Wemps Images/prefect1.jpg"
            className="rounded-[3rem] md:border-[12px] border-[#FAF9F6] shadow-2xl object-cover"
            alt="Student"
            fill
          />
        </div>

        {/* Bottom Left Typography - Text 2 */}
        <div className="col-span-12 md:col-span-5 md:row-start-3 self-end mt-12 md:mt-0 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-serif font-bold uppercase text-green-800">We Are Driven</h1>
          <p className="text-xl font-serif font-semibold uppercase mt-2 text-gray-800">Beyond Motivation</p>
        </div>

        {/* Bottom Right Image - Image 3 */}
        <div className="col-span-12 md:col-span-5 md:col-start-8 md:row-start-2 md:row-span-2 self-end relative h-[300px] md:h-[350px] mt-8 md:mt-0 max-w-md mx-auto md:mx-0 w-full">
          <Image
            src="/Wemps Images/IMG-20260113-WA0018.jpg"
            className="rounded-[2.5rem] shadow-lg object-cover"
            alt="Legacy"
            fill
          />
        </div>
      </div>
    </section>
  );
};

export default WempianSection;
