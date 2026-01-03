import { prisma } from "@/prisma/client";
import type { Prisma } from "@prisma/client";
import type dayjs from "dayjs";

export const createPayrollEntry = async ({
	userId,
	clockIn,
	clockOut,
	date,
	clockOutDate,
	gpsLocationClockIn,
	gpsLocationClockOut,
	session,
	weeklyPayrollId,
}: {
	userId: string;
	clockIn: dayjs.Dayjs;
	clockOut: dayjs.Dayjs | null;
	date: Date;
	clockOutDate: Date | null;
	gpsLocationClockIn: string | null;
	gpsLocationClockOut: string | null;
	session: { user: { email?: string } };
	weeklyPayrollId: number;
}) => {
	const res = await prisma.payroll.create({
		data: {
			users: {
				connect: { id: userId },
			},
			clock_in_time: clockIn.toDate(),
			original_clock_in_time: clockIn.toDate(),
			clock_in_date: date,
			clock_out_time: clockOut ? clockOut.toDate() : undefined,
			clock_out_date: clockOutDate ? clockOutDate : undefined,
			gps_location: gpsLocationClockIn,
			gps_location_clock_out: gpsLocationClockOut
				? gpsLocationClockOut
				: undefined,
			user_weekly_payroll: {
				connect: { id: weeklyPayrollId },
			},
			is_manual: true,
			created_by: session.user.email || "system",
		},
	});

	return res;
};

export type CreatePayrollEntryReturn = Prisma.PromiseReturnType<
	typeof createPayrollEntry
>;
