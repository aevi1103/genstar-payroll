import { sendEmail, verifyEmailConnection } from "@/lib/email/send-email";
import { type NextRequest, NextResponse } from "next/server";

/**
 * POST /api/email/test
 * Test email sending with optional custom parameters
 */
export async function POST(request: NextRequest) {
	try {
		// Verify email connection first
		const isConnected = await verifyEmailConnection();
		if (!isConnected) {
			return NextResponse.json(
				{
					success: false,
					error: "Failed to connect to email service",
				},
				{ status: 500 },
			);
		}

		// Parse request body for custom email parameters
		const body = await request.json().catch(() => ({}));
		const {
			to = "aevirontos@gmail.com",
			subject = "Test Email from Genstar Payroll",
			html = getDefaultTestEmailHTML(),
		} = body;

		// Send test email
		const result = await sendEmail({
			to,
			subject,
			html,
		});

		if (result.success) {
			console.log("Email sent successfully to:", to); // --- IGNORE ---

			return NextResponse.json(
				{
					success: true,
					message: "Email sent successfully",
					messageId: result.messageId,
					details: {
						to,
						subject,
					},
				},
				{ status: 200 },
			);
		}
		return NextResponse.json(
			{
				success: false,
				error: result.error,
			},
			{ status: 500 },
		);
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred";

		console.error("❌ Email test endpoint error:", errorMessage);

		return NextResponse.json(
			{
				success: false,
				error: errorMessage,
			},
			{ status: 500 },
		);
	}
}

/**
 * GET /api/email/test
 * Return test email HTML template and usage instructions
 */
export async function GET() {
	return NextResponse.json({
		message: "Email Test Endpoint",
		instructions: "Send a POST request to test email functionality",
		usage: {
			method: "POST",
			endpoint: "/api/email/test",
			body: {
				to: "recipient@example.com (optional)",
				subject: "Custom subject (optional)",
				html: "Custom HTML content (optional)",
			},
			examples: [
				{
					description: "Send test email to default address (EMAIL_USER)",
					curl: 'curl -X POST http://localhost:3000/api/email/test -H "Content-Type: application/json"',
				},
				{
					description: "Send to custom recipient",
					curl: 'curl -X POST http://localhost:3000/api/email/test -H "Content-Type: application/json" -d \'{"to":"user@example.com"}\'',
				},
				{
					description: "Send with custom subject and HTML",
					curl: 'curl -X POST http://localhost:3000/api/email/test -H "Content-Type: application/json" -d \'{"to":"user@example.com","subject":"Custom","html":"<h1>Hello</h1>"}\'',
				},
			],
		},
	});
}

/**
 * Default test email HTML template
 */
function getDefaultTestEmailHTML(): string {
	return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            color: #333;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .content {
            padding: 20px;
            background: white;
          }
          .footer {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 0 0 8px 8px;
            font-size: 12px;
            text-align: center;
            color: #666;
          }
          .status {
            background: #4caf50;
            color: white;
            padding: 10px;
            border-radius: 4px;
            text-align: center;
            margin: 10px 0;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Genstar Payroll Email Service</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>This is a test email from the <strong>Genstar Payroll</strong> email service.</p>
            
            <div class="status">✅ Email Service is Working!</div>
            
            <p>Your email configuration is set up correctly and emails can be sent successfully.</p>
            
            <h3>What's Next?</h3>
            <ul>
              <li>Update the email templates with your branding</li>
              <li>Integrate with your application workflows</li>
              <li>Set up email notifications for payroll events</li>
              <li>Configure automatic reports and summaries</li>
            </ul>
            
            <p>If you have any questions, please contact the development team.</p>
          </div>
          <div class="footer">
            <p>© 2025 Genstar Payroll. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
