import type { CustomCellRendererProps } from "ag-grid-react";
import { Button } from "../../components/ui/button";
import { Pencil } from "lucide-react";
import { useManualPayrollDialogStore } from "@/lib/stores/manual-payroll-dialog-store";
import type { PayrollDataSource } from "@/lib/map-payroll-datasource";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

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
		<div className="flex gap-1 items-center">
			{isAdmin && (
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant={"ghost"}
							size={"icon"}
							className="cursor-pointer"
							onClick={() => {
								setPayrollEntryData(params.data);
								openDialog();
							}}
						>
							<Pencil />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Click to edit hours</p>
					</TooltipContent>
				</Tooltip>
			)}

			<span>{new Date(params.data.clock_in_time).toLocaleString()}</span>
		</div>
	);
};
