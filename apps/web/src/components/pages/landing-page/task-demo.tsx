import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function TaskDemo() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="text-sm font-medium text-purple-600">Quick & Easy</div>
            <h2 className="text-4xl font-bold text-gray-900">
              Smart Task Management
              <br />
              That Actually Works
            </h2>
          </div>
          <p className="text-gray-600 text-lg">Experience seamless task management with our intuitive interface. Perfect for teams of all sizes.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="p-6 bg-yellow-50 border-none">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Tasks Progress</h3>
                <div className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-sm font-medium">64%</div>
              </div>
              <Progress value={64} className="h-2 bg-yellow-200 [&::-webkit-progress-value]:bg-yellow-500 [&::-moz-progress-bar]:bg-yellow-500" />
              <div className="space-y-4">
                {[
                  { name: "Design System", date: "Apr 10", progress: 80 },
                  { name: "Mobile App UI", date: "Apr 20", progress: 45 },
                ].map((task, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-800 font-medium">{task.name[0]}</div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{task.name}</p>
                      <p className="text-sm text-gray-500">Due: {task.date}</p>
                    </div>
                    <Progress value={task.progress} className="w-20 h-1 bg-yellow-200 [&::-webkit-progress-value]:bg-yellow-500 [&::-moz-progress-bar]:bg-yellow-500" />
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-green-50 border-none">
            <div className="space-y-6">
              <div className="text-sm font-medium text-green-700">Pro Features</div>
              <h3 className="text-2xl font-bold text-gray-900">Quick Task Management</h3>
              <div className="space-y-3">
                {["AI-powered suggestions", "Real-time collaboration", "Advanced analytics"].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-600">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <button className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
