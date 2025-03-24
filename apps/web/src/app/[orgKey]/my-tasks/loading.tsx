import { Skeleton } from "@/components/ui/skeleton";

export default function MyTasksLoading() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="w-full h-full p-4 space-y-4">
          {/* Header */}
          <div className="mb-4">
            <Skeleton className="h-6 w-32" />
          </div>

          {/* Task items */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <Skeleton className="h-6 w-16" /> {/* Task ID */}
              <Skeleton className="h-6 w-6 rounded-full" /> {/* Status circle */}
              <Skeleton className="h-6 flex-1" /> {/* Task title */}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
