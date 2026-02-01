"use client";

import React, { useEffect, useState } from 'react';
import StoreLayout from '@/app/components/shop/StoreLayout';
import { supabase } from '@/app/lib/supabase';
import { Plus, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '@/app/lib/CartContext';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    sub_category: string;
}

import { useSearchParams } from 'next/navigation';

export default function UniformsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const searchParams = useSearchParams();
    const currentLevel = searchParams.get('level') || 'all';

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            let query = supabase
                .from('shop_products')
                .select('*')
                .eq('category', 'uniforms')
                .order('name');

            if (currentLevel !== 'all') {
                // If level is selected, filter by it. 
                // We assume 'sub_category' holds 'O-Level', 'A-Level' or 'Both'
                // Or we can use ilike for partial matching if schema is loose
                query = query.in('sub_category', [currentLevel, 'Both']);
            }

            const { data } = await query;
            if (data) setProducts(data);
            setLoading(false);
        };
        fetchProducts();
    }, [currentLevel]);

    const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({});

    const handleAddToCart = (e: React.MouseEvent, product: Product) => {
        e.stopPropagation();
        addToCart({ id: product.id, name: product.name, price: product.price, image_url: product.image_url });

        setAddedItems(prev => ({ ...prev, [product.id]: true }));
        setTimeout(() => {
            setAddedItems(prev => ({ ...prev, [product.id]: false }));
        }, 2000);
    };

    return (
        <StoreLayout activeCategory="Uniforms">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h4 className="text-3xl font-barlow font-bold text-slate-900 uppercase tracking-tight">Uniforms</h4>
                    <p className="text-sm text-slate-500 font-medium">{products.length} Products Found</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        [1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="animate-pulse space-y-4">
                                <div className="aspect-square bg-slate-100 rounded-3xl" />
                                <div className="h-4 bg-slate-100 rounded w-2/3" />
                                <div className="h-4 bg-slate-100 rounded w-1/4" />
                            </div>
                        ))
                    ) : (
                        products.map((product) => (
                            <div key={product.id} className="group cursor-pointer">
                                <div className="relative aspect-[4/5] bg-[#F8F8F8] rounded-[32px] overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/50">
                                    <div className="absolute inset-0 flex items-center justify-center p-8">
                                        <div className="absolute top-4 left-4 text-[10px] font-bold text-slate-400/30 uppercase tracking-widest italic">
                                            Shs {product.price.toLocaleString()}
                                        </div>
                                        <div className="absolute top-6 right-6 w-5 h-5 bg-[#FF6B6B] rounded-sm shadow-sm" />

                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <ShoppingBag size={64} className="text-slate-200" />
                                        )}
                                    </div>

                                    <div className="absolute bottom-6 right-6 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(e, product);
                                            }}
                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${addedItems[product.id] ? 'bg-green-600 text-white scale-110' : 'bg-amber-400 text-slate-900 hover:bg-amber-500'}`}
                                        >
                                            {addedItems[product.id] ? <Check size={24} /> : <Plus size={24} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-5 px-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <h4 className="text-lg font-barlow font-bold text-slate-900 group-hover:text-green-700 transition-colors">
                                            {product.name}
                                        </h4>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            {product.sub_category}
                                        </span>
                                    </div>
                                    <p className="text-lg font-bold text-slate-900 mt-1">Shs {product.price.toLocaleString()}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </StoreLayout>
    );
}
