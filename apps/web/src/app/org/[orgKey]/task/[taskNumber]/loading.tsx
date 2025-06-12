import { Skeleton } from "@/components/ui/skeleton";

export default function TaskLoading() {
  return (
    <div className="w-full h-full p-4">
      {/* Main flex container for two-column layout */}
      <div className="flex flex-row gap-6">
        {/* Left section - Task details, actions, activity (takes majority of space) */}
        <div className="flex-1 space-y-6">
          {/* Task ID */}
          <Skeleton className="h-5 w-16 mb-2" />

          {/* Task title */}
          <Skeleton className="h-8 w-64 mb-6" />

          {/* Command input */}
          <Skeleton className="h-40 w-full mb-8" />

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Skeleton className="h-9 w-32 rounded-md" />
            <Skeleton className="h-9 w-32 rounded-md" />
            <Skeleton className="h-9 w-32 rounded-md" />
            <Skeleton className="h-9 w-32 rounded-md" />
          </div>

          {/* Activity section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-24" /> {/* Activity title */}
              <Skeleton className="h-6 w-20" /> {/* Filters */}
            </div>

            {/* Comment input */}
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-full" /> {/* Avatar */}
              <Skeleton className="h-12 w-full rounded-md" /> {/* Input */}
            </div>

            {/* Activity items */}
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex gap-3 py-2">
                <Skeleton className="h-8 w-8 rounded-full" /> {/* Avatar */}
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-32" /> {/* User name */}
                    <Skeleton className="h-5 w-48" /> {/* Activity description */}
                    <Skeleton className="h-5 w-24 ml-auto" /> {/* Date */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right section - Properties (hidden on mobile) */}
        <div className="hidden lg:block w-[250px] space-y-6 mr-20 mt-12">
          <Skeleton className="h-6 w-24 mb-4" /> {/* Properties title */}
          {/* Status */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-16" /> {/* Label */}
            <Skeleton className="h-10 w-full rounded-md" /> {/* Dropdown */}
          </div>
          {/* Priority */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-16" /> {/* Label */}
            <Skeleton className="h-10 w-full rounded-md" /> {/* Dropdown */}
          </div>
          {/* Assignee */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" /> {/* Label */}
            <Skeleton className="h-10 w-full rounded-md" /> {/* Dropdown */}
          </div>
          {/* Due Date */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" /> {/* Label */}
            <Skeleton className="h-10 w-full rounded-md" /> {/* Date picker */}
          </div>
        </div>
      </div>
    </div>
  );
}
