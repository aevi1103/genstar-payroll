import React from "react";
import { Skeleton } from "../ui/skeleton";

export const HistoryLoader = () => {
	return (
		<div className="space-y-3">
			{/* Table header skeleton */}
			<div className="flex gap-2 pb-2 border-b">
				<Skeleton className="h-3 flex-1" />
				<Skeleton className="h-3 flex-1" />
				<Skeleton className="h-3 flex-1" />
				<Skeleton className="h-3 flex-1" />
				<Skeleton className="h-3 flex-1" />
				<Skeleton className="h-3 flex-1" />
			</div>
			{/* Table rows skeleton */}
			{[...Array(5)].map((_, i) => (
				<div key={i.toString()} className="flex gap-2">
					<Skeleton className="h-3 flex-1" />
					<Skeleton className="h-3 flex-1" />
					<Skeleton className="h-3 flex-1" />
					<Skeleton className="h-3 flex-1" />
					<Skeleton className="h-3 flex-1" />
					<Skeleton className="h-3 flex-1" />
				</div>
			))}
		</div>
	);
};
