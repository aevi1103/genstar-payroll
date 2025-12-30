import type { Metadata } from "next";
import { clockInOut } from "./actions";

export const metadata: Metadata = {
	title: "Payroll Entry",
};

export default async function PayrollEntryPage() {
	await clockInOut();

	return null;
}
