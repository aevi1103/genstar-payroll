"use client";
import { type IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { useState } from "react";
import { toast } from "sonner";
import { clockInOut } from "@/app/payroll/entry/actions";
import { Spinner } from "@/components/ui/spinner";

export const QrScanner = ({ validUrl }: { validUrl: string }) => {
	const [status, setStatus] = useState<string | undefined>(undefined);

	const handleClockInOut = async () => {
		try {
			if ("geolocation" in navigator) {
				setStatus("Getting your location...");
				navigator.geolocation.getCurrentPosition(
					async (position) => {
						const { latitude, longitude } = position.coords;
						setStatus("Processing clock in/out...");
						await clockInOut(latitude, longitude);
					},
					async (error) => {
						console.warn("Geolocation error:", error);
						setStatus("Processing clock in/out...");
						// Proceed without GPS if permission denied
						await clockInOut();
					},
					{ timeout: 5000 },
				);
			} else {
				// Browser doesn't support geolocation
				setStatus("Processing clock in/out...");
				await clockInOut();
			}
		} catch (error) {
			console.error("Error during clock in/out:", error);
			toast.error("Error during clock in/out");
		}
	};

	const handleScan = async (detectedCodes: IDetectedBarcode[]) => {
		const hasValidUrl = detectedCodes.some(
			(code) => code.rawValue === validUrl,
		);

		if (!hasValidUrl) {
			toast.error("No valid QR code detected");
			return;
		}

		await handleClockInOut();
	};

	if (status) {
		return (
			<div className="text-center flex gap-1 place-items-center w-full">
				<h1 className="font-bold text-3xl">{status}</h1>
				<Spinner />
			</div>
		);
	}

	return (
		<Scanner onScan={handleScan} onError={(error) => console.log(error)} />
	);
};
