"use client";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

export const CurrentTime = () => {
	const [now, setNow] = useState(dayjs());

	useEffect(() => {
		const interval = setInterval(() => {
			setNow(dayjs());
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return <span>{now.format("MM/DD/YYYY hh:mm:ss A")}</span>;
};
