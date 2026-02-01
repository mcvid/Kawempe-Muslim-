import React from 'react';

const HistoryMessage = () => {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="max-w-4xl mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 font-[var(--font-barlow)]">
                    History of Kawempe Muslim Secondary School
                </h2>
                <div className="prose prose-lg text-slate-700 max-w-none space-y-6 leading-relaxed">
                    <p>
                        Our school's mission is to produce versatile individuals through quality education and Islamic values to
                        address global challenges. Kawempe Muslim Secondary School (KMSS) has a vibrant and evolving history. It
                        began as a government initiative to extend quality education to the Muslim community of Kampala, and
                        over time has grown into one of Uganda's respected secondary schools, known for its academic rigor, moral
                        foundation, and strong community spirit.
                    </p>
                    <p>
                        Kawempe Muslim's history reflects a unique blend of tradition and innovation — rooted in Islamic values
                        while embracing academic and co-curricular excellence that prepares students for national examinations
                        and life beyond school.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default HistoryMessage;
