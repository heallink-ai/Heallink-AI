"use client";

import Layout from "./components/layout/Layout";
import Download from "./components/sections/Download";
import FAQ from "./components/sections/FAQ";
import Features from "./components/sections/Features";
import ForPatients from "./components/sections/ForPatients";
import ForProviders from "./components/sections/ForProviders";
import Hero from "./components/sections/Hero";
import HowItWorks from "./components/sections/HowItWorks";
import Testimonials from "./components/sections/Testimonials";
import ComingSoon from "./components/sections/ComingSoon";

export default function Home() {
  return (
    <Layout>
      <Hero />
      <HowItWorks />
      <ForPatients />
      <ForProviders />
      <Features />
      <Testimonials />
      <FAQ />
      <ComingSoon />
      <Download />
    </Layout>
  );
}
