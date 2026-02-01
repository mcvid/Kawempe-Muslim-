"use client";

import React, { useEffect, useState } from 'react';
import StoreLayout from '@/app/components/shop/StoreLayout';
import { supabase } from '@/app/lib/supabase';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/app/lib/CartContext';

interface Product {
    id: string;
    name: string;
    price: number;
    image_url: string;
    sub_category: string;
}

const PREMADE_BUNDLES = [
    { id: 'b1', name: 'Technical drawing', color: 'bg-[#2D5A5A]' },
    { id: 'b2', name: 'Art student', color: 'bg-[#FDF6E3]' },
    { id: 'b3', name: 'Everything', color: 'bg-white' },
    { id: 'b4', name: 'All necessities', color: 'bg-[#E5E5E5]' },
];

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export default function AcademicsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentBundle = searchParams.get('bundle');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const { data } = await supabase
                .from('shop_products')
                .select('*')
                .eq('category', 'academics')
                .order('name');

            if (data) {
                let filtered = data;
                if (currentBundle === 'tech') {
                    filtered = data.filter(p => p.name.toLowerCase().includes('drawing') || p.name.toLowerCase().includes('technical') || p.name.toLowerCase().includes('set'));
                } else if (currentBundle === 'art') {
                    filtered = data.filter(p => p.name.toLowerCase().includes('art') || p.name.toLowerCase().includes('paint') || p.name.toLowerCase().includes('brush'));
                } else if (currentBundle === 'necessities') {
                    filtered = data.filter(p => p.sub_category === 'Stationery' || p.price < 50000);
                }
                setProducts(filtered);
            }
            setLoading(false);
        };
        fetchProducts();
    }, [currentBundle]);

    const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({});

    const handleAddToCart = (e: React.MouseEvent, product: Product) => {
        e.stopPropagation();
        addToCart({ id: product.id, name: product.name, price: product.price, image_url: product.image_url });

        setAddedItems(prev => ({ ...prev, [product.id]: true }));
        setTimeout(() => {
            setAddedItems(prev => ({ ...prev, [product.id]: false }));
        }, 2000);
    };

    const handleBundleClick = (bundleName: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (bundleName === 'Technical drawing') params.set('bundle', 'tech');
        else if (bundleName === 'Art student') params.set('bundle', 'art');
        else if (bundleName === 'All necessities') params.set('bundle', 'necessities');
        else params.delete('bundle'); // 'Everything'

        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <StoreLayout activeCategory="Academics">
            <div className="space-y-12 pb-20">
                {/* Premade Combinations Section - Moved to Top */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h4 className="text-3xl font-barlow font-bold text-slate-900 uppercase tracking-tight">Academics & Stationery</h4>
                        {currentBundle && (
                            <button onClick={() => handleBundleClick('Everything')} className="text-sm font-bold text-amber-500 hover:underline">
                                Clear Filter
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {PREMADE_BUNDLES.map((bundle) => (
                            <div key={bundle.id} onClick={() => handleBundleClick(bundle.name)} className="space-y-4 cursor-pointer group">
                                <div className={`${bundle.color} aspect-square rounded-[32px] border border-slate-100 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md flex items-center justify-center overflow-hidden relative`}>
                                    {/* Active Indicator */}
                                    {((bundle.name === 'Technical drawing' && currentBundle === 'tech') ||
                                        (bundle.name === 'Art student' && currentBundle === 'art') ||
                                        (bundle.name === 'All necessities' && currentBundle === 'necessities') ||
                                        (bundle.name === 'Everything' && !currentBundle)) && (
                                            <div className="absolute top-4 right-4 w-3 h-3 bg-green-600 rounded-full animate-pulse" />
                                        )}

                                    {bundle.name === 'Technical drawing' && (
                                        <div className="text-white text-center p-4 font-bold text-lg uppercase leading-tight">
                                            Technology<br />& Design
                                        </div>
                                    )}
                                    {bundle.name === 'Art student' && (
                                        <div className="text-center p-4">
                                            <div className="text-[#EA4335] font-serif italic text-3xl">art</div>
                                            <div className="text-[#34A853] font-sans font-bold text-2xl -mt-2">design</div>
                                        </div>
                                    )}
                                    {bundle.name === 'Everything' && (
                                        <div className="text-slate-900/20 font-black text-4xl uppercase tracking-widest rotate-[-15deg]">ALL</div>
                                    )}
                                    {bundle.name === 'All necessities' && (
                                        <div className="text-slate-400 font-bold text-xl uppercase tracking-tighter">Essentials</div>
                                    )}
                                </div>
                                <div className="text-center">
                                    <p className={`text-sm font-medium transition-colors ${((bundle.name === 'Technical drawing' && currentBundle === 'tech') || (bundle.name === 'Art student' && currentBundle === 'art') || (bundle.name === 'All necessities' && currentBundle === 'necessities') || (bundle.name === 'Everything' && !currentBundle)) ? 'text-green-700 font-bold' : 'text-slate-700'}`}>
                                        {bundle.name}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="h-px bg-slate-100 w-full" />

                {/* Stationery Grid */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xl font-barlow font-bold text-slate-900 uppercase tracking-tight">
                            {currentBundle === 'tech' ? 'Technical Drawing Set' :
                                currentBundle === 'art' ? 'Art Materials' :
                                    currentBundle === 'necessities' ? 'School Essentials' : 'All Products'}
                        </h4>
                        <p className="text-sm text-slate-500 font-medium">{products.length} Items</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {loading ? (
                            [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="animate-pulse space-y-3">
                                    <div className="aspect-square bg-slate-100 rounded-2xl" />
                                    <div className="h-4 bg-slate-100 rounded w-2/3" />
                                </div>
                            ))
                        ) : (
                            products.length > 0 ? (
                                products.map((product) => (
                                    <div key={product.id} className="group relative flex flex-col items-center">
                                        <div className="aspect-square w-full flex items-center justify-center p-4 bg-[#F8F9FA] rounded-[32px] mb-4 overflow-hidden relative group-hover:bg-[#F0F2F5] transition-colors">
                                            <div className="absolute top-4 right-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest">{product.sub_category}</div>
                                            {product.image_url ? (
                                                <img src={product.image_url} alt={product.name} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <ShoppingCart className="text-slate-200" size={48} />
                                            )}

                                            <button
                                                onClick={(e) => handleAddToCart(e, product)}
                                                className={`absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 ${addedItems[product.id] ? 'bg-green-600 text-white opacity-100 translate-y-0 scale-110' : 'bg-white text-slate-900 hover:bg-amber-400 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0'}`}
                                            >
                                                {addedItems[product.id] ? <Check size={18} /> : <ShoppingCart size={18} />}
                                            </button>
                                        </div>
                                        <div className="w-full text-center">
                                            <p className="text-sm font-bold text-slate-900 truncate w-full">{product.name}</p>
                                            <p className="text-xs font-medium text-slate-500 mt-1">Shs {product.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center text-slate-400">
                                    <p>No products found in this collection.</p>
                                    <button onClick={() => handleBundleClick('Everything')} className="text-green-600 font-bold mt-2 text-sm">View All Products</button>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
