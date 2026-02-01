import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Hero } from "./components/home";
import NavBar from "./components/NavBar";
import FadeInSection from "./Fade";

// Dynamic Imports for performance
const SectionAbout = dynamic(() => import("./components/home").then(mod => mod.SectionAbout), { ssr: true });
const HeadMsg = dynamic(() => import("./components/home").then(mod => mod.HeadMsg), { ssr: true });
const Mission = dynamic(() => import("./components/home").then(mod => mod.Mission), { ssr: true });
const Vision = dynamic(() => import("./components/home").then(mod => mod.Vision), { ssr: true });
const CoreValues = dynamic(() => import("./components/home").then(mod => mod.CoreValues), { ssr: true });
const Leader = dynamic(() => import("./components/home").then(mod => mod.Leader), { ssr: true });
const QuickActions = dynamic(() => import("./components/home").then(mod => mod.QuickActions), { ssr: true });
const EventsSection = dynamic(() => import("./components/home").then(mod => mod.EventsSection), { ssr: true });
const WempianSection = dynamic(() => import("./components/home").then(mod => mod.WempianSection), { ssr: true });
const VideoSection = dynamic(() => import("./components/home").then(mod => mod.VideoSection), { ssr: true });
const LatestNews = dynamic(() => import("./components/home").then(mod => mod.LatestNews), { ssr: true });
const Footer = dynamic(() => import("./components/Footer"), { ssr: true });

const SectionLoader = () => <div className="min-h-[200px] flex items-center justify-center bg-slate-50/10 animate-pulse " />;


const Homepage = () => {
  return (
    <div>
      <FadeInSection delay={1}>
        <Hero />
      </FadeInSection>

      <Suspense fallback={<SectionLoader />}>
        <FadeInSection delay={100}>
          <SectionAbout />
        </FadeInSection>
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <FadeInSection delay={200}>
          <HeadMsg />
        </FadeInSection>
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Mission />
        <Vision />
        <CoreValues />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Leader />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <FadeInSection delay={700}>
          <QuickActions />
        </FadeInSection>
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <FadeInSection delay={800}>
          <EventsSection />
        </FadeInSection>
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <FadeInSection delay={900}>
          <WempianSection />
        </FadeInSection>
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <FadeInSection delay={950}>
          <VideoSection />
        </FadeInSection>
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <FadeInSection delay={1000}>
          <LatestNews />
        </FadeInSection>
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <FadeInSection delay={1100}>
          <Footer />
        </FadeInSection>
      </Suspense>
    </div>
  );
};

export default Homepage;
