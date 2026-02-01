import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative w-full h-screen text-white overflow-hidden">
      {/* Background image optimized with next/image */}
      <Image
        src="/back.png"
        alt="KMSS Background"
        fill
        priority
        className="object-cover"
        quality={90}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 z-[1]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-6 h-full text-center px-4">
        <div className="w-0.5 mt-20 h-40 bg-green-400 opacity-50" />

        <h1 className="font-light tracking-[10px] text-sm sm:text-base">
          WELCOME TO
        </h1>

        <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
          KAWEMPE MUSLIM <br />
          SECONDARY SCHOOL
        </h2>

        <p className="tracking-[0.5em] text-sm uppercase opacity-90">Go Higher</p>

        <div className="w-0.5 h-40 bg-green-400 mt-4 opacity-50" />
      </div>
    </section>
  );
};

export default Hero;
