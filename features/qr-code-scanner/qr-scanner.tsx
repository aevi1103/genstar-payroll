"use client";
import { type IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { useEffect, useEffectEvent, useState } from "react";
import { toast } from "sonner";
import { clockInOut } from "@/app/payroll/entry/actions";

export const QrScanner = ({ validUrl }: { validUrl: string }) => {
	const [status, setStatus] = useState<string>("Initializing...");

	const handleClockInOut = async () => {
		try {
			if ("geolocation" in navigator) {
				setStatus("Getting your location...");
				navigator.geolocation.getCurrentPosition(
					(position) => {
						const { latitude, longitude } = position.coords;
						setStatus("Processing clock in/out...");
						clockInOut(latitude, longitude);
					},
					(error) => {
						console.warn("Geolocation error:", error);
						setStatus("Processing clock in/out...");
						// Proceed without GPS if permission denied
						clockInOut();
					},
					{ timeout: 5000 },
				);
			} else {
				// Browser doesn't support geolocation
				setStatus("Processing clock in/out...");
				clockInOut();
			}
		} catch (error) {
			console.error("Error during clock in/out:", error);
		}
	};

	const notifyStatus = useEffectEvent(() => {
		toast(status);
	});

	useEffect(() => {
		notifyStatus();
	}, []);

	const handleScan = (detectedCodes: IDetectedBarcode[]) => {
		detectedCodes.forEach((code) => {
			console.log(`Format: ${code.format}, Value: ${code.rawValue}`);

			if (code.rawValue === validUrl) {
				handleClockInOut();
				return;
			}
		});
	};

	return (
		<Scanner onScan={handleScan} onError={(error) => console.log(error)} />
	);
};
