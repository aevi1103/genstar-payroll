"use client";

import { useEffect } from "react";
import { clockInOut } from "./actions";

export default function PayrollEntryPage() {
	useEffect(() => {
		const handleClockInOut = async () => {
			try {
				if ("geolocation" in navigator) {
					navigator.geolocation.getCurrentPosition(
						(position) => {
							const { latitude, longitude } = position.coords;
							clockInOut(latitude, longitude);
						},
						(error) => {
							console.warn("Geolocation error:", error);
							// Proceed without GPS if permission denied
							clockInOut();
						},
						{ timeout: 5000 },
					);
				} else {
					// Browser doesn't support geolocation
					clockInOut();
				}
			} catch (error) {
				console.error("Error during clock in/out:", error);
			}
		};

		handleClockInOut();
	}, []);

	return null;
}
