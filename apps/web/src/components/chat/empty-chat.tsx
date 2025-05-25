import { SendIcon, CalendarIcon, ListTodoIcon, FileTextIcon } from "lucide-react";

export function EmptyChat() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <div className="rounded-full p-4 mb-4">
        <SendIcon className="h-6 w-6 text-primary" />
      </div>
      <h2 className="text-xl font-medium mb-2">How can I help you today?</h2>
      <p className="text-muted-foreground text-center max-w-md mb-8">Ask me anything about your projects, tasks, or for help with planning and organization.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-xl">
        <div className="p-3 rounded-lg border hover:border-primary/50 transition-colors cursor-pointer group">
          <CalendarIcon className="h-5 w-5 text-primary mb-2" />
          <p className="text-sm font-medium">Create a project timeline</p>
          <p className="text-xs text-muted-foreground mt-1 transition-colors">Generate a timeline for my new website project</p>
        </div>

        <div className="p-3 rounded-lg border hover:border-primary/50 transition-colors cursor-pointer group">
          <ListTodoIcon className="h-5 w-5 text-primary mb-2" />
          <p className="text-sm font-medium">Task prioritization</p>
          <p className="text-xs text-muted-foreground mt-1 transition-colors">Help me prioritize my current tasks</p>
        </div>

        <div className="p-3 rounded-lg border hover:border-primary/50 transition-colors cursor-pointer group">
          <FileTextIcon className="h-5 w-5 text-primary mb-2" />
          <p className="text-sm font-medium">Draft a project brief</p>
          <p className="text-xs text-muted-foreground mt-1 transition-colors">Help me write a brief for my client project</p>
        </div>
      </div>
    </div>
  );
}
