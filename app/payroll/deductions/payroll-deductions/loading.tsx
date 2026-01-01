import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="flex h-full w-full flex-col gap-3">
			<div className="flex items-center justify-between flex-wrap gap-2">
				<Skeleton className="h-6 w-96" />
				<Skeleton className="h-10 w-40" />
			</div>

			<div className="flex-1">
				<Skeleton className="h-full w-full" />
			</div>
		</div>
	);
}
