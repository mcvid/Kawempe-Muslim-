export default function Loading() {
    return (
        <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center gap-6">
            <div className="relative w-24 h-24">
                {/* Logo Placeholder / Animation */}
                <div className="absolute inset-0 border-4 border-green-100 rounded-full animate-pulse" />
                <div className="absolute inset-0 border-t-4 border-green-600 rounded-full animate-spin" />
            </div>
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900 tracking-wider">KMSS</h2>
                <p className="text-slate-500 text-sm mt-2 animate-pulse uppercase tracking-[0.3em]">Go Higher</p>
            </div>
        </div>
    );
}
