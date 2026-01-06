"use client";

import React, { useState, useEffect } from "react";
import {
	Document,
	Page,
	View,
	Text,
	Image,
	StyleSheet,
	pdf,
} from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import QR from "qrcode";

const styles = StyleSheet.create({
	page: {
		padding: 40,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		minHeight: "100vh",
	},
	container: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
	},
	logo: {
		width: 150,
		height: 50,
		marginBottom: 30,
	},
	qrCodeContainer: {
		marginBottom: 20,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	qrCode: {
		width: 300,
		height: 300,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center" as const,
	},
	text: {
		fontSize: 12,
		textAlign: "center" as const,
		marginBottom: 15,
		lineHeight: 1.5,
		maxWidth: 400,
		color: "#666666",
	},
	warningText: {
		fontSize: 12,
		textAlign: "center" as const,
		marginTop: 15,
		lineHeight: 1.5,
		maxWidth: 400,
		color: "#B45309",
	},
});

interface QrCodePdfDocumentProps {
	qrCodeImage: string;
}

const QrCodePDFDocument = ({ qrCodeImage }: QrCodePdfDocumentProps) => (
	<Document>
		<Page size="A4" style={styles.page}>
			<View style={styles.container}>
				{/* eslint-disable-next-line jsx-a11y/alt-text */}
				<Image src="/logo.png" style={styles.logo} />

				<Text style={styles.title}>Clock In/Out QR Code</Text>

				<View style={styles.qrCodeContainer}>
					{/* eslint-disable-next-line jsx-a11y/alt-text */}
					<Image src={qrCodeImage} style={styles.qrCode} />
				</View>

				<Text style={styles.text}>
					Use your phone to scan this QR code to clock in or out. You will need
					a valid Genstar account—sign in if prompted—and your administrator
					must approve your account before you can proceed.
				</Text>

				<Text style={styles.warningText}>
					Allow GPS location access when prompted to ensure accurate
					timekeeping.
				</Text>
			</View>
		</Page>
	</Document>
);

export const QrCodePdfDownload = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);

	useEffect(() => {
		const generateQRCode = async () => {
			try {
				const url =
					typeof window !== "undefined"
						? new URL("/payroll/entry", window.location.origin).toString()
						: "";

				const dataUrl = await QR.toDataURL(url, {
					errorCorrectionLevel: "H",
					type: "image/png",
					width: 300,
					margin: 2,
					color: {
						dark: "#000000",
						light: "#FFFFFF",
					},
				});

				setQrCodeDataUrl(dataUrl);
			} catch (error) {
				console.error("Failed to generate QR code:", error);
			}
		};

		generateQRCode();
	}, []);

	const handleDownloadPdf = async () => {
		if (!qrCodeDataUrl) return;

		setIsLoading(true);
		try {
			const blob = await pdf(
				<QrCodePDFDocument qrCodeImage={qrCodeDataUrl} />,
			).toBlob();
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = "clock-in-out-qr-code.pdf";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Failed to download PDF:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			onClick={handleDownloadPdf}
			disabled={isLoading || !qrCodeDataUrl}
			className="gap-2"
		>
			<Download className="h-4 w-4" />
			{isLoading ? "Generating PDF..." : "Download PDF"}
		</Button>
	);
};
