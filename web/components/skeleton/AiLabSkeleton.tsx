import { Skeleton } from "../ui/skeleton";

export default function AiLabSkeleton() {
    return <div className="h-screen flex flex-col p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <Skeleton className="h-full w-full rounded-lg bg-white" />
    </div>
}