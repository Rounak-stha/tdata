import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center space-y-8">
        <div className="inline-block bg-purple-100 text-purple-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">✨ New: AI-Powered Task Management</div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-gray-900">
          Experience Ultimate
          <br />
          <span className="text-purple-600">Task Management</span>
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Streamline your workflow with our intuitive tools designed for maximum efficiency and productivity.</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-14 bg-purple-600 hover:bg-purple-700">
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 h-14 border-2 border-gray-300 hover:bg-gray-100">
            See How it Works
          </Button>
        </div>
      </div>
    </section>
  );
}
