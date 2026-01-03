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
import dayjs from "dayjs";
import { Clock, MapPin, User, FileText } from "lucide-react";
import { GpsLocationBtn } from "./gps-location-btn";
import type { CustomCellRendererProps } from "ag-grid-react";
import type { PayrollDataSource } from "@/lib/map-payroll-datasource";
import { hoursToTime } from "@/lib/convert-hours-to-duration";
import numeral from "numeral";

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
		return date ? dayjs(date).format("MMM DD, YYYY h:mm A") : "Active";
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
						<span>{record.fullName || "N/A"}</span>
						{getStatusBadge()}

						<Badge variant={"outline"}>
							{record.is_manual ? "Manual Entry" : "QR Code Entry"}
						</Badge>
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

					{/* Time Information */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Clock className="h-4 w-4 text-muted-foreground" />
							<h3 className="font-semibold">Time Information</h3>
						</div>
						<div className="space-y-2 pl-6">
							<DetailRow label="Week Range" value={record.weekRange || "N/A"} />

							<DetailRow
								label="Original Clock In"
								value={formatDateTime(record.originalClockInTime.toDate())}
							/>
							<DetailRow
								label="Clock In"
								value={formatDateTime(record.clockInTime.toDate())}
							/>
							<DetailRow
								label="Clock Out"
								value={formatDateTime(record.clock_out_time)}
							/>

							<DetailRow
								label="Hours Worked"
								value={numeral(record.hoursWorked).format("0.[00]")}
							/>

							<DetailRow
								label="Late (mins)"
								value={`${numeral(record.lateTimeInMinutes || 0).format("0.[00]")} mins`}
							/>

							<DetailRow
								label="Adjusted Hours Worked"
								value={`${numeral(record.adjustedHoursWorked).format("0.[00]")} hrs. (${hoursToTime(record.adjustedHoursWorked || 0).formatted})`}
							/>

							<DetailRow
								label="Is Sunday"
								value={record.isSunday ? "Yes" : "No"}
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
