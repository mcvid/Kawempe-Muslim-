"use client";

import React from 'react';
import StoreLayout from '@/app/components/shop/StoreLayout';
import { useCart } from '@/app/lib/CartContext';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
    const { items, updateQuantity, removeFromCart, clearCart, totalAmount, itemCount } = useCart();

    return (
        <StoreLayout activeCategory="Cart" hideSidebar={true}>
            <div className="max-w-3xl mx-auto pb-20 pt-8">
                <div className="flex items-center justify-between mb-10">
                    <h4 className="text-3xl font-barlow font-bold text-slate-900 tracking-tight uppercase">Your Cart</h4>
                    <button onClick={clearCart} className="text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-widest transition-colors flex items-center gap-1">
                        <Trash2 size={12} /> Clear Cart
                    </button>
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-24 space-y-6">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300 mb-6">
                            <ShoppingBag size={32} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold text-slate-900 font-barlow uppercase tracking-wide">Cart is Empty</h2>
                            <p className="text-slate-500 text-sm">You haven't added any items yet.</p>
                        </div>
                        <div className="pt-4">
                            <Link
                                href="/shop/uniforms"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-slate-800 transition-all"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Items List */}
                        <div className="space-y-8">
                            {items.map((item) => (
                                <div key={item.id} className="flex items-center gap-6">
                                    <div className="w-24 h-24 bg-[#F8F9FA] rounded-2xl flex-shrink-0 flex items-center justify-center p-2 overflow-hidden">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                        ) : (
                                            <ShoppingBag size={24} className="text-slate-300" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0 py-2">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-slate-900 text-lg font-barlow uppercase leading-tight group-hover:text-green-700 transition-colors">{item.name}</h3>
                                            <p className="font-bold text-green-700">Shs {(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                        <p className="text-slate-400 text-sm font-medium mb-4">Shs {item.price.toLocaleString()} each</p>

                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center bg-[#F8F9FA] rounded-full px-1 py-1">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all text-slate-600"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-8 text-center font-bold text-sm text-slate-900">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all text-slate-600"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-slate-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Totals & Checkout */}
                        <div className="border-t border-slate-100 pt-8">
                            <div className="flex justify-between items-end mb-8">
                                <div className="text-slate-500 text-sm font-medium">
                                    <p>Total ({itemCount} items)</p>
                                    <p className="text-xs mt-1">Free collection from school</p>
                                </div>
                                <div className="text-3xl font-black text-green-700 font-barlow tracking-tight">
                                    Shs {totalAmount.toLocaleString()}
                                </div>
                            </div>

                            <Link
                                href="/shop/checkout"
                                className="block w-full bg-amber-400 text-slate-900 text-center py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-amber-500 transition-all shadow-sm hover:shadow-md"
                            >
                                Checkout
                            </Link>

                            <Link href="/shop/uniforms" className="block text-center text-xs font-bold text-amber-500 uppercase tracking-widest mt-6 hover:text-amber-600 transition-colors">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}
