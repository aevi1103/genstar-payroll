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
	UserCheck,
	AlertCircle,
	CircleX,
	Mail,
} from "lucide-react";
import { cn, formatPesoCurrency, serializeData } from "@/lib/utils";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PayUserCashAdvanceRequestBody } from "@/app/api/payroll/paid/route";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { PAYROL_HISTORY_KEY } from "@/hooks/use-payroll-history-query";
import type { WeeklySummaryDataSource } from "./hooks/use-weekly-summary";

const dateFormat = "MMM DD, YYYY";

const formatDate = (date: string | null | undefined) => {
	return date ? dayjs(date).format(dateFormat) : "N/A";
};

const formatWeekPeriod = (start: string, end: string) => {
	return `${dayjs(start).format(dateFormat)} - ${dayjs(end).format(dateFormat)}`;
};

export const WeeklyRecordSheet = ({
	isAdmin,
}: {
	isAdmin: boolean;
}) => {
	const open = useWeeklyPayrollHistoryStore((state) => state.isSheetOpen);
	const openSheet = useWeeklyPayrollHistoryStore((state) => state.openSheet);
	const closeSheet = useWeeklyPayrollHistoryStore((state) => state.closeSheet);
	const record = useWeeklyPayrollHistoryStore((state) => state.record);
	const setRecord = useWeeklyPayrollHistoryStore((state) => state.setRecord);

	const queryClient = useQueryClient();

	const { mutateAsync: sendEmail, isPending: isSendingEmail } = useMutation({
		mutationFn: async (isPaid?: boolean) => {
			if (!record) {
				throw new Error("No record selected");
			}

			const response = await fetch("/api/payroll/send", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(
					serializeData(
						isPaid
							? {
									...record,
									paidInfo: {
										...record.paidInfo,
										isPaid: true,
										paidAt: new Date(),
									},
								}
							: record,
					) satisfies WeeklySummaryDataSource,
				),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to send email");
			}
		},
		onSuccess: () => {
			toast.success("Pay slip email sent successfully");
		},
		onError: (error) => {
			console.error("Error sending pay slip email:", error);
			toast.error(
				error instanceof Error ? error.message : "An unexpected error occurred",
			);
		},
	});

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async () => {
			if (!record) {
				throw new Error("No record selected");
			}

			const response = await fetch("/api/payroll/paid", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: record.userInfo.userId,
					weeklyUserId: record.userWeeklyId.toString(),
					paidCashAdvance: record.deductions?.weeklyCashAdvanceDeduction || 0,
					paidSss: record.deductions?.weeklySss || 0,
					paidPagibig: record.deductions?.weeklyPagIbig || 0,
					remainingCashAdvanceBalance:
						record.deductions?.remainingCashAdvanceBalance || 0,
					remarks: "Marked as paid by admin",
				} satisfies PayUserCashAdvanceRequestBody),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to mark as paid");
			}

			return await response.json();
		},
	});

	const markAsPaid = async () => {
		try {
			await mutateAsync();
			await sendEmail(true);

			queryClient.invalidateQueries({
				queryKey: [PAYROL_HISTORY_KEY],
			});

			toast.success("Weekly payroll marked as paid successfully");

			closeSheet();
			setRecord(undefined);
		} catch (error) {
			console.error("Error marking as paid:", error);
			toast.error(
				error instanceof Error ? error.message : "An unexpected error occurred",
			);
		}
	};

	if (!record) return null;

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
						<span>{record.userInfo.name}</span>
						<Badge variant="default">
							{formatWeekPeriod(record.weekStart, record.weekEnd)}
						</Badge>
					</SheetTitle>
					<SheetDescription>
						Detailed weekly payroll summary for the employee
					</SheetDescription>
				</SheetHeader>

				<div className="m-6 mt-0 space-y-6">
					<Card
						className={cn(
							record.paidInfo.isPaid
								? "from-green-50 to-green-50 border-green-200 hover:border-green-300"
								: "from-gray-50 to-gray-50 border-gray-200 hover:border-gray-300",
							`
					 bg-linear-to-br dark:from-blue-950 dark:to-indigo-950
					   dark:border-gray-800 p-6 shadow-sm hover:shadow-lg 
						hover:-translate-y-1 transition-all ease-in-out`,
						)}
					>
						<div className="space-y-4">
							<div className="flex items-center gap-2 mb-4 justify-between">
								<h3 className="font-bold text-lg">Salary Summary</h3>
								{record.paidInfo.isPaid && (
									<Badge>
										Paid at{" "}
										{record.paidInfo.paidAt
											? new Date(record.paidInfo.paidAt).toLocaleString()
											: "N/A"}
									</Badge>
								)}
							</div>

							<div className="space-y-3">
								<div className="flex justify-between items-center">
									<span className="text-sm ">Gross Salary</span>
									<span className="text-xl font-bold">
										{formatPesoCurrency(record.paymentInfo.grossSalary)}
									</span>
								</div>

								<div className="h-px bg-blue-200 dark:bg-blue-700" />

								<div className="flex justify-between items-center">
									<span className="text-sm text-red-600 dark:text-red-400">
										Total Deductions
									</span>
									<span className="text-lg font-semibold text-red-600 dark:text-red-400">
										-{formatPesoCurrency(record.paymentInfo.totalDeductions)}
									</span>
								</div>

								<div className="h-px bg-blue-200 dark:bg-blue-700" />

								<div className="flex justify-between items-center pt-2">
									<span className="text-sm font-semibold text-green-700 dark:text-green-300">
										Net Salary
									</span>
									<span className="text-2xl font-bold text-green-700 dark:text-green-300">
										{formatPesoCurrency(record.paymentInfo.netSalary)}
									</span>
								</div>
							</div>
						</div>
					</Card>

					{isAdmin &&
						!record.paidInfo.isPaid &&
						record.numberOfActiveRecords === 0 && (
							<Button
								size={"lg"}
								className="w-full cursor-pointer"
								onClick={markAsPaid}
								disabled={record.paidInfo.isPaid || isPending}
							>
								{isPending ? (
									<>
										<Spinner /> Marking as Paid...
									</>
								) : (
									<>
										<UserCheck />
										Mark as Paid
									</>
								)}
							</Button>
						)}

					<Button
						className="w-full cursor-pointer"
						disabled={isSendingEmail}
						onClick={async () => await sendEmail(false)}
					>
						{isSendingEmail ? (
							<>
								<Spinner /> Sending...
							</>
						) : (
							<>
								<Mail />
								Send Pay Slip Email
							</>
						)}
					</Button>

					{record.numberOfActiveRecords > 0 && (
						<>
							<Badge variant="destructive" className="w-full ">
								<span className="whitespace-pre-wrap">
									Cannot mark as paid. There are still{" "}
									{record.numberOfActiveRecords} active records for this user in
									the selected week.
								</span>
							</Badge>

							<ul>
								{record.details
									?.filter((item) => !item.clock_out_time)
									?.map((example) => (
										<li
											key={example.id}
											className="flex items-center gap-2 text-sm text-muted-foreground"
										>
											<CircleX className="h-4 w-4 text-red-500" />
											<span>
												{new Date(example.clock_in_time).toLocaleString()} - No
												Clock Out Recorded
											</span>
										</li>
									))}
							</ul>
						</>
					)}

					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Calendar className="h-4 w-4 text-muted-foreground" />
							<h3 className="font-semibold text-sm">Days Worked</h3>
						</div>
						<div className="space-y-2 pl-6">
							<DetailRow
								label="Number of Entries"
								value={record.details?.length || 0}
							/>
						</div>
					</div>

					<Separator />

					{/* Employee Information */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<User className="h-4 w-4 text-muted-foreground" />
							<h3 className="font-semibold text-sm">Employee Information</h3>
						</div>
						<div className="space-y-2 pl-6">
							<DetailRow label="Name" value={record.userInfo.name || "N/A"} />
							<DetailRow
								label="First Name"
								value={record.userInfo.firstName || "N/A"}
							/>
							<DetailRow
								label="Last Name"
								value={record.userInfo.lastName || "N/A"}
							/>
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
								value={record.daysWorked.toFixed(2)}
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
								value={formatPesoCurrency(record.salaryInfo.salaryPerDay)}
							/>
							<DetailRow
								label="Salary Per Hour"
								value={formatPesoCurrency(record.salaryInfo.salaryPerHour)}
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
								value={`${record.hoursInfo.totalRegularHours.toFixed(2)} hrs`}
							/>
							<DetailRow
								label="Overtime (Regular)"
								value={`${record.hoursInfo.totalRegularOvertimeHours.toFixed(2)} hrs`}
							/>
							<DetailRow
								label="Sunday Hours"
								value={`${record.hoursInfo.sundayHours.toFixed(2)} hrs`}
							/>
							<DetailRow
								label="Late Deduction"
								value={`${record.hoursInfo.totalLateHours.toFixed(2)} hrs (${record.hoursInfo.totalLateMinutes} mins)`}
							/>
							<DetailRow
								label="Net Hours"
								value={`${(record.hoursInfo.totalRegularHours - record.hoursInfo.totalLateHours).toFixed(2)} hrs`}
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
								value={`${(record.otMultipliers.regularOtMultiplier * 100).toFixed(0)}%`}
							/>
							<DetailRow
								label="Sunday OT Rate"
								value={`${(record.otMultipliers.sundayMultiplier * 100).toFixed(0)}%`}
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
								value={formatPesoCurrency(record.paymentInfo.regularHoursPay)}
							/>
							<DetailRow
								label="Regular OT Pay"
								value={formatPesoCurrency(record.paymentInfo.overtimePay)}
							/>
							<DetailRow
								label="Sunday Pay"
								value={formatPesoCurrency(record.paymentInfo.sundayPay)}
							/>
							<Separator className="my-2" />
							<DetailRow
								label="Gross Salary"
								value={formatPesoCurrency(record.paymentInfo.grossSalary)}
								highlight
							/>
						</div>
					</div>
					<Separator />

					{/* Deductions Breakdown */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<AlertCircle className="h-4 w-4 text-muted-foreground" />
							<h3 className="font-semibold text-sm">Deductions Breakdown</h3>
						</div>
						<div className="space-y-4 pl-6">
							{/* Cash Advance */}
							<div className="space-y-2">
								<p className="text-xs font-semibold text-muted-foreground">
									CASH ADVANCE
								</p>
								<DetailRow
									label="Remaining Balance"
									value={formatPesoCurrency(
										record.deductions?.remainingCashAdvanceBalance || 0,
									)}
								/>
								<DetailRow
									label="Weekly Deduction"
									value={formatPesoCurrency(
										record.deductions?.weeklyCashAdvanceDeduction || 0,
									)}
								/>
							</div>

							<Separator className="my-2" />

							{/* Government Contributions */}
							<div className="space-y-2">
								<p className="text-xs font-semibold text-muted-foreground">
									GOVERNMENT CONTRIBUTIONS
								</p>
								<DetailRow
									label="SSS"
									value={formatPesoCurrency(record.deductions?.weeklySss || 0)}
								/>
								<DetailRow
									label="Pag-IBIG"
									value={formatPesoCurrency(
										record.deductions?.weeklyPagIbig || 0,
									)}
								/>
							</div>
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
