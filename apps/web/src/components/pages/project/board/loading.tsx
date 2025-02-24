export const BoardSkeleton = () => {
  return (
    <div className="flex gap-4 px-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="w-80 shrink-0">
          <div className="mb-3 flex items-center justify-between">
            <div className="h-4 w-20 bg-accent animate-pulse rounded" />
            <div className="h-6 w-6 bg-accent animate-pulse rounded" />
          </div>
          <div key={i} className="flex flex-col gap-2">
            {Array.from({ length: Math.ceil(Math.random() * 6) }).map((_, i) => (
              <div key={i} style={{ opacity: 1 / (i + 1) }} className="h-20 bg-accent rounded" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
