"use client";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { Spinner } from "./ui/spinner";

ModuleRegistry.registerModules([AllCommunityModule]);

export const TableWrapper: React.FC<
	React.PropsWithChildren<{ withWrapper?: boolean; isLoading?: boolean }>
> = ({ children, withWrapper = true, isLoading }) => {
	if (!withWrapper) {
		return <div className="h-full w-full">{children}</div>;
	}

	if (isLoading) {
		return (
			<div className="h-[90dvh] md:flex-1">
				<div className="flex w-full h-full justify-center items-center">
					<div className="flex gap-2 items-center">
						<Spinner /> Loading...
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="h-[90dvh] md:flex-1">
			<div className="h-full w-full">{children}</div>
		</div>
	);
};
