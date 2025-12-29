import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getSessionWithRole } from "@/lib/session";

export default async function AccountPage() {
	const { user, role, session } = await getSessionWithRole();

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">Account Settings</h1>
				<p className="text-gray-600">Manage your account information</p>
			</div>

			<div className="grid gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Profile Information</CardTitle>
						<CardDescription>Your personal account details</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<span className="text-sm font-medium text-gray-600">Email</span>
							<p className="mt-1 text-lg">{user.email}</p>
						</div>

						<div>
							<span className="text-sm font-medium text-gray-600">
								Full Name
							</span>
							<p className="mt-1 text-lg">{user?.name || "Not set"}</p>
						</div>

						<div>
							<span className="text-sm font-medium text-gray-600">User ID</span>
							<p className="mt-1 text-sm font-mono text-gray-500">{user.id}</p>
						</div>

						<div>
							<span className="text-sm font-medium text-gray-600">Role</span>
							<p className="mt-1 text-lg capitalize">{role}</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Account Status</CardTitle>
						<CardDescription>
							Your account creation and verification status
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<span className="text-sm font-medium text-gray-600">
								Account Created
							</span>
							<p className="mt-1 text-lg">{new Date().toLocaleDateString()}</p>
						</div>

						<div>
							<span className="text-sm font-medium text-gray-600">
								Email Verified
							</span>
							<p className="mt-1 text-lg">
								{session.user.email_confirmed_at ? "Yes" : "No"}
							</p>
						</div>

						{session.user.email_confirmed_at && (
							<div>
								<span className="text-sm font-medium text-gray-600">
									Verified On
								</span>
								<p className="mt-1 text-lg">
									{new Date(
										session.user.email_confirmed_at,
									).toLocaleDateString()}
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
