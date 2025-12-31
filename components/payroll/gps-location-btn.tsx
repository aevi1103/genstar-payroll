import type { CustomCellRendererProps } from "ag-grid-react";
import React, { memo } from "react";
import type { DataSource } from "./payroll-history";
import { useLocationDialogStore } from "@/lib/stores/location-dialog-store";

export const GpsLocationBtn = memo(
	({
		params,
		type,
	}: {
		params: CustomCellRendererProps<DataSource>;
		type: "clock_in" | "clock_out";
	}) => {
		const { openDialog } = useLocationDialogStore();

		const value =
			type === "clock_in"
				? params.data?.gps_location
				: params.data?.gps_location_clock_out;

		if (!value) {
			return "N/A";
		}

		if (!value) {
			return "No Location Found";
		}

		const [lat, lng] = value.split(",").map(Number);
		if (Number.isNaN(lat) || Number.isNaN(lng)) {
			return "Invalid Location";
		}

		return (
			<button
				type="button"
				className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
				onClick={() => {
					openDialog(lat, lng);
				}}
			>
				{params.value}
			</button>
		);
	},
);

GpsLocationBtn.displayName = "GpsLocationBtn";
