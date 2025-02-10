import Hero from "./hero";
import Features from "./features";
import TaskDemo from "./task-demo";
import CTA from "./CTA";
import Header from "./header";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <Features />
      <TaskDemo />
      <CTA />
    </main>
  );
}
