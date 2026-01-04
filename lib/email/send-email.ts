import nodemailer from "nodemailer";

/**
 * Email service using Google SMTP (Gmail)
 * Requires EMAIL_USER and EMAIL_PASS environment variables
 */

interface EmailOptions {
	to: string | string[];
	subject: string;
	html: string;
	text?: string;
}

interface EmailResponse {
	success: boolean;
	messageId?: string;
	error?: string;
}

let transporter: nodemailer.Transporter | null = null;

/**
 * Initialize the email transporter (singleton pattern)
 */
function getTransporter() {
	if (transporter) {
		return transporter;
	}

	const emailUser = process.env.EMAIL_USER;
	const emailPass = process.env.EMAIL_PASS;

	if (!emailUser || !emailPass) {
		throw new Error(
			"Missing EMAIL_USER or EMAIL_PASS environment variables. Please configure your Google SMTP credentials.",
		);
	}

	transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: emailUser,
			pass: emailPass, // For Gmail: use App Password, not your regular password
		},
		// Optional: For better reliability
		tls: {
			rejectUnauthorized: true,
		},
	});

	return transporter;
}

/**
 * Verify the email connection
 */
export async function verifyEmailConnection(): Promise<boolean> {
	try {
		const transporter = getTransporter();
		await transporter.verify();
		console.log("✅ Email service connected successfully");
		return true;
	} catch (error) {
		console.error("❌ Email service connection failed:", error);
		return false;
	}
}

/**
 * Send email using Gmail SMTP
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResponse> {
	try {
		const transporter = getTransporter();

		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
			subject: options.subject,
			html: options.html,
			text: options.text || "",
		};

		const info = await transporter.sendMail(mailOptions);

		return {
			success: true,
			messageId: info.messageId,
		};
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred";

		console.error("❌ Email sending failed:", errorMessage);

		return {
			success: false,
			error: errorMessage,
		};
	}
}

/**
 * Send email with template-like support
 */
export async function sendTemplateEmail(
	to: string | string[],
	subject: string,
	templateHtml: string,
): Promise<EmailResponse> {
	return sendEmail({
		to,
		subject,
		html: templateHtml,
	});
}
