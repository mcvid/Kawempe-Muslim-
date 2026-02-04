import { Suspense } from "react";
import FadeInSection from "./Fade";
import {
  Hero,
  SectionAbout,
  HeadMsg,
  Mission,
  Vision,
  CoreValues,
  Leader,
  QuickActions,
  EventsSection,
  WempianSection,
  VideoSection,
  LatestNews
} from "./components/home";
import Footer from "./components/Footer";

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
