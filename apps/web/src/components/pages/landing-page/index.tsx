"use client";
import { useEffect, useState } from "react";
import Navbar from "./navbar";
import HeroSection from "./hero-section";
import FeaturesSection from "./features-section";
import WorkflowSection from "./workflow-section";
import AutomationSection from "./automation-section";
import FaqSection from "./faq-section";
import CtaSection from "./cta-section";
import Footer from "./footer";
import { motion, useScroll } from "framer-motion";

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const [hasScrolled, setHasScrolled] = useState(false);

  // Listen for scroll events to determine when user has scrolled
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-tdata-blue origin-left z-50" style={{ scaleX: scrollYProgress }} />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <WorkflowSection />
        <AutomationSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />

      {/* Scroll to top button */}
      {hasScrolled && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 bg-tdata-dark-card/80 backdrop-blur-sm border border-tdata-dark-border p-3 rounded-full shadow-lg hover:bg-tdata-dark-card z-40"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="arrow-up w-5 h-5"
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        </motion.button>
      )}
    </div>
  );
}
