import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const shortDateFormat = "MM/DD/YYYY";
export const longDateFormat = "MM/DD/YYYY hh:mm A";

export const formatCurrency = (value: number | null) => {
	if (value === null || value === undefined) {
		return "";
	}
	return Intl.NumberFormat("en-PH", {
		style: "currency",
		currency: "PHP",
	}).format(value);
};

export const serializeData = (data: unknown): unknown => {
	return JSON.parse(
		JSON.stringify(data, (_, value) =>
			typeof value === "bigint" ? value.toString() : value,
		),
	);
};
