import type { CustomCellRendererProps } from "ag-grid-react";
import { Button } from "../ui/button";
import { LogOut, Pencil } from "lucide-react";
import { useManualPayrollDialogStore } from "@/lib/stores/manual-payroll-dialog-store";
import type { PayrollDataSource } from "@/hooks/use-payroll-history-query";

export const ClockOutTime = ({
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

	if (params.data?.clock_out_time) {
		return (
			<div className="flex gap-2 justify-between items-center">
				<span>{new Date(params.data.clock_out_time).toLocaleString()}</span>
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
