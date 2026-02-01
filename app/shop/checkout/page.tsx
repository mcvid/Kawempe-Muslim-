"use client";

import React, { useState } from 'react';
import StoreLayout from '@/app/components/shop/StoreLayout';
import { useCart } from '@/app/lib/CartContext';
import { supabase } from '@/app/lib/supabase';
import { CheckCircle2, ChevronLeft, CreditCard, Loader2, FileText } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
    const { items, totalAmount, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [placedOrder, setPlacedOrder] = useState<{ order: any, items: any[] } | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });

    // Load saved details on mount
    React.useEffect(() => {
        const savedDetails = localStorage.getItem('customerDetails');
        if (savedDetails) {
            try {
                const parsed = JSON.parse(savedDetails);
                setFormData(parsed);
            } catch (e) {
                console.error("Failed to parse saved customer details");
            }
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Create the order
            const { data: order, error: orderError } = await supabase
                .from('shop_orders')
                .insert({
                    customer_name: formData.name,
                    customer_email: formData.email,
                    customer_phone: formData.phone,
                    total_amount: totalAmount,
                    status: 'pending',
                    payment_status: 'unpaid'
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Create order items
            const orderItemsData = items.map(item => ({
                order_id: order.id,
                product_id: item.id,
                quantity: item.quantity,
                price_at_time: item.price
            }));

            const { error: itemsError } = await supabase
                .from('shop_order_items')
                .insert(orderItemsData);

            if (itemsError) throw itemsError;

            // 3. Success
            // Save details for next time
            localStorage.setItem('customerDetails', JSON.stringify(formData));

            setPlacedOrder({ order, items: [...items] });
            setIsSuccess(true);
            clearCart();
        } catch (err) {
            console.error("Order failed:", err);
            alert("Order failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const [viewReceipt, setViewReceipt] = useState(false);

    if (isSuccess && placedOrder) {
        return (
            <StoreLayout activeCategory="Checkout">
                <div className="max-w-2xl mx-auto py-12 space-y-8 no-print">
                    <div className="text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                <CheckCircle2 size={40} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-3xl font-barlow font-bold text-slate-900 uppercase">Order Confirmed</h4>
                            <p className="text-slate-500">Your order has been placed successfully. Order ID: <span className="font-mono text-xs font-bold text-slate-900">{placedOrder.order.id.slice(0, 8)}</span></p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <button
                                onClick={() => setViewReceipt(true)}
                                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-amber-400 text-slate-900 rounded-xl font-bold shadow-sm hover:bg-amber-500 transition-all uppercase tracking-widest text-sm"
                            >
                                <FileText size={18} /> View & Print Receipt
                            </button>
                            <Link
                                href="/shop/uniforms"
                                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-sm hover:bg-slate-800 transition-all uppercase tracking-widest text-sm"
                            >
                                Return to Shop
                            </Link>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                        <p className="text-xs text-slate-400 text-center uppercase tracking-widest font-bold mb-6">Order Summary</p>
                        <div className="space-y-4">
                            {placedOrder.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600 font-medium">{item.quantity}x {item.name}</span>
                                    <span className="text-slate-900 font-bold">Shs {(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                            <div className="h-px bg-slate-200 my-4" />
                            <div className="flex justify-between items-center">
                                <span className="text-slate-900 font-bold uppercase tracking-tight">Total Paid</span>
                                <span className="text-2xl font-black text-green-700 font-barlow">Shs {placedOrder.order.total_amount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Receipt Modal */}
                {viewReceipt && (
                    <div className="fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white print:fixed print:inset-0 animate-in fade-in duration-200">
                        {/* Modal Content */}
                        <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl print:shadow-none print:w-full print:max-w-none print:max-h-none print:rounded-none relative flex flex-col">

                            {/* Actions Header (No Print) */}
                            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md p-4 border-b border-slate-100 flex justify-between items-center print:hidden">
                                <h3 className="font-bold text-slate-900 uppercase tracking-widest text-sm">Receipt Preview</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => window.print()}
                                        className="bg-[#006400] text-white px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#005000] transition-colors flex items-center gap-2"
                                    >
                                        <FileText size={16} /> Print
                                    </button>
                                    <button
                                        onClick={() => setViewReceipt(false)}
                                        className="bg-slate-100 text-slate-500 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>

                            {/* Actual Receipt Content (Printable) */}
                            <div className="p-12 print:p-0 space-y-10">
                                {/* Header */}
                                <div className="text-center space-y-4 border-b-2 border-slate-100 pb-8">
                                    <div className="flex justify-center mb-4">
                                        <img src="/logo.png" alt="School Badge" className="w-24 h-24 object-contain" />
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-3xl font-black text-slate-900 font-barlow uppercase tracking-tight">Kawempe Muslim SS</h1>
                                        <p className="text-amber-500 font-bold uppercase tracking-[0.3em] text-xs">Go Higher</p>
                                    </div>
                                    <div className="pt-4 flex justify-between items-end text-left">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase text-slate-400">Order ID</p>
                                            <p className="font-mono text-sm font-bold text-slate-900">{placedOrder.order.id}</p>
                                        </div>
                                        <div className="text-right space-y-1">
                                            <p className="text-[10px] font-black uppercase text-slate-400">Date & Time</p>
                                            <p className="text-sm font-bold text-slate-900">{new Date(placedOrder.order.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div className="bg-[#F8F9FA] rounded-2xl p-6 grid grid-cols-2 gap-8 border border-slate-100">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase text-slate-400">Customer Name</p>
                                        <p className="font-bold text-slate-900">{placedOrder.order.customer_name}</p>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="text-[10px] font-black uppercase text-slate-400">Contact</p>
                                        <p className="font-bold text-slate-900">{placedOrder.order.customer_phone || placedOrder.order.customer_email}</p>
                                    </div>
                                </div>

                                {/* Items Table */}
                                <div className="space-y-4">
                                    <div className="flex items-center text-[10px] font-black uppercase text-slate-400 px-4">
                                        <span className="flex-1">Description</span>
                                        <span className="w-20 text-center">Qty</span>
                                        <span className="w-32 text-right">Cost</span>
                                    </div>
                                    <div className="space-y-2">
                                        {placedOrder.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center p-4 bg-white border border-slate-100 rounded-xl">
                                                <span className="flex-1 font-bold text-slate-900 text-sm">{item.name}</span>
                                                <span className="w-20 text-center font-medium text-slate-600">{item.quantity}</span>
                                                <span className="w-32 text-right font-black text-slate-900">Shs {(item.price * item.quantity).toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="pt-8 border-t-2 border-slate-100">
                                    <div className="flex justify-between items-center mb-8">
                                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total Cost</p>
                                        <p className="text-4xl font-black text-green-700 font-barlow tracking-tight">Shs {placedOrder.order.total_amount.toLocaleString()}</p>
                                    </div>

                                    <div className="bg-green-50 rounded-2xl p-6 text-center">
                                        <p className="text-green-700 font-medium text-sm">Please present this receipt to the Treasurer's Office for collection.</p>
                                        <p className="text-[10px] text-green-600/50 uppercase tracking-widest font-black mt-2">Verified Digital Receipt</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <style jsx global>{`
                    @media print {
                        body > *:not(.print\\:block) {
                            display: none !important;
                        }
                        .print\\:block {
                            display: flex !important;
                            visibility: visible !important;
                        }
                        .print\\:hidden {
                            display: none !important;
                        }
                        .no-print {
                            display: none !important;
                        }
                    }
                `}</style>
            </StoreLayout>
        );
    }

    return (
        <StoreLayout activeCategory="Checkout" hideSidebar={true}>
            <div className="max-w-4xl mx-auto space-y-10 pb-20 pt-4">
                <Link href="/shop/cart" className="flex items-center gap-2 text-slate-500 hover:text-green-600 transition-colors font-medium">
                    <ChevronLeft size={20} /> Back to Cart
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Form Section */}
                    <div className="space-y-10">
                        <h4 className="text-3xl font-barlow font-bold text-slate-900 uppercase tracking-tight">Checkout Details</h4>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-amber-500 px-1">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. John Doe"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-[#F8F8F8] border-none rounded-2xl py-4 px-6 text-slate-900 focus:ring-2 focus:ring-green-600/20 outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-amber-500 px-1">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-[#F8F8F8] border-none rounded-2xl py-4 px-6 text-slate-900 focus:ring-2 focus:ring-green-600/20 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-amber-500 px-1">Phone Number</label>
                                    <input
                                        required
                                        type="tel"
                                        placeholder="+256..."
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-[#F8F9FA] border-none rounded-2xl py-4 px-6 text-slate-900 focus:ring-2 focus:ring-green-600/20 outline-none transition-all font-medium placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            <div className="pt-6">
                                <button
                                    disabled={loading || items.length === 0}
                                    type="submit"
                                    className="w-full py-4 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-xl transition-colors flex items-center justify-center gap-3 disabled:opacity-50 shadow-sm uppercase tracking-widest text-sm"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : <CreditCard size={20} />}
                                    {loading ? 'Processing Order...' : `Place Order (Shs ${totalAmount.toLocaleString()})`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
