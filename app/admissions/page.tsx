import AdmissionsHero from "@/app/components/admissions/AdmissionsHero";
import MainSection from "@/app/components/admissions/MainSection";
import StatsBar from "@/app/components/admissions/StatsBar";
import Achieve from "@/app/components/admissions/Achieve";
import AdmissionsTracker from "@/app/components/admissions/AdmissionsTracker";
import AdmissionsRequirements from "@/app/components/admissions/AdmissionsRequirements";
import AdmissionsSteps from "@/app/components/admissions/AdmissionsSteps";
import AdmissionsDates from "@/app/components/admissions/AdmissionsDates";
import AdmissionsDownloads from "@/app/components/admissions/AdmissionsDownloads";
import AdmissionsContact from "@/app/components/admissions/AdmissionsContact";
import AdmissionsInquiry from "@/app/components/admissions/AdmissionsInquiry";
import WempianSection from "@/app/components/home/WempianSection"; // Reuse existing
import Footer from "@/app/components/Footer";
import React from "react";
import FadeInSection from "@/app/Fade";

export default function AdmissionsPage() {
    return (
        <main>
            <AdmissionsHero />

            <FadeInSection delay={100}>
                <StatsBar />
            </FadeInSection>

            <FadeInSection delay={200}>
                <AdmissionsSteps />
            </FadeInSection>

            <FadeInSection delay={300}>
                <AdmissionsDates />
            </FadeInSection>

            <FadeInSection delay={400}>
                <MainSection />
            </FadeInSection>

            <FadeInSection delay={500}>
                <AdmissionsRequirements />
            </FadeInSection>

            <FadeInSection delay={600}>
                <AdmissionsDownloads />
            </FadeInSection>

            <FadeInSection delay={700}>
                <Achieve />
            </FadeInSection>

            <FadeInSection delay={800}>
                <AdmissionsTracker />
            </FadeInSection>

            <FadeInSection delay={900}>
                <AdmissionsInquiry />
            </FadeInSection>

            <FadeInSection delay={1000}>
                <AdmissionsContact />
            </FadeInSection>


            <Footer />
        </main>
    );
}



