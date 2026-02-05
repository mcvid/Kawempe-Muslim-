"use client";

import { Suspense, useState } from "react";
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
import MotionLoader from "./components/MotionLoader";
import { AnimatePresence, motion } from "framer-motion";

const SectionLoader = () => <MotionLoader minimal />;

const Homepage = () => {
  const [showLoader, setShowLoader] = useState(true);

  return (
    <>
      {/* Full-screen loader that must complete before content shows */}
      <AnimatePresence>
        {showLoader && (
          <motion.div
            key="loader"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MotionLoader onComplete={() => setShowLoader(false)} minDuration={4000} />

          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - only visible after loader completes */}
      {!showLoader && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
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
        </motion.div>
      )}
    </>
  );
};

export default Homepage;

