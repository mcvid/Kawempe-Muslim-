import { Award, Clock, MapPin, User } from "lucide-react";
import Image from "next/image";

export default function StudentClassSchedule() {
    const schedule = [
        {
            topic: "Topics", // Placeholder header if needed, but per design it's inline
            subject: "Mathematics",
            time: "08:00 - 09:30",
            teacher: "Mr. Kato",
            room: "Room 101",
            credits: "3",
            avatarSeed: "Kato",
            color: "bg-blue-100"
        },
        {
            subject: "Physics",
            time: "10:00 - 11:30",
            teacher: "Ms. Namukwaya",
            room: "Lab 3",
            credits: "4",
            avatarSeed: "Namukwaya",
            color: "bg-purple-100"
        },
        {
            subject: "Literature",
            time: "12:30 - 14:00",
            teacher: "Mr. Ochieng",
            room: "Lib Hall",
            credits: "2",
            avatarSeed: "Ochieng",
            color: "bg-amber-100"
        },
        {
            subject: "History",
            time: "14:15 - 15:45",
            teacher: "Mrs. Alupo",
            room: "Main Hall",
            credits: "3",
            avatarSeed: "Alupo",
            color: "bg-emerald-100"
        }
    ];

    return (
        <div className="bg-[#E0E0E0] p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-base font-medium text-black">Daily class schedule</h3>
                <span className="text-base text-black/70">Monday</span>
            </div>

            <div className="space-y-8">
                {schedule.map((cls, idx) => (
                    <div key={idx} className="flex gap-4">
                        {/* Avatar */}
                        <div className={`w-12 h-12 rounded-full ${cls.color} flex-shrink-0 overflow-hidden border border-white/20`}>
                            <Image
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${cls.avatarSeed}`}
                                alt={cls.teacher}
                                width={48}
                                height={48}
                                className="object-cover"
                            />
                        </div>

                        {/* Details */}
                        <div className="flex-1 space-y-2">
                            {/* Subject & Time */}
                            <div>
                                <h4 className="font-semibold text-black text-lg leading-tight">{cls.subject}</h4>
                                <p className="text-sm text-gray-600 font-medium">{cls.time}</p>
                            </div>

                            {/* Meta Data */}
                            <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-1 text-sm">
                                {/* Teacher */}
                                <div className="flex items-center gap-2 text-gray-700">
                                    <User size={16} className="text-gray-500" />
                                    <span>Name</span>
                                </div>
                                <div className="text-right font-medium text-black">{cls.teacher}</div>

                                {/* Room */}
                                <div className="flex items-center gap-2 text-gray-700">
                                    <MapPin size={16} className="text-gray-500" />
                                    <span>Room</span>
                                </div>
                                <div className="text-right font-medium text-black">{cls.room}</div>

                                {/* Credits */}
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Award size={16} className="text-gray-500" />
                                    <span>Credits</span>
                                </div>
                                <div className="text-right font-medium text-black">{cls.credits}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
