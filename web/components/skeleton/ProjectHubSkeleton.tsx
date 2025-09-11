import { Skeleton } from "../ui/skeleton";

export default function ProjectHubSkeleton() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Skeleton className="h-10 w-1/3 rounded-lg bg-white mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full px-4 lg:px-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-48 rounded-lg bg-white" />
        ))}
      </div>
    </div>
  );
}
