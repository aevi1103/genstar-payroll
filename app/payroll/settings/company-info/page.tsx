import React from "react";
import { getCompanyInfo } from "./actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { CompanyInfoForm } from "@/features/payroll-settings/company-info-form";

export default async function Page() {
	const info = await getCompanyInfo();

	if (info.success === false) {
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
				<h1 className="text-3xl font-bold tracking-tight">
					Company Information
				</h1>
				<p className="text-muted-foreground mt-2">
					Manage your organization&apos;s address, contacts, and coordinates.
				</p>
			</div>
			<div className="rounded-lg border p-6 bg-card">
				<CompanyInfoForm initialData={info.data || null} />
			</div>
		</div>
	);
}
