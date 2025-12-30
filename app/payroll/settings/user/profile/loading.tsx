import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="space-y-4">
			<div className="flex items-center space-x-4">
				<Skeleton className="h-12 w-12 rounded-full" />
				<div className="space-y-2 flex-1">
					<Skeleton className="h-4 w-48" />
					<Skeleton className="h-4 w-32" />
				</div>
			</div>

			<div className="space-y-2">
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
			</div>
		</div>
	);
}
