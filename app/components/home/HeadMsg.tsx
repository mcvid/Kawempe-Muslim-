import { Book } from "lucide-react";
import { Crimson_Pro } from "next/font/google";
import Link from "next/link";
import Image from "next/image";

const schoolFont = Crimson_Pro({
  subsets: ["latin"],
  weight: "400",
});

const HeadMsg = () => {
  return (
    <section className="bg-[#ECF7F8] pb-40">
      <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-16">
        {/* Text content */}
        <div className="lg:w-2/3 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
            <div className="w-10 h-[2px] bg-green-500" />
            <span className="uppercase tracking-widest text-sm text-slate-500">
              Leadership
            </span>
          </div>

          <h2 className={` text-4xl lg:text-5xl font-bold mb-6 text-slate-900`}>
            Message from the <span className="italic">Headteacher</span>
          </h2>

          <p
            className={`${schoolFont.className} lg:text-xl text-md leading-relaxed lg:line-clamp-3 line-clamp-5 text-slate-700 `}
          >
            Assalam alaikum warahmatullahi wabarakatuh. Welcome to Kawempe
            Muslim Secondary School. We are dedicated to providing quality
            education rooted in academic excellence, discipline, and strong
            Islamic values. Our goal is to nurture well-rounded students who are
            confident, responsible, and prepared to succeed in both education
            and life. We value partnership with parents and the community as we
            guide our learners toward a bright and purposeful future.
          </p>

          <div className="mt-6 flex items-center justify-center lg:justify-start gap-2">
            <Book className="w-5 h-5 text-blue-600" />
            <Link
              href="/about/headteacher-message"
              className="text-blue-600 font-medium hover:underline underline-offset-4 transition"
            >
              Read full message
            </Link>
          </div>
        </div>

        {/* Image / visual */}
        <div className="lg:w-1/3 flex justify-center perspective-[1000px]">
          <div className="relative group">
            <div className="absolute -inset-2 bg-green-100 rounded-2xl -z-10" />

            <Image
              src="/hm.png"
              alt="Headteacher"
              width={320}
              height={320}
              className="
        w-80 h-80 object-cover rounded-xl bg-white shadow-md
        transition-transform duration-300 ease-out
        group-hover:scale-105
        group-hover:rotate-2
        group-hover:-rotate-y-6
      "
            />

            {/* Hover overlay */}
            <div
              className="
        absolute inset-0 rounded-xl
      
        flex items-center justify-center
        opacity-0
        group-hover:opacity-100
        transition-opacity duration-300
      "
            >
              <span className="text-white text-lg font-semibold">
                Hajat Kibirige Zulaika
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeadMsg;
