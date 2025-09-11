import { Skeleton } from "../ui/skeleton";

export default function MissionPageSkeletion() {
  return (
    <div className="mx-auto px-4 py-8 lg:px-8 grid grid-cols-2 gap-8 h-[calc(100vh-6rem)]">
      <Skeleton className="col-span-1 h-full rounded-lg bg-white" />
      <div className="col-span-1 flex flex-col h-full overflow-y-auto gap-4">
        <Skeleton className="h-10 w-1/3 rounded-lg bg-white" />
        <Skeleton className="h-6 w-1/2 rounded-lg bg-white" />
        <Skeleton className="h-6 w-full rounded-lg bg-white" />
        <Skeleton className="h-6 w-full rounded-lg bg-white" />
        <Skeleton className="h-6 w-5/6 rounded-lg bg-white " />
      </div>
    </div>
  );
}
