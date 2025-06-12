import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsLoading() {
  return (
    <div className="w-full h-full p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-48" /> {/* Project title */}
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-md" /> {/* Icon button */}
          <Skeleton className="h-8 w-8 rounded-md" /> {/* Icon button */}
        </div>
      </div>

      {/* Kanban board */}
      <div className="flex gap-6">
        {/* To Do column */}
        {Array.from({ length: 4 }).map((_, index) => {
          const numberOfCards = Math.floor(Math.random() * 4);
          return (
            <div key={index} className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-20" /> {/* Column title */}
                <Skeleton className="h-6 w-6 rounded-full" /> {/* Add button */}
              </div>

              {/* Task cards */}
              {Array.from({ length: numberOfCards }).map((_, index) => (
                <div key={index} className="p-4 w-80 rounded-sm border border-border bg-card space-y-3">
                  <Skeleton className="h-5 w-16" /> {/* Task ID */}
                  <Skeleton className="h-6 w-48" /> {/* Task title */}
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full" /> {/* Status circle */}
                    <Skeleton className="h-5 w-5" /> {/* Icon */}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
