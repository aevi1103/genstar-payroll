"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const ROLES = ["admin", "user"] as const;

type Role = (typeof ROLES)[number];

export type UserRow = {
	id: string;
	email: string | null;
	role: Role;
};

type Props = {
	initialUsers: UserRow[];
};

export function UsersTable({ initialUsers }: Props) {
	const [users, setUsers] = useState(initialUsers);
	const [loadingId, setLoadingId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const updateRole = async (userId: string, role: Role) => {
		setLoadingId(userId);
		setError(null);

		try {
			const response = await fetch("/api/admin/users", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userId, role }),
			});

			if (!response.ok) {
				const message = await response.text();
				throw new Error(message || "Failed to update role");
			}

			const { user } = (await response.json()) as { user: UserRow };
			setUsers((prev) =>
				prev.map((u) => (u.id === user.id ? { ...u, role: user.role } : u)),
			);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update role");
		} finally {
			setLoadingId(null);
		}
	};

	return (
		<div className="space-y-4">
			{error && <p className="text-sm text-red-500">{error}</p>}
			<div className="overflow-x-auto rounded-md border border-gray-200">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
								Email
							</th>
							<th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
								Role
							</th>
							<th className="px-4 py-2" />
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 bg-white">
						{users.map((user) => (
							<tr key={user.id}>
								<td className="px-4 py-3 text-sm text-gray-900">
									{user.email}
								</td>
								<td className="px-4 py-3 text-sm text-gray-700">
									<select
										aria-label={`Role for ${user.email}`}
										className="rounded border border-gray-300 px-2 py-1 text-sm"
										value={user.role}
										onChange={(e) =>
											updateRole(user.id, e.target.value as Role)
										}
										disabled={loadingId === user.id}
									>
										{ROLES.map((role) => (
											<option key={role} value={role}>
												{role}
											</option>
										))}
									</select>
								</td>
								<td className="px-4 py-3 text-right text-sm text-gray-500">
									<Button
										variant="outline"
										size="sm"
										onClick={() => updateRole(user.id, user.role)}
										disabled={loadingId === user.id}
									>
										{loadingId === user.id ? "Saving..." : "Save"}
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
