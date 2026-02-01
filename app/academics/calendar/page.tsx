import AcademicCalendar from "@/app/components/academics/AcademicCalendar";
import Footer from "@/app/components/Footer";

export default function Page() {
  return (
    <div className="pt-24 min-h-screen bg-white">
      <AcademicCalendar />
      <Footer />
    </div>
  );
}
