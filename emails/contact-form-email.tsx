import type React from "react";
import type { ContactFormData } from "@/lib/schemas/contact-form.schema";

interface AdminEmailProps {
	name: string;
	email: string;
	phone: string;
	message: string;
}

export const ContactFormEmail: React.FC<AdminEmailProps> = ({
	name,
	email,
	phone,
	message,
}) => {
	return (
		<div style={{ fontFamily: "Arial, sans-serif", color: "#1f2937" }}>
			{/* Header */}
			<div
				style={{
					backgroundColor: "#047857",
					padding: "24px",
					textAlign: "center" as const,
					borderRadius: "8px",
					marginBottom: "24px",
				}}
			>
				<h1 style={{ color: "white", margin: 0, fontSize: "28px" }}>
					New Contact Form Submission
				</h1>
				<p style={{ color: "#d1fae5", margin: "8px 0 0 0", fontSize: "14px" }}>
					From Genstar Printing Services Website
				</p>
			</div>

			{/* Content */}
			<div style={{ marginBottom: "24px" }}>
				<h2
					style={{ color: "#065f46", fontSize: "18px", marginBottom: "16px" }}
				>
					Contact Information
				</h2>

				<table
					style={{
						width: "100%",
						borderCollapse: "collapse" as const,
					}}
				>
					<tbody>
						<tr>
							<td
								style={{
									padding: "12px",
									backgroundColor: "#f0fdf4",
									borderBottom: "1px solid #d1fae5",
									fontWeight: "600",
									width: "120px",
									color: "#065f46",
								}}
							>
								Name:
							</td>
							<td
								style={{
									padding: "12px",
									backgroundColor: "#f9fce8",
									borderBottom: "1px solid #d1fae5",
									color: "#1f2937",
								}}
							>
								{name}
							</td>
						</tr>
						<tr>
							<td
								style={{
									padding: "12px",
									backgroundColor: "#f0fdf4",
									borderBottom: "1px solid #d1fae5",
									fontWeight: "600",
									color: "#065f46",
								}}
							>
								Email:
							</td>
							<td
								style={{
									padding: "12px",
									backgroundColor: "#f9fce8",
									borderBottom: "1px solid #d1fae5",
									color: "#1f2937",
								}}
							>
								<a
									href={`mailto:${email}`}
									style={{ color: "#047857", textDecoration: "none" }}
								>
									{email}
								</a>
							</td>
						</tr>
						<tr>
							<td
								style={{
									padding: "12px",
									backgroundColor: "#f0fdf4",
									borderBottom: "1px solid #d1fae5",
									fontWeight: "600",
									color: "#065f46",
								}}
							>
								Phone:
							</td>
							<td
								style={{
									padding: "12px",
									backgroundColor: "#f9fce8",
									borderBottom: "1px solid #d1fae5",
									color: "#1f2937",
								}}
							>
								<a
									href={`tel:${phone}`}
									style={{ color: "#047857", textDecoration: "none" }}
								>
									{phone}
								</a>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* Message */}
			<div style={{ marginBottom: "24px" }}>
				<h2
					style={{ color: "#065f46", fontSize: "18px", marginBottom: "16px" }}
				>
					Message
				</h2>
				<div
					style={{
						padding: "16px",
						backgroundColor: "#f0fdf4",
						borderLeft: "4px solid #047857",
						borderRadius: "4px",
						color: "#1f2937",
						lineHeight: "1.6",
						whiteSpace: "pre-wrap" as const,
						wordWrap: "break-word" as const,
					}}
				>
					{message}
				</div>
			</div>

			{/* Footer */}
			<div
				style={{
					borderTop: "1px solid #e5e7eb",
					paddingTop: "24px",
					marginTop: "24px",
					fontSize: "12px",
					color: "#6b7280",
					textAlign: "center" as const,
				}}
			>
				<p style={{ margin: "0 0 8px 0" }}>
					This email was automatically generated from a contact form submission.
				</p>
				<p style={{ margin: "0" }}>
					© {new Date().getFullYear()} Genstar Printing Services. All rights
					reserved.
				</p>
			</div>
		</div>
	);
};

export function generateContactFormEmailHtml(data: ContactFormData): string {
	return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; color: #1f2937; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 16px;">
    <div style="background-color: #047857; padding: 24px; text-align: center; border-radius: 8px; margin-bottom: 24px;">
      <h1 style="color: white; margin: 0; font-size: 28px;">New Contact Form Submission</h1>
      <p style="color: #d1fae5; margin: 8px 0 0 0; font-size: 14px;">From Genstar Printing Services Website</p>
    </div>

    <div style="margin-bottom: 24px;">
      <h2 style="color: #065f46; font-size: 18px; margin-bottom: 16px;">Contact Information</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tbody>
          <tr>
            <td style="padding: 12px; background-color: #f0fdf4; border-bottom: 1px solid #d1fae5; font-weight: 600; width: 120px; color: #065f46;">Name:</td>
            <td style="padding: 12px; background-color: #f9fce8; border-bottom: 1px solid #d1fae5; color: #1f2937;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 12px; background-color: #f0fdf4; border-bottom: 1px solid #d1fae5; font-weight: 600; color: #065f46;">Email:</td>
            <td style="padding: 12px; background-color: #f9fce8; border-bottom: 1px solid #d1fae5; color: #1f2937;"><a href="mailto:${data.email}" style="color: #047857; text-decoration: none;">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 12px; background-color: #f0fdf4; border-bottom: 1px solid #d1fae5; font-weight: 600; color: #065f46;">Phone:</td>
            <td style="padding: 12px; background-color: #f9fce8; border-bottom: 1px solid #d1fae5; color: #1f2937;"><a href="tel:${data.phone}" style="color: #047857; text-decoration: none;">${data.phone}</a></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="margin-bottom: 24px;">
      <h2 style="color: #065f46; font-size: 18px; margin-bottom: 16px;">Message</h2>
      <div style="padding: 16px; background-color: #f0fdf4; border-left: 4px solid #047857; border-radius: 4px; color: #1f2937; line-height: 1.6; white-space: pre-wrap; word-wrap: break-word;">
        ${data.message}
      </div>
    </div>

    <div style="border-top: 1px solid #e5e7eb; padding-top: 24px; margin-top: 24px; font-size: 12px; color: #6b7280; text-align: center;">
      <p style="margin: 0 0 8px 0;">This email was automatically generated from a contact form submission.</p>
      <p style="margin: 0;">© ${new Date().getFullYear()} Genstar Printing Services. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Customer Confirmation Email - sent to the form submitter
 */
export function generateCustomerConfirmationEmailHtml(
	name: string,
	genstarEmail: string = process.env.GENSTAR_EMAIL || "",
): string {
	return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; color: #1f2937; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 16px;">
    <div style="background-color: #047857; padding: 24px; text-align: center; border-radius: 8px; margin-bottom: 24px;">
      <h1 style="color: white; margin: 0; font-size: 28px;">We Received Your Inquiry</h1>
      <p style="color: #d1fae5; margin: 8px 0 0 0; font-size: 14px;">Genstar Printing Services</p>
    </div>

    <div style="margin-bottom: 24px;">
      <p style="font-size: 16px; color: #1f2937; margin: 0 0 16px 0;">
        Hi <strong>${name}</strong>,
      </p>
      <p style="font-size: 14px; color: #4b5563; line-height: 1.6; margin: 0 0 16px 0;">
        Thank you for reaching out to Genstar Printing Services. We have received your inquiry and appreciate you taking the time to contact us.
      </p>
      <p style="font-size: 14px; color: #4b5563; line-height: 1.6; margin: 0 0 16px 0;">
        Our team will review your message and get back to you as soon as possible. We aim to respond within 24 business hours.
      </p>
    </div>

    <div style="background-color: #f0fdf4; padding: 16px; border-left: 4px solid #047857; border-radius: 4px; margin-bottom: 24px;">
      <h3 style="color: #065f46; margin: 0 0 8px 0; font-size: 14px;">Contact Information</h3>
      <p style="font-size: 13px; color: #1f2937; margin: 4px 0;">
        <strong>Email:</strong> <a href="mailto:${genstarEmail}" style="color: #047857; text-decoration: none;">${genstarEmail}</a>
      </p>
      <p style="font-size: 13px; color: #1f2937; margin: 4px 0;">
        <strong>Phone:</strong> <a href="tel:+639157365273" style="color: #047857; text-decoration: none;">09157365273</a> (Cell) | 89294482 (Landline)
      </p>
      <p style="font-size: 13px; color: #1f2937; margin: 4px 0;">
        <strong>Address:</strong> #97 General Avenue Near Corner Tandang Sora Avenue, Project 8 Quezon City
      </p>
    </div>

    <div style="margin-bottom: 24px;">
      <p style="font-size: 14px; color: #4b5563; line-height: 1.6; margin: 0;">
        If you have any urgent matters, feel free to call us directly. We look forward to working with you!
      </p>
    </div>

    <div style="border-top: 1px solid #e5e7eb; padding-top: 24px; margin-top: 24px; font-size: 12px; color: #6b7280; text-align: center;">
      <p style="margin: 0 0 8px 0;">This is an automated confirmation email.</p>
      <p style="margin: 0;">© ${new Date().getFullYear()} Genstar Printing Services. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}
