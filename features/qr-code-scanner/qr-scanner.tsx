"use client";
import { type IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { toast } from "sonner";
import { clockInOut } from "@/app/payroll/entry/actions";

export const QrScanner = ({ validUrl }: { validUrl: string }) => {
	const handleClockInOut = async () => {
		try {
			if ("geolocation" in navigator) {
				toast("Getting your location...");
				navigator.geolocation.getCurrentPosition(
					async (position) => {
						const { latitude, longitude } = position.coords;
						toast("Processing clock in/out...");
						await clockInOut(latitude, longitude);
					},
					async (error) => {
						console.warn("Geolocation error:", error);
						toast("Processing clock in/out...");
						// Proceed without GPS if permission denied
						await clockInOut();
					},
					{ timeout: 5000 },
				);
			} else {
				// Browser doesn't support geolocation
				toast("Processing clock in/out...");
				await clockInOut();
			}
		} catch (error) {
			console.error("Error during clock in/out:", error);
		}
	};

	const handleScan = async (detectedCodes: IDetectedBarcode[]) => {
		const hasValidUrl = detectedCodes.some(
			(code) => code.rawValue === validUrl,
		);

		if (!hasValidUrl) {
			toast("Invalid QR code scanned.");
			return;
		}

		await handleClockInOut();
	};

	return (
		<Scanner onScan={handleScan} onError={(error) => console.log(error)} />
	);
};
