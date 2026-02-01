import { Crimson_Pro } from "next/font/google";
import Link from "next/link";
import { MapPin, Phone, Clock } from "lucide-react";

const schoolFont = Crimson_Pro({
  subsets: ["latin"],
  weight: "400",
});

const SectionAbout = () => {
  return (
    <section className="bg-white pb-24 px-6 lg:px-0">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-20 items-center">
        {/* Color pillars */}
        <div className="flex gap-4 lg:justify-start justify-center lg:gap-6">
          {["bg-blue-500", "bg-green-400", "bg-amber-400", "bg-red-500"].map(
            (color, i) => (
              <div
                key={i}
                className={`w-4 lg:w-8 h-40 lg:h-112 ${color} rounded-b-full`}
              />
            ),
          )}
        </div>

        {/* Main content */}
        <div className="max-w-2xl text-center lg:text-left text-black">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
            <span className="uppercase tracking-widest text-sm text-slate-500">
              Our Story
            </span>
            <div className="w-10 h-[2px] bg-blue-400" />
          </div>

          <h2 className="text-4xl lg:text-5xl font-semibold mb-6">
            The Journey Ahead
          </h2>

          <p
            className={`text-lg lg:text-xl leading-relaxed line-clamp-4 font-light text-slate-700 ${schoolFont.className}`}
          >
            Kawempe Muslim Secondary School is committed to nurturing
            disciplined, knowledgeable, and morally upright students. We provide
            quality secondary education grounded in Islamic values while
            promoting academic excellence, leadership, and responsible
            citizenship. Our mission is not only to shape successful learners
            but also to develop future leaders who positively impact their
            communities, the nation, and the world.
          </p>

          <div className="mt-8 flex items-center justify-center lg:justify-start gap-6">
            <Link
              href="/about"
              className="text-blue-600 font-medium hover:underline underline-offset-4 transition"
            >
              Read more →
            </Link>

            <div className="w-24 h-[2px] bg-blue-400" />
          </div>
        </div>

        {/* Quick actions (right side) */}
        <aside className="hidden lg:flex">
          <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-6 min-w-[220px]">
            <span className="text-sm uppercase tracking-widest text-slate-400">
              Quick Access
            </span>

            <Link
              href="/contact"
              className="flex items-center gap-3 text-slate-700 hover:text-green-600 transition"
            >
              <Phone className="w-5 h-5" />
              <span>Contact Us</span>
            </Link>

            <Link
              href="https://maps.app.goo.gl/uXYebSwMza8Gres76"
              className="flex items-center gap-3 text-slate-700 hover:text-green-600 transition"
            >
              <MapPin className="w-5 h-5" />
              <span>Our Location</span>
            </Link>

            <Link
              href="/about#history"
              className="flex items-center gap-3 text-slate-700 hover:text-green-600 transition"
            >
              <Clock className="w-5 h-5" />
              <span>School History</span>
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default SectionAbout;
