import { Card } from "@/components/ui/card";
import { Brain, Users, Zap, BarChart } from "lucide-react";

const features = [
  {
    title: "AI-Powered Insights",
    description: "Get intelligent suggestions and automate repetitive tasks with our advanced AI",
    icon: Brain,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Real-time Collaboration",
    description: "Work seamlessly with your team members in real-time",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Smart Automations",
    description: "Automate workflows and increase team productivity",
    icon: Zap,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Advanced Analytics",
    description: "Track progress and measure team performance with detailed insights",
    icon: BarChart,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
];

export default function Features() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl font-bold mb-4 text-gray-900">Powerful Features</h2>
        <p className="text-xl text-gray-600">Everything you need to manage your projects effectively</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="border-none shadow-none hover:shadow-md transition-shadow duration-300">
            <div className="p-6 space-y-4">
              <div className={`inline-flex p-3 rounded-lg ${feature.bgColor}`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
