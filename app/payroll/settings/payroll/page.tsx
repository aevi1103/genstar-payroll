import React from "react";
import { getPayrollSettings } from "./actions";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { SettingsForm } from "@/features/payroll-settings/settings-form";

export default async function Page() {
	const data = await getPayrollSettings();

	if (data.success === false) {
		return (
			<Alert variant="destructive">
				<AlertCircleIcon />
				<AlertTitle>Unauthorized</AlertTitle>
				<AlertDescription>
					<p>You do not have permission to view this page.</p>
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<p className="text-muted-foreground mt-2">
					Configure payroll parameters for your organization
				</p>
			</div>
			<div className="rounded-lg border p-6 bg-card">
				<SettingsForm initialData={data.data || null} />
			</div>
		</div>
	);
}
