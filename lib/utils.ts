import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const shortDateFormat = "MM/DD/YYYY";

export const formatCurrency = (value: number | null) => {
	if (value === null || value === undefined) {
		return "";
	}
	return Intl.NumberFormat("en-PH", {
		style: "currency",
		currency: "PHP",
	}).format(value);
};
