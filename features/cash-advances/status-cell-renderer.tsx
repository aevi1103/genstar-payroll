import type { ICellRendererParams } from "ag-grid-community";
import { Badge } from "@/components/ui/badge";
import type { CashAdvanceRecord } from "@/lib/db/get-cash-advances";

export const StatusCellRenderer = (
	props: ICellRendererParams<CashAdvanceRecord>,
) => {
	const isPaid = props.data?.is_paid;

	return isPaid ? (
		<Badge variant="default">Paid</Badge>
	) : (
		<Badge variant="secondary">Unpaid</Badge>
	);
};
