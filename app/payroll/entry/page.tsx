"use client";

import { clockInOut } from "./actions";
import { useEffect } from "react";

export default function PayrollEntryPage() {
	useEffect(() => {
		const clientTime = new Date();
		clockInOut(clientTime);
	}, []);

	return null;
}
