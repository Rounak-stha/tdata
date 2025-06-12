import { Skeleton } from "@/components/ui/skeleton";

export default function DocumentListPageLoading() {
  return (
    <div className="px-6 py-4 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-60" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-6 w-60" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-28" />
        </div>
      </div>
      <div className="grid grid-cols-1">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 10 }).map((_, i) => {
              const height = Math.max(Math.floor(Math.random() * 40), 20);
              const width = Math.max(Math.floor(Math.random() * 1000), 300);
              return <Skeleton style={{ height, width, opacity: 1 / i }} key={i} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
