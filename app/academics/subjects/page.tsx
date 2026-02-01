import React from 'react';

export default function SubjectsPage() {
    return (
        <main className="min-h-screen bg-white pt-24 lg:pt-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                    Our Subjects
                </h1>
                <p className="text-lg text-gray-600 mb-12">
                    Explore our comprehensive curriculum covering Sciences, Humanities, and Vocational subjects.
                </p>

                {/* Sciences Section */}
                <section id="sciences" className="mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 border-l-4 border-blue-600 pl-4">
                        General Sciences
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="p-6 bg-[#f0f9fa] rounded-2xl">
                            <h3 className="font-semibold text-lg text-gray-900">Physics</h3>
                            <p className="text-gray-600 mt-2">Study of matter, energy, and fundamental forces.</p>
                        </div>
                        <div className="p-6 bg-[#f0f9fa] rounded-2xl">
                            <h3 className="font-semibold text-lg text-gray-900">Chemistry</h3>
                            <p className="text-gray-600 mt-2">Study of substances and chemical reactions.</p>
                        </div>
                        <div className="p-6 bg-[#f0f9fa] rounded-2xl">
                            <h3 className="font-semibold text-lg text-gray-900">Biology</h3>
                            <p className="text-gray-600 mt-2">Study of living organisms and life processes.</p>
                        </div>
                        <div className="p-6 bg-[#f0f9fa] rounded-2xl">
                            <h3 className="font-semibold text-lg text-gray-900">Mathematics</h3>
                            <p className="text-gray-600 mt-2">Study of numbers, quantities, and shapes.</p>
                        </div>
                    </div>
                </section>

                {/* Humanities Section */}
                <section id="humanities" className="mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 border-l-4 border-green-600 pl-4">
                        Humanities
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="p-6 bg-[#f0f9fa] rounded-2xl">
                            <h3 className="font-semibold text-lg text-gray-900">History</h3>
                            <p className="text-gray-600 mt-2">Study of past events and civilizations.</p>
                        </div>
                        <div className="p-6 bg-[#f0f9fa] rounded-2xl">
                            <h3 className="font-semibold text-lg text-gray-900">Geography</h3>
                            <p className="text-gray-600 mt-2">Study of places, landscapes, and environments.</p>
                        </div>
                        <div className="p-6 bg-[#f0f9fa] rounded-2xl">
                            <h3 className="font-semibold text-lg text-gray-900">Economics</h3>
                            <p className="text-gray-600 mt-2">Study of production, distribution, and consumption.</p>
                        </div>
                        <div className="p-6 bg-[#f0f9fa] rounded-2xl">
                            <h3 className="font-semibold text-lg text-gray-900">Literature</h3>
                            <p className="text-gray-600 mt-2">Study of written works and literary analysis.</p>
                        </div>
                    </div>
                </section>

                {/* Vocationals Section */}
                <section id="vocationals" className="mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 border-l-4 border-purple-600 pl-4">
                        Vocational Subjects
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="p-6 bg-[#f0f9fa] rounded-2xl">
                            <h3 className="font-semibold text-lg text-gray-900">Technical Drawing</h3>
                            <p className="text-gray-600 mt-2">Engineering graphics and design principles.</p>
                        </div>
                        <div className="p-6 bg-[#f0f9fa] rounded-2xl">
                            <h3 className="font-semibold text-lg text-gray-900">Computer Studies</h3>
                            <p className="text-gray-600 mt-2">Digital literacy and computing fundamentals.</p>
                        </div>
                        <div className="p-6 bg-[#f0f9fa] rounded-2xl">
                            <h3 className="font-semibold text-lg text-gray-900">Agriculture</h3>
                            <p className="text-gray-600 mt-2">Farming practices and agricultural science.</p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
