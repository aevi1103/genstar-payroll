import React from "react";
import { getUsers } from "./actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { UsersTable } from "@/features/payroll-settings/users-table";
import { UserProfileSheet } from "@/features/payroll-settings/user-profile-sheet";

export default async function Page() {
	const users = await getUsers();

	if (users.success === false) {
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
		<div className="space-y-6 h-full flex flex-col">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">User Management</h1>
				<p className="text-muted-foreground mt-2">
					Manage employee profiles, control active status, and update user
					information.
				</p>
			</div>
			<UsersTable data={users.data || []} />
			<UserProfileSheet />
		</div>
	);
}
