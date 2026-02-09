import { render } from "@react-email/components";
import PayrollEmail from "@/emails/payroll-email";
import type { WeeklySummaryDataSource } from "@/features/weekly-history/hooks/use-weekly-summary";
import { sendEmail } from "./send-email";

export const sendPayrollEmail = async (body: WeeklySummaryDataSource) => {
	const period = `${body.weekStart} to ${body.weekEnd}`;
	const subject = `Genstar Payroll: ${period}`;

	const emailHtml = await render(<PayrollEmail {...body} />);

	// Send test email
	const result = await sendEmail({
		to: body.userInfo.email || "aevirontos@gmail.com",
		subject,
		html: emailHtml,
	});

	return result.success;
};
