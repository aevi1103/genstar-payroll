import type { CustomCellRendererProps } from "ag-grid-react";

import type { DataSource } from "./payroll-history";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { useManualPayrollDialogStore } from "@/lib/stores/manual-payroll-dialog-store";

export const ClockOutBtn = ({
	params,
	isAdmin,
}: {
	params: CustomCellRendererProps<DataSource>;
	isAdmin: boolean;
}) => {
	const setPayrollEntryData = useManualPayrollDialogStore(
		(state) => state.setPayrollEntryData,
	);

	const openDialog = useManualPayrollDialogStore((state) => state.openDialog);

	if (params.data?.clock_out_time) {
		return new Date(params.data.clock_out_time).toLocaleString();
	}

	if (!isAdmin) {
		return "Active";
	}

	return (
		<Button
			className="w-full"
			size={"sm"}
			onClick={() => {
				setPayrollEntryData(params.data);
				openDialog();
			}}
		>
			<LogOut />
			Clock Out
		</Button>
	);
};
