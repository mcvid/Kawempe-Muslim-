"use client";

import React from 'react';
import Footer from '../../../../components/Footer';
import LibraryNavBar from '../../../../components/LibraryNavBar';
import { Book, Download, FileText } from 'lucide-react';

const resources = [
    { id: 4, title: "UCE Mathematics Revision", type: "Revision", category: "uce", size: "3.2 MB" },
    { id: 8, title: "Geography Map Work", type: "Guide", category: "uce", size: "6.7 MB" },
];

export default function UCEPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans pt-10">
            <h1 className="sr-only">UCE Resources</h1>
            <LibraryNavBar />

            <div className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map((resource) => (
                        <div key={resource.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
                                    <Book size={24} />
                                </div>
                                <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-600 rounded-full uppercase tracking-wider">
                                    {resource.type}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">{resource.title}</h3>
                            <div className="flex items-center justify-between mt-6 text-sm text-slate-500">
                                <span className="flex items-center gap-2">
                                    <FileText size={16} /> {resource.size}
                                </span>
                                <button className="flex items-center gap-2 text-green-600 font-semibold hover:underline">
                                    Download <Download size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}
