import type { CustomCellRendererProps } from "ag-grid-react";
import { Button } from "../../components/ui/button";
import { Pencil } from "lucide-react";
import { useManualPayrollDialogStore } from "@/lib/stores/manual-payroll-dialog-store";
import type { PayrollDataSource } from "@/lib/map-payroll-datasource";

export const ClockInTime = ({
	params,
	isAdmin,
}: {
	params: CustomCellRendererProps<PayrollDataSource>;
	isAdmin: boolean;
}) => {
	const setPayrollEntryData = useManualPayrollDialogStore(
		(state) => state.setPayrollEntryData,
	);

	const openDialog = useManualPayrollDialogStore((state) => state.openDialog);

	if (!params.data?.clock_in_time) {
		return null;
	}

	return (
		<div className="flex gap-2 justify-between items-center">
			<span>{new Date(params.data.clock_in_time).toLocaleString()}</span>
			{isAdmin && (
				<Button
					variant={"link"}
					size={"icon"}
					className="cursor-pointer"
					onClick={() => {
						setPayrollEntryData(params.data);
						openDialog();
					}}
				>
					<Pencil />
				</Button>
			)}
		</div>
	);
};
