import { CheckCircle } from "lucide-react";

const steps = [
  "Sign up for an account",
  "Choose a template or start from scratch",
  "Invite your team members",
  "Set up AI-powered automations",
  "Track progress and collaborate in real-time",
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-50">
      <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
      <div className="max-w-3xl mx-auto">
        <ul className="space-y-6">
          {steps.map((step, index) => (
            <li key={index} className="flex items-center space-x-4">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
              <span className="text-lg text-gray-700">{step}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
