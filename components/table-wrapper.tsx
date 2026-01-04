"use client";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

export const TableWrapper: React.FC<
	React.PropsWithChildren<{ withWrapper?: boolean }>
> = ({ children, withWrapper = true }) => {
	if (!withWrapper) {
		return <div className="h-full w-full">{children}</div>;
	}

	return (
		<div className="h-[90dvh] md:flex-1">
			<div className="h-full w-full">{children}</div>
		</div>
	);
};
