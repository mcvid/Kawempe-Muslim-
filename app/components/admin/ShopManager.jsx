"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import {
    ShoppingBag,
    Plus,
    Search,
    Edit2,
    Trash2,
    Package,
    X,
    ChevronDown,
    Loader2
} from 'lucide-react';

const CATEGORIES = ['uniforms', 'academics', 'electronics', 'dormitory'];

export default function ShopManager() {
    const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders'
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Edit/Add State
    const [isEditing, setIsEditing] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'uniforms',
        sub_category: '',
        image_url: '',
        stock_quantity: 100
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (activeTab === 'products') fetchProducts();
        else fetchOrders();
    }, [activeTab, selectedCategory]);

    const fetchProducts = async () => {
        setLoading(true);
        let query = supabase
            .from('shop_products')
            .select('*')
            .order('created_at', { ascending: false });

        if (selectedCategory !== 'all') {
            query = query.eq('category', selectedCategory);
        }

        const { data, error } = await query;
        if (data) setProducts(data);
        if (error) console.error(error);
        setLoading(false);
    };

    const fetchOrders = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('shop_orders')
            .select('*, shop_order_items(*, shop_products(name))')
            .order('created_at', { ascending: false });

        if (data) setOrders(data);
        setLoading(false);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `shop/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('school-assets')
            .upload(filePath, file);

        if (uploadError) {
            alert('Error uploading image');
            setUploading(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('school-assets')
            .getPublicUrl(filePath);

        setFormData({ ...formData, image_url: publicUrl });
        setUploading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            price: parseFloat(formData.price),
            stock_quantity: parseInt(formData.stock_quantity)
        };

        let error;
        if (isEditing) {
            const { error: updateError } = await supabase
                .from('shop_products')
                .update(payload)
                .eq('id', isEditing.id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from('shop_products')
                .insert([payload]);
            error = insertError;
        }

        if (error) {
            alert("Failed to save product");
        } else {
            setIsAdding(false);
            setIsEditing(null);
            setFormData({ name: '', description: '', price: '', category: 'uniforms', sub_category: '', image_url: '', stock_quantity: 100 });
            fetchProducts();
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        const { error } = await supabase.from('shop_products').delete().eq('id', id);
        if (!error) fetchProducts();
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 font-sans text-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Shop Manager</h1>
                    <p className="text-slate-500 mt-1 font-medium">Manage school store inventory and orders</p>
                </div>
                <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'products' ? 'bg-[#006400] text-white' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                    >
                        Products
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-[#006400] text-white' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                    >
                        Orders
                    </button>
                </div>
            </div>

            {/* Content */}
            {activeTab === 'products' && (
                <div className="space-y-6">
                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-2xl border border-slate-200">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#F8F9FA] border-none rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-[#006400]/20 font-medium placeholder:text-slate-400"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 items-center">
                            {['all', ...CATEGORIES].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap border transition-colors ${selectedCategory === cat ? 'bg-[#006400] border-[#006400] text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-[#006400] hover:text-[#006400]'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="bg-[#006400] text-white px-5 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#005000] transition-colors"
                        >
                            <Plus size={18} /> Add Product
                        </button>
                    </div>

                    {/* Products List */}
                    {loading ? (
                        <div className="py-20 text-center text-slate-400 flex flex-col items-center">
                            <Loader2 className="animate-spin mb-2" />
                            <span className="font-medium">Loading Products...</span>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="py-20 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                            <ShoppingBag className="mx-auto mb-4 opacity-20" size={48} />
                            <p className="font-medium">No products found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map(product => (
                                <div key={product.id} className="bg-white p-3 rounded-2xl border border-slate-100 hover:border-amber-400/50 transition-all group relative">
                                    <div className="aspect-square bg-slate-50 rounded-xl mb-3 relative overflow-hidden flex items-center justify-center">
                                        {product.image_url ? (
                                            <img src={product.image_url} alt={product.name} className="w-full h-full object-contain mix-blend-multiply p-4" />
                                        ) : (
                                            <Package className="text-slate-200" size={32} />
                                        )}

                                        {/* Actions Overlay */}
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => { setIsEditing(product); setFormData({ ...product, price: product.price.toString(), stock_quantity: product.stock_quantity.toString() }); }}
                                                className="bg-white p-2 rounded-lg border border-slate-100 text-slate-600 hover:text-amber-600 hover:border-amber-200 shadow-sm"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="bg-white p-2 rounded-lg border border-slate-100 text-slate-600 hover:text-red-600 hover:border-red-200 shadow-sm"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="px-1">
                                        <p className="font-medium text-slate-800 truncate text-[15px] leading-tight">{product.name}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <p className="text-[11px] text-slate-400 font-medium capitalize">{product.category}</p>
                                            <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-1 rounded font-bold border border-amber-100">
                                                {product.stock_quantity} left
                                            </span>
                                        </div>
                                        <div className="mt-2 pt-2 border-t border-slate-50">
                                            <span className="font-semibold text-slate-900">Shs {product.price.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'orders' && (
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#F8F9FA] border-b border-slate-100">
                                <tr>
                                    <th className="p-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Order ID</th>
                                    <th className="p-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Customer</th>
                                    <th className="p-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Status</th>
                                    <th className="p-4 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">Amount</th>
                                    <th className="p-4 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {orders.length === 0 ? (
                                    <tr><td colSpan={5} className="p-12 text-center text-slate-400 font-medium">No orders found.</td></tr>
                                ) : orders.map(order => (
                                    <React.Fragment key={order.id}>
                                        <tr
                                            onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                                            className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                                        >
                                            <td className="p-4 font-mono text-xs text-slate-400">#{order.id.slice(0, 8)}</td>
                                            <td className="p-4">
                                                <div className="font-bold text-slate-900">{order.customer_name}</div>
                                                <div className="text-xs text-slate-500 mt-0.5 font-medium">{order.customer_email || order.customer_phone}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${order.status === 'completed' ? 'bg-green-100 text-[#006400]' :
                                                    order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-slate-100 text-slate-500'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right font-bold text-slate-900">Shs {order.total_amount.toLocaleString()}</td>
                                            <td className="p-4 text-right text-slate-500 text-xs font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                    <ChevronDown size={14} className={`transition-transform ${selectedOrder === order.id ? 'rotate-180' : ''}`} />
                                                </div>
                                            </td>
                                        </tr>
                                        {selectedOrder === order.id && (
                                            <tr className="bg-slate-50/50">
                                                <td colSpan={5} className="p-4">
                                                    <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
                                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Order Items</p>
                                                        <div className="space-y-2">
                                                            {order.shop_order_items?.map((item, idx) => (
                                                                <div key={idx} className="flex justify-between items-center bg-[#F8F9FA] p-3 rounded-xl border border-slate-50">
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-600">{item.quantity}</span>
                                                                        <span className="font-bold text-slate-900 text-sm">{item.shop_products?.name || 'Product Deleted'}</span>
                                                                    </div>
                                                                    <span className="font-black text-slate-900 text-sm">Shs {(item.price_at_time * item.quantity).toLocaleString()}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="flex justify-between items-center pt-2 px-2">
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={async (e) => {
                                                                        e.stopPropagation();
                                                                        await supabase.from('shop_orders').update({ payment_status: 'paid', status: 'completed' }).eq('id', order.id);
                                                                        fetchOrders();
                                                                    }}
                                                                    className="text-[10px] font-black uppercase tracking-widest bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 active:scale-95 transition-all"
                                                                >
                                                                    Mark as Paid & Completed
                                                                </button>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-[10px] font-black uppercase text-slate-400">Total Paid</p>
                                                                <p className="text-lg font-black text-[#006400]">Shs {order.total_amount.toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal for Add/Edit */}
            {(isAdding || isEditing) && (
                <div className="fixed inset-0 z-[2000] bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-lg border border-slate-100 shadow-xl overflow-hidden anim-scale-in">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#F8F9FA]">
                            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={() => { setIsAdding(false); setIsEditing(null); }} className="text-slate-400 hover:text-red-500 transition-colors bg-white p-2 rounded-full border border-slate-200 hover:border-red-200"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Product Name</label>
                                <input required className="w-full bg-[#F8F9FA] p-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#006400]/20 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. School Sweater" />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Price (Shs)</label>
                                    <input required type="number" className="w-full bg-[#F8F9FA] p-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#006400]/20 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                        value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="0" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Category</label>
                                    <div className="relative">
                                        <select className="w-full bg-[#F8F9FA] p-4 rounded-2xl border-none outline-none appearance-none cursor-pointer font-bold text-slate-900"
                                            value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-4 text-slate-400 pointer-events-none" size={16} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Level (Sub-Category)</label>
                                <div className="relative">
                                    <select className="w-full bg-[#F8F9FA] p-4 rounded-2xl border-none outline-none appearance-none cursor-pointer font-bold text-slate-900"
                                        value={formData.sub_category} onChange={e => setFormData({ ...formData, sub_category: e.target.value })}>
                                        <option value="">Select Level/Type</option>
                                        <option value="O-Level">O-Level</option>
                                        <option value="A-Level">A-Level</option>
                                        <option value="Both">Both (O & A)</option>
                                        <option value="Stationery">Stationery</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-4 text-slate-400 pointer-events-none" size={16} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Product Image</label>
                                <div className="flex items-center gap-4 bg-[#F8F9FA] p-3 rounded-2xl border border-dashed border-slate-200">
                                    {formData.image_url ? (
                                        <img src={formData.image_url} alt="Preview" className="w-16 h-16 rounded-xl object-contain bg-white border border-slate-100 p-1" />
                                    ) : (
                                        <div className="w-16 h-16 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300">
                                            <Package size={24} />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-wider file:bg-white file:text-slate-700 hover:file:bg-[#006400] hover:file:text-white transition-colors cursor-pointer" />
                                        {uploading && <p className="text-[10px] text-[#006400] font-bold mt-2 animate-pulse">Uploading image...</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => { setIsAdding(false); setIsEditing(null); }} className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-colors text-xs uppercase tracking-widest">Cancel</button>
                                <button type="submit" disabled={uploading} className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors text-xs uppercase tracking-widest shadow-none">
                                    {isEditing ? 'Save Changes' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
