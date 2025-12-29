import { clockInOut } from "./actions";

export default async function PayrollEntryPage() {
	await clockInOut();

	return null;
}
