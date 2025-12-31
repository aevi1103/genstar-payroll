import type { CustomCellRendererProps } from "ag-grid-react";
import { memo } from "react";
import { useLocationDialogStore } from "@/lib/stores/location-dialog-store";
import { MapPin } from "lucide-react";
import type { PayrollDataSource } from "@/hooks/use-payroll-history-query";

export const GpsLocationBtn = memo(
	({
		params,
		type,
	}: {
		params: CustomCellRendererProps<PayrollDataSource>;
		type: "clock_in" | "clock_out";
	}) => {
		const { openDialog } = useLocationDialogStore();

		const value =
			type === "clock_in"
				? params.data?.gps_location
				: params.data?.gps_location_clock_out;

		if (!value) {
			return "";
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
				className="text-blue-600 hover:text-blue-800 underline cursor-pointer text-xs flex items-center gap-1"
				onClick={() => {
					openDialog(lat, lng);
				}}
			>
				<span className="text-xs!">
					<MapPin />
				</span>
				View Location
			</button>
		);
	},
);

GpsLocationBtn.displayName = "GpsLocationBtn";
