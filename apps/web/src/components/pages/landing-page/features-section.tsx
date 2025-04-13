import { CheckCircle, Clock, GitBranch, Layers, MessageSquare, UserCheck } from "lucide-react";

const features = [
  {
    icon: <Layers className="h-6 w-6 text-primary" />,
    title: "Customizable Workflows",
    description: "Drag-and-drop statuses and stages to match your exact process. No more forcing your team into rigid systems.",
  },
  {
    icon: <CheckCircle className="h-6 w-6 text-primary" />,
    title: "Task Management",
    description: "Assign tasks, set priorities, and track due dates all in one unified view. Never lose track of what matters.",
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-primary" />,
    title: "Real-time Collaboration",
    description: "Comment, mention teammates, and share files directly within tasks for seamless communication.",
  },
  {
    icon: <GitBranch className="h-6 w-6 text-primary" />,
    title: "Project Templates",
    description: "Start new projects in seconds with customizable templates that capture your team's best practices.",
  },
  {
    icon: <Clock className="h-6 w-6 text-primary" />,
    title: "Timeline View",
    description: "Visualize project timelines with our Gantt-style overview to spot dependencies and manage deadlines.",
  },
  {
    icon: <UserCheck className="h-6 w-6 text-primary" />,
    title: "Analytics Dashboard",
    description: "Track project health and team velocity with customizable metrics that help you improve over time.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="landing-section">
      <div className="landing-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need, nothing you don&apos;t</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Flexible tools that grow with your team, without the bloat of legacy software.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-10">
          {features.map((feature, index) => (
            <div key={index} className="bg-card border rounded-lg p-6 transition-all duration-300 hover:border-primary">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
