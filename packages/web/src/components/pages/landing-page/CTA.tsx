import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-purple-600">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6 text-white">Ready to Transform Your Workflow?</h2>
        <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">Join thousands of teams already using our platform to boost productivity and achieve their goals.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-14 bg-white text-purple-600 hover:bg-purple-100">
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 h-14 border-2 border-white text-white hover:bg-purple-700">
            Schedule Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
