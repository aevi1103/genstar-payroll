"use client";
import { useWeeklyPayrollHistoryStore } from "@/lib/stores/use-weekly-payroll-history-store";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	User,
	Calendar,
	Clock,
	Briefcase,
	DollarSign,
	TrendingUp,
} from "lucide-react";
import { formatPesoCurrency } from "@/lib/utils";
import dayjs from "dayjs";

export const WeeklyRecordSheet = () => {
	const open = useWeeklyPayrollHistoryStore((state) => state.isSheetOpen);
	const openSheet = useWeeklyPayrollHistoryStore((state) => state.openSheet);
	const closeSheet = useWeeklyPayrollHistoryStore((state) => state.closeSheet);
	const record = useWeeklyPayrollHistoryStore((state) => state.record);
	const setRecord = useWeeklyPayrollHistoryStore((state) => state.setRecord);

	if (!record) return null;

	const formatDate = (date: string | null | undefined) => {
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
						<span>Weekly Payroll Summary</span>
						<Badge variant="default">Week Summary</Badge>
					</SheetTitle>
					<SheetDescription>
						Detailed weekly payroll summary for the employee
					</SheetDescription>
				</SheetHeader>

				<div className="m-6 mt-2 space-y-6">
					{/* Employee Information */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<User className="h-4 w-4 text-muted-foreground" />
							<h3 className="font-semibold text-sm">Employee Information</h3>
						</div>
						<div className="space-y-2 pl-6">
							<DetailRow label="Name" value={record.name || "N/A"} />
							<DetailRow label="First Name" value={record.firstName || "N/A"} />
							<DetailRow label="Last Name" value={record.lastName || "N/A"} />
						</div>
					</div>

					<Separator />

					{/* Week Period */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Calendar className="h-4 w-4 text-muted-foreground" />
							<h3 className="font-semibold text-sm">Week Period</h3>
						</div>
						<div className="space-y-2 pl-6">
							<DetailRow
								label="Week Start"
								value={formatDate(record.weekStart)}
							/>
							<DetailRow label="Week End" value={formatDate(record.weekEnd)} />
							<DetailRow
								label="Days Worked"
								value={record.regularDaysWorked.toFixed(2)}
							/>
						</div>
					</div>

					<Separator />

					{/* Salary Information */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<DollarSign className="h-4 w-4 text-muted-foreground" />
							<h3 className="font-semibold text-sm">Salary Information</h3>
						</div>
						<div className="space-y-2 pl-6">
							<DetailRow
								label="Salary Per Day"
								value={formatPesoCurrency(record.salaryPerDay)}
							/>
							<DetailRow
								label="Salary Per Hour"
								value={formatPesoCurrency(record.salaryPerHour)}
							/>
						</div>
					</div>

					<Separator />

					{/* Working Hours */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Clock className="h-4 w-4 text-muted-foreground" />
							<h3 className="font-semibold text-sm">Working Hours</h3>
						</div>
						<div className="space-y-2 pl-6">
							<DetailRow
								label="Regular Hours"
								value={`${record.totalRegularHours.toFixed(2)} hrs`}
							/>
							<DetailRow
								label="Overtime (Regular)"
								value={`${record.totalRegularOvertime.toFixed(2)} hrs`}
							/>
							<DetailRow
								label="Sunday Hours"
								value={`${record.sundayHours.toFixed(2)} hrs`}
							/>
							<DetailRow
								label="Late Deduction"
								value={`${record.late.toFixed(2)} hrs`}
							/>
							<DetailRow
								label="Net Hours"
								value={`${(record.totalRegularHours - record.late).toFixed(2)} hrs`}
								highlight
							/>
						</div>
					</div>

					<Separator />

					{/* Overtime Rates */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<TrendingUp className="h-4 w-4 text-muted-foreground" />
							<h3 className="font-semibold text-sm">Overtime Rates</h3>
						</div>
						<div className="space-y-2 pl-6">
							<DetailRow
								label="Regular OT Rate"
								value={`${(record.regulatOtMultiplier * 100).toFixed(0)}%`}
							/>
							<DetailRow
								label="Sunday OT Rate"
								value={`${(record.sundayMultiplier * 100).toFixed(0)}%`}
							/>
						</div>
					</div>

					<Separator />

					{/* Earnings Breakdown */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Briefcase className="h-4 w-4 text-muted-foreground" />
							<h3 className="font-semibold text-sm">Earnings Breakdown</h3>
						</div>
						<div className="space-y-2 pl-6">
							<DetailRow
								label="Regular Pay"
								value={formatPesoCurrency(record.regularHoursPay)}
							/>
							<DetailRow
								label="Regular OT Pay"
								value={formatPesoCurrency(record.overtimePay)}
							/>
							<DetailRow
								label="Sunday Pay"
								value={formatPesoCurrency(record.sundayPay)}
							/>
							<Separator className="my-2" />
							<DetailRow
								label="Total Pay"
								value={formatPesoCurrency(record.totalPay)}
								highlight
							/>
						</div>
					</div>

					<Separator />

					{/* Daily Records Count */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Calendar className="h-4 w-4 text-muted-foreground" />
							<h3 className="font-semibold text-sm">Daily Records</h3>
						</div>
						<div className="space-y-2 pl-6">
							<DetailRow
								label="Number of Entries"
								value={record.details?.length || 0}
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
