import { Skeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
  return (
    <div className="w-full h-full p-4 space-y-6">
      {/* Header */}
      <div className="mb-4">
        <Skeleton className="h-8 w-32" />
      </div>

      {/* Search bar and buttons */}
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-10 flex-1 rounded-md" /> {/* Search input */}
        <Skeleton className="h-10 w-24 rounded-md" /> {/* Add Filter button */}
        <Skeleton className="h-10 w-20 rounded-md" /> {/* Sort button */}
      </div>

      {/* Table header */}
      <div className="grid grid-cols-6 gap-4 py-3 border-b border-border">
        <Skeleton className="h-5 w-12" /> {/* ID */}
        <Skeleton className="h-5 w-24" /> {/* Issue */}
        <Skeleton className="h-5 w-20" /> {/* Status */}
        <Skeleton className="h-5 w-20" /> {/* Priority */}
        <Skeleton className="h-5 w-24" /> {/* Assignee */}
        <Skeleton className="h-5 w-24" /> {/* Created */}
      </div>

      {/* Table rows */}
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="grid grid-cols-6 gap-4 py-4 border-b border-border">
          <Skeleton className="h-5 w-24" /> {/* ID */}
          <Skeleton className="h-5 w-48" /> {/* Issue */}
          <Skeleton className="h-7 w-20 rounded-full" /> {/* Status */}
          <Skeleton className="h-7 w-20 rounded-full" /> {/* Priority */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" /> {/* Avatar */}
            <Skeleton className="h-5 w-24" /> {/* Name */}
          </div>
          <Skeleton className="h-5 w-24" /> {/* Created date */}
        </div>
      ))}
    </div>
  );
}
