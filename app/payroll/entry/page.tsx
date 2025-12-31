"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { clockInOut } from "./actions";

export default function PayrollEntryPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [status, setStatus] = useState<string>("Initializing...");

	useEffect(() => {
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
				setIsLoading(false);
			}
		};

		handleClockInOut();
	}, []);

	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="space-y-4 text-center">
				<div className="flex justify-center">
					<Spinner />
				</div>
				<div className="space-y-2">
					<p className="text-lg font-semibold text-white">{status}</p>
					<p className="text-sm text-slate-300">Please wait...</p>
				</div>
			</div>
		</div>
	);
}
