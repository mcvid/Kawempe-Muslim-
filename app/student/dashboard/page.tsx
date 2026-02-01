import StudentPerformanceGraph from "@/app/components/student/dashboard/StudentPerformanceGraph";
import StudentPaymentHistory from "@/app/components/student/dashboard/StudentPaymentHistory";
import StudentClassSchedule from "@/app/components/student/dashboard/StudentClassSchedule";

export default function StudentDashboard() {
    return (
        <div className="space-y-6 font-[var(--font-montserrat)]">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Points Attained */}
                <div className="bg-[#E0E0E0] p-6 rounded-none flex flex-col justify-center min-h-[140px]">
                    <h3 className="text-sm font-medium text-black mb-1">Points attained</h3>
                    <div className="flex items-baseline">
                        <span className="text-5xl font-light text-black">45</span>
                        <span className="text-xl text-gray-500 font-light">/400</span>
                    </div>
                </div>

                {/* Average */}
                <div className="bg-[#E0E0E0] p-6 rounded-none flex flex-col justify-center min-h-[140px]">
                    <h3 className="text-sm font-medium text-black mb-1">Average</h3>
                    <div className="flex items-baseline">
                        <span className="text-5xl font-light text-black">2.1</span>
                        <span className="text-xl text-gray-500 font-light">/3</span>
                    </div>
                </div>

                {/* Total Classes Attended */}
                <div className="bg-[#E0E0E0] p-6 rounded-none flex flex-col justify-center min-h-[140px]">
                    <h3 className="text-sm font-medium text-black mb-1">Total classes attended</h3>
                    <div className="flex items-baseline">
                        <span className="text-5xl font-light text-black">67</span>
                        <span className="text-xl text-gray-500 font-light">/394</span>
                    </div>
                </div>

            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Graph & Payments */}
                <div className="lg:col-span-2 space-y-6">
                    <StudentPerformanceGraph />
                    <StudentPaymentHistory />
                </div>

                {/* Right Column: Schedule */}
                <div className="lg:col-span-1">
                    <StudentClassSchedule />
                </div>
            </div>
        </div>
    );
}
