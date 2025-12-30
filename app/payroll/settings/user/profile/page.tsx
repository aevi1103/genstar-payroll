import React from "react";
import { getUsers } from "./actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { UsersTable } from "@/components/payroll/users-table";

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

	return <UsersTable data={users.data || []} />;
}
