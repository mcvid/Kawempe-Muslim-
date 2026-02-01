import Image from 'next/image';

const AboutHero = () => {
    return (
        <div className="relative h-[80vh] min-h-[500px] w-full bg-slate-900 text-white overflow-hidden">
            <div className="absolute inset-0">
                <Image
                    src="/images/about/hero.png"
                    alt="Students laughing"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 w-full px-6 py-12 md:p-16 max-w-6xl mx-auto">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 font-[var(--font-barlow)]">
                    Kawempe Muslim’s Learning Environment
                </h1>
                <p className="text-lg md:text-xl text-slate-100 max-w-3xl leading-relaxed drop-shadow-md">
                    The unique learning environment at Kawempe Muslim is built around small class sizes and dedicated, supportive teachers who inspire students to achieve academic excellence while developing strong moral values.
                </p>
            </div>
        </div>
    );
};

export default AboutHero;
