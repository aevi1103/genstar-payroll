"use client";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

export const TableWrapper: React.FC<React.PropsWithChildren> = ({
	children,
}) => {
	return <div className="h-full w-full">{children}</div>;
};
