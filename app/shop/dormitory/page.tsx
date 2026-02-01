"use client";

import React from 'react';
import StoreLayout from '@/app/components/shop/StoreLayout';
import { Bed } from 'lucide-react';

export default function DormitoryPage() {
    return (
        <StoreLayout activeCategory="Dormitory">
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400">
                    <Bed size={40} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dormitory Essentials</h1>
                    <p className="text-slate-500 max-w-xs mt-2">Mattresses, trunks, and other boarding requirements will be available here soon.</p>
                </div>
            </div>
        </StoreLayout>
    );
}
