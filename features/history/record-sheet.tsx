"use client";

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { uePayrollHistoryStore } from "@/lib/stores/use-payroll-history-store";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPesoCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import {
	Calendar,
	Clock,
	MapPin,
	User,
	Briefcase,
	FileText,
} from "lucide-react";
import { GpsLocationBtn } from "./gps-location-btn";
import type { CustomCellRendererProps } from "ag-grid-react";
import type { PayrollDataSource } from "@/lib/map-payroll-datasource";

export const PayrollRecordSheet = () => {
	const open = uePayrollHistoryStore((state) => state.isSheetOpen);
	const openSheet = uePayrollHistoryStore((state) => state.openSheet);
	const closeSheet = uePayrollHistoryStore((state) => state.closeSheet);
	const record = uePayrollHistoryStore((state) => state.record);
	const setRecord = uePayrollHistoryStore((state) => state.setRecord);

	if (!record) return null;

	// Create mock params for GpsLocationBtn component
	const mockParams = {
		data: record,
	} as CustomCellRendererProps<PayrollDataSource>;

	const getStatusBadge = () => {
		if (record.clock_in_time && record.clock_out_time) {
			return <Badge variant="default">Completed</Badge>;
		}
		if (record.clock_in_time && !record.clock_out_time) {
			return <Badge variant="secondary">In Progress</Badge>;
		}
		return <Badge variant="secondary">Not Started</Badge>;
	};

	const formatDateTime = (date: Date | string | null | undefined) => {
		return date ? dayjs(date).format("MMM DD, YYYY h:mm A") : "N/A";
	};

	const formatDate = (date: Date | string | null | undefined) => {
		return date ? dayjs(date).format("MMM DD, YYYY") : "N/A";
	};

	return (
		<Sheet
			open={open}
			onOpenChange={(isOpen) => {
				if (isOpen) {
					openSheet();
				} else {
					closeSheet();
					setRecord(undefined);
				}
			}}
		>
			<SheetContent className="overflow-y-auto w-full sm:max-w-xl">
				<SheetHeader>
					<SheetTitle className="flex items-center gap-2">
						<span>Payroll Record Details</span>
						{getStatusBadge()}
					</SheetTitle>
					<SheetDescription>
						Detailed information about this payroll entry
					</SheetDescription>
				</SheetHeader>

				<div className="m-6 mt-2 space-y-6">
					{/* Employee Information */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<User className="h-4 w-4 text-muted-foreground" />
							<h3 className="font-semibold">Employee Information</h3>
						</div>
						<div className="space-y-2 pl-6">
							<DetailRow label="Name" value={record.fullName || "N/A"} />
							<DetailRow label="Email" value={record.email || "N/A"} />
						</div>
					</div>

					<Separator />

					{/* Payroll Week */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Calendar className="h-4 w-4 text-muted-foreground" />
							<h3 className="font-semibold">Payroll Period</h3>
						</div>
						<div className="space-y-2 pl-6">
							<DetailRow label="Week Range" value={record.weekRange || "N/A"} />
							<DetailRow
								label="Week Start"
								value={formatDate(record.weekStart)}
							/>
							<DetailRow label="Week End" value={formatDate(record.weekEnd)} />
						</div>
					</div>

					<Separator />

					{/* Time Information */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Clock className="h-4 w-4 text-muted-foreground" />
							<h3 className="font-semibold">Time Information</h3>
						</div>
						<div className="space-y-2 pl-6">
							<DetailRow
								label="Clock In"
								value={formatDateTime(record.clock_in_time)}
							/>
							<DetailRow
								label="Clock In Date"
								value={formatDate(record.clock_in_date)}
							/>
							<DetailRow
								label="Clock Out"
								value={formatDateTime(record.clock_out_time)}
							/>
							<DetailRow
								label="Clock Out Date"
								value={formatDate(record.clock_out_date)}
							/>
							<DetailRow
								label="Is Sunday"
								value={record.isSunday ? "Yes" : "No"}
							/>
						</div>
					</div>

					<Separator />

					{/* Hours & Earnings */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Briefcase className="h-4 w-4 text-muted-foreground" />
							<h3 className="font-semibold">Hours & Earnings</h3>
						</div>
						<div className="space-y-2 pl-6">
							<DetailRow
								label="Hours Worked"
								value={record.hoursWorked?.toFixed(2) || "0.00"}
							/>
							<DetailRow
								label="Regular Hours"
								value={record.regularHoursWorked?.toFixed(2) || "0.00"}
							/>
							<DetailRow
								label="Overtime Hours"
								value={record.overtimeHoursWorked?.toFixed(2) || "0.00"}
							/>
							<DetailRow
								label="Sunday Hours"
								value={record.sundayHoursWorked?.toFixed(2) || "0.00"}
							/>
							<DetailRow
								label="Break Hours"
								value={record.breakHours?.toFixed(2) || "0.00"}
							/>
							<Separator className="my-2" />
							<DetailRow
								label="Salary Per Day"
								value={formatPesoCurrency(record.salaryPerDay || 0)}
								highlight
							/>
							<DetailRow
								label="Salary Per Hour"
								value={formatPesoCurrency(record.salaryPerHour || 0)}
								highlight
							/>
							<DetailRow
								label="Amount Earned"
								value={formatPesoCurrency(record.amountEarned || 0)}
								highlight
							/>
						</div>
					</div>

					<Separator />

					{/* Location Information */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<MapPin className="h-4 w-4 text-muted-foreground" />
							<h3 className="font-semibold">Location</h3>
						</div>
						<div className="space-y-2 pl-6">
							<div className="flex justify-between items-center text-sm">
								<span className="text-muted-foreground">
									Clock In Location:
								</span>
								<span className="font-medium">
									<GpsLocationBtn params={mockParams} type="clock_in" />
								</span>
							</div>
							<div className="flex justify-between items-center text-sm">
								<span className="text-muted-foreground">
									Clock Out Location:
								</span>
								<span className="font-medium">
									<GpsLocationBtn params={mockParams} type="clock_out" />
								</span>
							</div>
						</div>
					</div>

					<Separator />

					{/* Entry Metadata */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<FileText className="h-4 w-4 text-muted-foreground" />
							<h3 className="font-semibold">Entry Information</h3>
						</div>
						<div className="space-y-2 pl-6">
							<DetailRow
								label="Payroll ID"
								value={record.id?.toString() || "N/A"}
							/>
							<DetailRow
								label="Manual Entry"
								value={record.is_manual ? "Yes" : "No"}
							/>
							<DetailRow
								label="Created At"
								value={formatDateTime(record.created_at)}
							/>
							<DetailRow
								label="Modified At"
								value={formatDateTime(record.modified_at)}
							/>
							<DetailRow
								label="Created By"
								value={record.created_by || "N/A"}
							/>
							<DetailRow
								label="Modified By"
								value={record.modified_by || "N/A"}
							/>
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};

const DetailRow = ({
	label,
	value,
	highlight = false,
}: {
	label: string;
	value: string | number | null | undefined;
	highlight?: boolean;
}) => (
	<div className="flex justify-between items-center text-sm">
		<span className="text-muted-foreground">{label}:</span>
		<span className={highlight ? "font-semibold" : "font-medium"}>
			{value ?? "N/A"}
		</span>
	</div>
);
