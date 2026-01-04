"use server";

import { prisma } from "@/prisma/client";
import { sendEmail } from "@/lib/email/send-email";
import {
	contactFormSchema,
	type ContactFormData,
} from "@/lib/schemas/contact-form.schema";
import {
	generateContactFormEmailHtml,
	generateCustomerConfirmationEmailHtml,
} from "@/emails/contact-form-email";

interface ContactFormResponse {
	success: boolean;
	message: string;
	error?: string;
}

export async function submitContactForm(
	data: ContactFormData,
): Promise<ContactFormResponse> {
	try {
		// Validate input
		const validatedData = contactFormSchema.parse(data);

		// Save to database
		const contactFormEntry = await prisma.contact_form.create({
			data: {
				name: validatedData.name,
				email: validatedData.email,
				phone: validatedData.phone,
				message: validatedData.message,
				email_sent: false,
			},
		});

		// Generate admin inquiry email HTML
		const adminEmailHtml = generateContactFormEmailHtml(validatedData);

		// Send email to admin
		const adminEmailResult = await sendEmail({
			to: process.env.GENSTAR_EMAIL || "",
			subject: `New Contact Form Submission from ${validatedData.name}`,
			html: adminEmailHtml,
		});

		// Generate customer confirmation email HTML
		const genstarEmail = process.env.GENSTAR_EMAIL || "";
		const customerEmailHtml = generateCustomerConfirmationEmailHtml(
			validatedData.name,
			genstarEmail,
		);

		// Send confirmation email to customer
		const customerEmailResult = await sendEmail({
			to: validatedData.email,
			subject: "We Received Your Inquiry - Genstar Printing Services",
			html: customerEmailHtml,
		});

		// Update database with email status
		const bothEmailsSent =
			adminEmailResult.success && customerEmailResult.success;

		if (bothEmailsSent) {
			await prisma.contact_form.update({
				where: { id: contactFormEntry.id },
				data: {
					email_sent: true,
					email_response: "Both admin and customer confirmation emails sent",
				},
			});

			return {
				success: true,
				message:
					"Your message has been sent successfully. We will get back to you soon!",
			};
		}

		// At least one email failed
		await prisma.contact_form.update({
			where: { id: contactFormEntry.id },
			data: {
				email_sent: adminEmailResult.success,
				email_response: `Admin: ${adminEmailResult.success ? "✓" : "✗"} | Customer: ${customerEmailResult.success ? "✓" : "✗"}`,
			},
		});

		return {
			success: true,
			message:
				"Your message has been saved. We will contact you shortly to confirm.",
			error:
				!adminEmailResult.success || !customerEmailResult.success
					? "Email delivery had an issue, but we have your information."
					: undefined,
		};
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred";

		console.error("Contact form submission error:", errorMessage);

		return {
			success: false,
			message: "Failed to submit your message. Please try again.",
			error: errorMessage,
		};
	}
}
