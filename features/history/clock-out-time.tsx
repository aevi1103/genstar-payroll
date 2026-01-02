import type { CustomCellRendererProps } from "ag-grid-react";
import { Button } from "../../components/ui/button";
import { LogOut, Pencil } from "lucide-react";
import { useManualPayrollDialogStore } from "@/lib/stores/manual-payroll-dialog-store";
import type { PayrollDataSource } from "@/lib/map-payroll-datasource";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

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
			<div className="flex gap-1 items-center w-full">
				{isAdmin && (
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant={"link"}
								size={"icon"}
								className="cursor-pointer"
								onClick={() => {
									setPayrollEntryData(params.data);
									openDialog();
								}}
							>
								<Pencil className="text-blue-500 hover:text-blue-600" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Click to edit hours</p>
						</TooltipContent>
					</Tooltip>
				)}

				<span>{new Date(params.data.clock_out_time).toLocaleString()}</span>
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
