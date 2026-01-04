import type { WeeklySummaryDataSource } from "@/features/weekly-history/hooks/use-weekly-summary";
import { formatPesoCurrency } from "@/lib/utils";

import {
	Body,
	Column,
	Container,
	Font,
	Head,
	Heading,
	Hr,
	Html,
	Preview,
	Row,
	Section,
	Tailwind,
	pixelBasedPreset,
	Text,
	Img,
} from "@react-email/components";

import dayjs from "dayjs";
// import { tailwindConfig } from "./tailwind-config";

const dateFormat = "MMM DD, YYYY";

const formatDecimalValue = (value: number | null | undefined) => {
	if (value === null || value === undefined) return "0.00";
	return value.toFixed(2);
};

const logoUrl =
	"https://bihxozpwhygikyndwhax.supabase.co/storage/v1/object/sign/genstar/genstar%20logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81OTdkYzgyYi1jOWIxLTQ1MWItYjhmOS05MDE3ZDFmMzliZDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnZW5zdGFyL2dlbnN0YXIgbG9nby5wbmciLCJpYXQiOjE3Njc1MTE5OTcsImV4cCI6MTkyNTE5MTk5N30.iG_EhsYHGgCOkHLJe6vvfmStdgkgdL7dj4-04aGZosI";

export const PayrollEmail = (data: WeeklySummaryDataSource) => {
	const weekPeriod = `${dayjs(data.weekStart).format(dateFormat)} - ${dayjs(data.weekEnd).format(dateFormat)}`;

	return (
		<Html lang="en" dir="ltr">
			<Head>
				<Font
					fontFamily="Roboto"
					fallbackFontFamily="Verdana"
					fontStyle="normal"
					fontWeight={400}
					webFont={{
						url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
						format: "woff2",
					}}
				/>
			</Head>
			<Preview>Your Weekly Payroll Summary - {weekPeriod}</Preview>
			<Tailwind config={pixelBasedPreset}>
				<Body className="bg-gray-50">
					<Container className="max-w-2xl mx-auto bg-white">
						{/* Header with Logo */}
						<Section className="bg-emerald-50 px-6 py-8 text-center">
							<Row>
								<Column>
									<Img
										src={logoUrl}
										alt="GenStar Logo"
										width="250"
										height="80"
										className="mx-auto mb-4"
									/>

									<Text className="m-0 mt-2 text-base font-medium text-emerald-700">
										Weekly Payroll Summary
									</Text>
								</Column>
							</Row>
						</Section>

						{/* Employee Information Card */}
						<Section className="border-b border-gray-200 px-6 py-6">
							<Heading className="m-0 mb-4 text-lg font-bold text-gray-900">
								Employee Information
							</Heading>
							<Row>
								<Column>
									<Text className="m-0 text-xs text-gray-600">Name</Text>
									<Text className="m-0 mb-4 text-base font-semibold text-gray-900">
										{data.userInfo.name || "N/A"}
									</Text>
									<Text className="m-0 text-xs text-gray-600">Period</Text>
									<Text className="m-0 text-base font-semibold text-gray-900">
										{weekPeriod}
									</Text>
								</Column>
								<Column>
									<Text className="m-0 text-xs text-gray-600">Employee ID</Text>
									<Text className="m-0 mb-4 text-base font-semibold text-gray-900">
										{data.userInfo.email || "N/A"}
									</Text>
									<Text className="m-0 text-xs text-gray-600">Days Worked</Text>
									<Text className="m-0 text-base font-semibold text-gray-900">
										{data.daysWorked}
									</Text>
								</Column>
							</Row>
						</Section>

						{/* Work Hours Section */}
						<Section className="border-b border-gray-200 px-6 py-6">
							<Heading className="m-0 mb-4 text-lg font-bold text-gray-900">
								Working Hours
							</Heading>
							<table className="w-full">
								<tbody>
									<tr className="border-b border-gray-100">
										<td className="py-3 text-xs text-gray-500">
											Regular Hours
										</td>
										<td className="py-3 text-right text-sm font-semibold text-gray-900">
											{formatDecimalValue(data.hoursInfo?.totalRegularHours)}{" "}
											hrs
										</td>
									</tr>
									<tr className="border-b border-gray-100">
										<td className="py-3 text-xs text-gray-500">
											Overtime (Regular)
										</td>
										<td className="py-3 text-right text-sm font-semibold text-gray-900">
											{formatDecimalValue(
												data.hoursInfo?.totalRegularOvertimeHours,
											)}{" "}
											hrs
										</td>
									</tr>

									<tr className="border-b border-gray-100">
										<td className="py-3 text-xs text-gray-500">Sunday Hours</td>
										<td className="py-3 text-right text-sm font-semibold text-gray-900">
											{formatDecimalValue(data.hoursInfo?.sundayHours)} hrs
										</td>
									</tr>

									<tr className="bg-gray-50">
										<td className="py-3 text-sm font-bold text-gray-900">
											Total Hours
										</td>
										<td className="py-3 text-right text-base font-bold text-emerald-700">
											{formatDecimalValue(data.hoursInfo?.totalHours)} hrs
										</td>
									</tr>
								</tbody>
							</table>
						</Section>

						{/* Earnings Section */}
						<Section className="border-b border-gray-200 px-6 py-6">
							<Heading className="m-0 mb-4 text-lg font-bold text-gray-900">
								Earnings Breakdown
							</Heading>
							<table className="w-full">
								<tbody>
									<tr className="border-b border-gray-100">
										<td className="py-3 text-xs text-gray-500">
											Salary Per Hour
										</td>
										<td className="py-3 text-right text-sm font-semibold text-gray-900">
											{formatPesoCurrency(data.salaryInfo?.salaryPerHour)}
										</td>
									</tr>

									<tr className="border-b border-gray-100">
										<td className="py-3 text-xs text-gray-500">Regular Pay</td>
										<td className="py-3 text-right text-sm font-semibold text-gray-900">
											{formatPesoCurrency(data.paymentInfo?.regularHoursPay)}
										</td>
									</tr>

									<tr className="border-b border-gray-100">
										<td className="py-3 text-xs text-gray-500">
											Regular OT Pay
										</td>
										<td className="py-3 text-right text-sm font-semibold text-gray-900">
											{formatPesoCurrency(data.paymentInfo?.overtimePay)}
										</td>
									</tr>

									<tr className="border-b border-gray-100">
										<td className="py-3 text-xs text-gray-500">Sunday Pay</td>
										<td className="py-3 text-right text-sm font-semibold text-gray-900">
											{formatPesoCurrency(data.paymentInfo?.sundayPay)}
										</td>
									</tr>

									<tr className="bg-blue-50">
										<td className="py-3 text-sm font-bold text-gray-900">
											Gross Salary
										</td>
										<td className="py-3 text-right text-base font-bold text-blue-700">
											{formatPesoCurrency(data.paymentInfo?.grossSalary)}
										</td>
									</tr>
								</tbody>
							</table>
						</Section>

						{/* Deductions Section */}
						<Section className="border-b border-gray-200 px-6 py-6">
							<Heading className="m-0 mb-4 text-lg font-bold text-gray-900">
								Deductions Breakdown
							</Heading>
							<table className="w-full">
								<tbody>
									<tr className="border-b border-gray-100">
										<td className="py-3 text-xs text-gray-500">SSS</td>
										<td className="py-3 text-right text-sm font-semibold text-gray-900">
											({formatPesoCurrency(data.deductions?.weeklySss)})
										</td>
									</tr>

									<tr className="border-b border-gray-100">
										<td className="py-3 text-xs text-gray-500">Pag-IBIG</td>
										<td className="py-3 text-right text-sm font-semibold text-gray-900">
											({formatPesoCurrency(data.deductions?.weeklyPagIbig)})
										</td>
									</tr>

									<tr className="border-b border-gray-100">
										<td className="py-3 text-xs text-gray-500">
											Cash Advance Deduction
										</td>
										<td className="py-3 text-right text-sm font-semibold text-gray-900">
											(
											{formatPesoCurrency(
												data.deductions?.weeklyCashAdvanceDeduction,
											)}
											)
										</td>
									</tr>

									<tr className="bg-red-50">
										<td className="py-3 text-sm font-bold text-gray-900">
											Total Deductions
										</td>
										<td className="py-3 text-right text-base font-bold text-red-700">
											({formatPesoCurrency(data.paymentInfo?.totalDeductions)})
										</td>
									</tr>
								</tbody>
							</table>
						</Section>

						{/* Net Payment Section */}
						<Section className="bg-green-50 border-b border-green-200 px-6 py-8">
							<Row>
								<Column>
									<Heading className="m-0 mb-2 text-lg font-bold text-green-900">
										Net Payable Amount
									</Heading>
									<Text className="m-0 text-4xl font-bold text-green-700">
										{formatPesoCurrency(data.paymentInfo?.netSalary)}
									</Text>

									{data.deductions?.remainingCashAdvanceBalance !== null &&
										data.deductions?.remainingCashAdvanceBalance !==
											undefined &&
										data.deductions?.remainingCashAdvanceBalance > 0 && (
											<Text className="m-0 mt-2 text-xs text-green-700">
												Remaining Cash Advance Balance:{" "}
												<span className="font-bold">
													{formatPesoCurrency(
														data.deductions?.remainingCashAdvanceBalance,
													)}
												</span>
											</Text>
										)}
								</Column>
							</Row>
						</Section>

						{/* Payment Status */}
						<Section className="border-b border-gray-200 px-6 py-4">
							<Row>
								<Column>
									<Text className="m-0 text-xs text-gray-500">
										Payment Status
									</Text>
									<Text className="m-0 mt-1 font-semibold">
										{data.paidInfo?.isPaid ? (
											<span className="text-emerald-700">✓ Paid</span>
										) : (
											<span className="text-orange-500">⏳ Pending</span>
										)}
									</Text>
									{data.paidInfo?.isPaid && data.paidInfo?.paidAt && (
										<Text className="m-0 mt-2 text-xs text-gray-500">
											Paid on:{" "}
											<span className="font-bold text-gray-900">
												{dayjs(data.paidInfo?.paidAt).format(dateFormat)}
											</span>
										</Text>
									)}
								</Column>
							</Row>
						</Section>

						{/* Footer */}
						<Section className="bg-gray-800 px-6 py-6 text-center">
							<Text className="m-0 text-xs text-gray-400">
								GenStar Printing Services
							</Text>
							<Text className="m-0 mt-2 text-xs text-gray-500">
								This is an automated payroll email. Please do not reply to this
								message.
							</Text>
							<Text className="m-0 mt-3 text-xs text-gray-500">
								For inquiries, contact your administrator.
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default PayrollEmail;

PayrollEmail.PreviewProps = {
	recordKey: "Jan 01, 2026___Jan 07, 2026___user-123",
	numberOfActiveRecords: 0,
	daysWorked: 5,
	weekStart: "2026-01-01",
	weekEnd: "2026-01-07",
	userId: "user-123",
	userWeeklyId: BigInt(1),
	otMultipliers: {
		regularOtMultiplier: 1.25,
		sundayMultiplier: 1.3,
	},
	hoursInfo: {
		totalRegularHours: 40,
		totalLateHours: 1,
		totalLateMinutes: 60,
		totalRegularOvertimeHours: 4,
		totalHours: 39,
		sundayHours: 8,
	},
	userInfo: {
		userId: "user-123",
		email: "john.doe@genstar.com",
		name: "John Doe",
		firstName: "John",
		lastName: "Doe",
	},
	salaryInfo: {
		salaryPerDay: 500,
		salaryPerHour: 62.5,
	},
	paymentInfo: {
		regularHoursPay: 2500,
		overtimePay: 250,
		sundayPay: 520,
		grossSalary: 3270,
		netSalary: 2900,
		totalDeductions: 370,
	},
	paidInfo: {
		isPaid: true,
		paidAt: new Date("2026-01-08"),
		deductions: {
			remainingCashAdvanceBalance: 500,
			weeklyCashAdvance: 200,
			sss: 90,
			pagibig: 100,
		},
	},
	deductions: {
		remainingCashAdvanceBalance: 500,
		weeklyCashAdvanceDeduction: 200,
		weeklySss: 90,
		weeklyPagIbig: 80,
	},
	details: [],
} satisfies WeeklySummaryDataSource;
