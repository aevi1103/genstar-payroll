"use client";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

export const CurrentTime = () => {
	const [now, setNow] = useState(dayjs());
	const [mounted, setMounted] = useState<boolean>(false);

	useEffect(() => {
		setMounted(true);
		const interval = setInterval(() => {
			setNow(dayjs());
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	// Delay rendering until after mount to avoid SSR/client time drift hydration mismatches.
	if (!mounted) {
		return <span suppressHydrationWarning>--/--/---- --:--:-- --</span>;
	}

	return (
		<span suppressHydrationWarning>{now.format("MM/DD/YYYY hh:mm:ss A")}</span>
	);
};
