"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Search, Filter, ShoppingCart, ChevronDown, Menu, X, Home } from 'lucide-react';
import { useCart } from '@/app/lib/CartContext';

interface StoreLayoutProps {
    children: React.ReactNode;
    activeCategory: string;
    hideSidebar?: boolean;
}

const CATEGORIES = [
    { name: 'Uniforms', href: '/shop/uniforms' },
    { name: 'Academics', href: '/shop/academics' },
    { name: 'Dormitory', href: '/shop/dormitory' },
    { name: 'Electronics', href: '/shop/electronics' },
];

function StoreContent({ children, activeCategory, hideSidebar = false }: StoreLayoutProps) {
    const { itemCount } = useCart();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile/Hamburger Menu
    const [isFilterOpen, setIsFilterOpen] = useState(false); // Collapsible Filter Section
    const [isApparelOpen, setIsApparelOpen] = useState(false); // Dropdown for Apparel

    // URL Params for Filtering
    const currentLevel = searchParams.get('level') || 'all'; // 'O-Level', 'A-Level', 'all'

    const handleLevelChange = (level: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (level === 'all') params.delete('level');
        else params.set('level', level);
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Navigation Drawer */}
            <div className={`fixed inset-0 z-[100] transition-all duration-500 ${isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsMenuOpen(false)}
                />

                {/* Drawer */}
                <div className={`absolute top-0 right-0 h-full w-80 bg-white shadow-2xl transition-transform duration-500 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} p-8 flex flex-col`}>
                    <div className="flex justify-end mb-8">
                        <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                            <Home size={24} className="hidden" /> {/* Hidden Icon import fix hack if needed */}
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="space-y-6 flex-1">
                        <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-xl font-bold text-slate-900 hover:text-green-600 transition-colors">
                            <span className="text-green-600">←</span> Back to Home
                        </Link>
                        <div className="h-px bg-slate-100 my-4" />
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Shop Categories</h3>
                        {CATEGORIES.map(cat => (
                            <Link
                                key={cat.name}
                                href={cat.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={`block text-lg font-medium transition-colors ${activeCategory === cat.name ? 'text-green-600 pl-2 border-l-2 border-green-600' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                {cat.name}
                            </Link>
                        ))}
                        <div className="h-px bg-slate-100 my-4" />
                        <Link href="/shop/cart" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between text-lg font-medium text-slate-600 hover:text-slate-900">
                            <span>My Cart</span>
                            <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{itemCount}</span>
                        </Link>
                    </nav>
                </div>
            </div>

            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 py-3 transition-all">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    {/* Search Bar */}
                    <div className="flex-1 max-w-xl relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#F5F5F5] border-none rounded-2xl py-2.5 pl-11 pr-4 text-slate-800 text-sm font-medium focus:ring-2 focus:ring-green-600/10 focus:bg-white transition-all outline-none placeholder:text-slate-400"
                        />
                    </div>

                    {/* Cart & Actions */}
                    <div className="flex items-center gap-4">
                        {!hideSidebar && (
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={`flex items-center gap-2 transition-colors ${isFilterOpen ? 'text-green-600' : 'text-slate-500 hover:text-slate-800'}`}
                            >
                                <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">Filters</span>
                                <Filter size={18} />
                            </button>
                        )}

                        <div className="w-px h-6 bg-slate-200 mx-2" />

                        <Link href="/shop/cart" className="relative p-2 text-slate-700 hover:text-green-600 transition-colors group">
                            <ShoppingCart size={22} />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white group-hover:scale-110 transition-transform">
                                    {itemCount}
                                </span>
                            )}
                        </Link>

                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="p-2 text-slate-700 hover:text-green-600 transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </div>

            <div className={`max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8 ${hideSidebar ? 'justify-center' : ''}`}>
                {/* Sidebar Filters - Conditionally Hidden */}
                {!hideSidebar && (
                    <aside className="lg:w-64 flex-shrink-0 space-y-6">
                        {/* Level Filter (Radio) */}
                        <div className="bg-white border border-slate-100 p-5 rounded-[24px] space-y-4">
                            <h4 className="text-sm font-barlow font-bold text-slate-400 uppercase tracking-widest">Level</h4>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${currentLevel === 'all' ? 'border-green-600' : 'border-slate-300 group-hover:border-green-400'}`}>
                                        {currentLevel === 'all' && <div className="w-2 h-2 rounded-full bg-green-600" />}
                                    </div>
                                    <input type="radio" name="level" className="hidden" onChange={() => handleLevelChange('all')} checked={currentLevel === 'all'} />
                                    <span className={`text-sm font-medium ${currentLevel === 'all' ? 'text-slate-900' : 'text-slate-500'}`}>All Levels</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${currentLevel === 'O-Level' ? 'border-green-600' : 'border-slate-300 group-hover:border-green-400'}`}>
                                        {currentLevel === 'O-Level' && <div className="w-2 h-2 rounded-full bg-green-600" />}
                                    </div>
                                    <input type="radio" name="level" className="hidden" onChange={() => handleLevelChange('O-Level')} checked={currentLevel === 'O-Level'} />
                                    <span className={`text-sm font-medium ${currentLevel === 'O-Level' ? 'text-slate-900' : 'text-slate-500'}`}>O-Level</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${currentLevel === 'A-Level' ? 'border-green-600' : 'border-slate-300 group-hover:border-green-400'}`}>
                                        {currentLevel === 'A-Level' && <div className="w-2 h-2 rounded-full bg-green-600" />}
                                    </div>
                                    <input type="radio" name="level" className="hidden" onChange={() => handleLevelChange('A-Level')} checked={currentLevel === 'A-Level'} />
                                    <span className={`text-sm font-medium ${currentLevel === 'A-Level' ? 'text-slate-900' : 'text-slate-500'}`}>Advanced Level</span>
                                </label>
                            </div>
                        </div>

                        {/* Collapsible Filter Dropdown */}
                        {isFilterOpen && (
                            <div className="bg-[#1A1A1A] p-6 rounded-[24px] text-white space-y-6 animate-in slide-in-from-top-4 duration-300">
                                <h4 className="text-lg font-barlow font-bold uppercase tracking-wide">Detailed Filters</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between opacity-50 cursor-not-allowed">
                                        <span className="text-sm text-slate-300">Sex</span>
                                        <ChevronDown size={14} />
                                    </div>
                                    {/* Placeholders as requested */}
                                    {['Age', 'Weight', 'Height', 'House'].map(f => (
                                        <div key={f} className="flex items-center justify-between opacity-50">
                                            <span className="text-sm text-slate-300">{f}</span>
                                            <div className="bg-white/10 w-12 h-6 rounded-full" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Apparel Dropdown */}
                        <div className="space-y-2">
                            <button
                                onClick={() => setIsApparelOpen(!isApparelOpen)}
                                className="w-full flex items-center justify-between bg-white border border-slate-100 p-4 rounded-2xl hover:border-green-600/30 transition-all group"
                            >
                                <h4 className="font-barlow font-bold text-slate-900 uppercase tracking-wide">Apparel</h4>
                                <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 group-hover:text-green-600 ${isApparelOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Expanded Menu */}
                            <div className={`overflow-hidden transition-all duration-300 ${isApparelOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="bg-[#F8F9FA] p-2 rounded-[24px] space-y-1 mt-2">
                                    {CATEGORIES.map((cat) => (
                                        <Link
                                            key={cat.name}
                                            href={cat.href}
                                            className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeCategory === cat.name ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'}`}
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>
                )}

                {/* Main Content Area */}
                <main className={`flex-1 ${hideSidebar ? 'max-w-4xl w-full' : ''}`}>
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function StoreLayout(props: StoreLayoutProps) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <StoreContent {...props} />
        </Suspense>
    );
}
