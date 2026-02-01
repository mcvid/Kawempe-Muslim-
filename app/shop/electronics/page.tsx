"use client";

import React from 'react';
import StoreLayout from '@/app/components/shop/StoreLayout';
import { Monitor } from 'lucide-react';

export default function ElectronicsPage() {
    return (
        <StoreLayout activeCategory="Electronics">
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400">
                    <Monitor size={40} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Electronics Section</h1>
                    <p className="text-slate-500 max-w-xs mt-2">Computing and electronic devices for students will be available here soon.</p>
                </div>
            </div>
        </StoreLayout>
    );
}
