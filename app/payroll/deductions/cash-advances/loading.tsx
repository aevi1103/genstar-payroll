import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Loading() {
	return (
		<div className="flex h-full w-full flex-col gap-3">
			{/* Header section */}
			<div className="flex items-center justify-between flex-wrap gap-2">
				<Skeleton className="h-5 w-72 mt-2" />
				<Skeleton className="h-10 w-40" />
			</div>

			{/* Total Unpaid Balance Card */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">
						<Skeleton className="h-6 w-48" />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Skeleton className="h-8 w-32" />
				</CardContent>
			</Card>

			{/* Cash Advances Table */}
			<div className="flex-1">
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<Skeleton className="h-6 w-40" />
							<Skeleton className="h-9 w-24" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{/* Table header */}
							<div className="grid grid-cols-6 gap-4 pb-3 border-b">
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-4 w-16" />
								<Skeleton className="h-4 w-16" />
							</div>
							{/* Table rows */}
							{Array.from({ length: 5 }).map((_, i) => (
								<div key={i.toString()} className="grid grid-cols-6 gap-4 py-3">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-16" />
									<Skeleton className="h-4 w-20" />
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
