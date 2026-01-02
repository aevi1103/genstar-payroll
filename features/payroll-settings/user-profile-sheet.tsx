"use client";
import React from "react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	User,
	Mail,
	Phone,
	MapPin,
	Briefcase,
	Calendar,
	Shield,
	AlertCircle,
	DollarSign,
} from "lucide-react";
import { useUserProfileStore } from "@/lib/stores/use-user-profile-store";
import { usePhoneFormatter } from "@/hooks/use-phone-formatter";
import dayjs from "dayjs";

export const UserProfileSheet = () => {
	const { formatPhone } = usePhoneFormatter();
	const open = useUserProfileStore((state) => state.isSheetOpen);
	const openSheet = useUserProfileStore((state) => state.openSheet);
	const closeSheet = useUserProfileStore((state) => state.closeSheet);
	const user = useUserProfileStore((state) => state.user);
	const setUser = useUserProfileStore((state) => state.setUser);

	if (!user) return null;

	const formatDate = (date: Date | string | null | undefined) => {
		return date ? dayjs(date).format("MMM DD, YYYY") : "N/A";
	};

	const formatCurrency = (value: number | null | undefined) => {
		if (!value) return "₱0.00";
		return new Intl.NumberFormat("en-PH", {
			style: "currency",
			currency: "PHP",
		}).format(value);
	};

	const getRoleBadge = () => {
		const role = user.role?.role;
		if (role === "admin") {
			return <Badge variant="default">Admin</Badge>;
		}
		return <Badge variant="secondary">User</Badge>;
	};

	const getStatusBadge = () => {
		const isActive = user.profile?.active;
		if (isActive) {
			return <Badge variant="default">Active</Badge>;
		}
		return <Badge variant="destructive">Inactive</Badge>;
	};

	return (
		<Sheet
			open={open}
			onOpenChange={(isOpen) => {
				if (isOpen) {
					openSheet();
				} else {
					closeSheet();
					setUser(undefined);
				}
			}}
		>
			<SheetContent className="overflow-y-auto w-full sm:max-w-xl">
				<SheetHeader>
					<SheetTitle className="flex items-center gap-2">
						<span>User Profile Details</span>
						{getRoleBadge()}
						{getStatusBadge()}
					</SheetTitle>
					<SheetDescription>
						Complete profile information for this user
					</SheetDescription>
				</SheetHeader>

				<div className="m-6 mt-2 space-y-6">
					{/* Account Information */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Mail className="h-4 w-4 text-muted-foreground" />
							<h3 className="font-semibold">Account Information</h3>
						</div>
						<div className="space-y-2 pl-6">
							<DetailRow label="Email" value={user.email || "N/A"} />
							<DetailRow label="User ID" value={user.id || "N/A"} />
							<DetailRow
								label="Role"
								value={user.role?.role || "N/A"}
								highlight
							/>
						</div>
					</div>

					<Separator />

					{/* Personal Information */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<User className="h-4 w-4 text-muted-foreground" />
							<h3 className="font-semibold">Personal Information</h3>
						</div>
						<div className="space-y-2 pl-6">
							<DetailRow
								label="First Name"
								value={user.profile?.first_name || "N/A"}
							/>
							<DetailRow
								label="Middle Name"
								value={user.profile?.middle_name || "N/A"}
							/>
							<DetailRow
								label="Last Name"
								value={user.profile?.last_name || "N/A"}
							/>
							<DetailRow
								label="Phone"
								value={formatPhone(user.profile?.phone)}
							/>
							<DetailRow
								label="Address"
								value={user.profile?.address || "N/A"}
							/>
						</div>
					</div>

					<Separator />

					{/* Employment Information */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Briefcase className="h-4 w-4 text-muted-foreground" />
							<h3 className="font-semibold">Employment Information</h3>
						</div>
						<div className="space-y-2 pl-6">
							<DetailRow
								label="Position"
								value={user.profile?.position || "N/A"}
							/>
							<DetailRow
								label="Employment Role"
								value={user.profile?.employment_role || "N/A"}
							/>
							<DetailRow
								label="Hire Date"
								value={formatDate(user.profile?.hire_date)}
							/>
							<DetailRow
								label="Status"
								value={user.profile?.active ? "Active" : "Inactive"}
								highlight
							/>
						</div>
					</div>

					<Separator />

					{/* Salary Information */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<DollarSign className="h-4 w-4 text-muted-foreground" />
							<h3 className="font-semibold">Salary Information</h3>
						</div>
						<div className="space-y-2 pl-6">
							<DetailRow
								label="Salary Per Day"
								value={formatCurrency(user.salary?.salary_per_day)}
								highlight
							/>
							{user.salary?.created_at && (
								<DetailRow
									label="Salary Set On"
									value={formatDate(user.salary.created_at)}
								/>
							)}
							{user.salary?.modified_at && (
								<DetailRow
									label="Last Modified"
									value={formatDate(user.salary.modified_at)}
								/>
							)}
						</div>
					</div>

					<Separator />

					{/* Emergency Contact */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<AlertCircle className="h-4 w-4 text-muted-foreground" />
							<h3 className="font-semibold">Emergency Contact</h3>
						</div>
						<div className="space-y-2 pl-6">
							<DetailRow
								label="Contact Person"
								value={user.profile?.emergency_contact_person || "N/A"}
							/>
							<DetailRow
								label="Contact Number"
								value={formatPhone(user.profile?.emergency_contact_number)}
							/>
							<DetailRow
								label="Relationship"
								value={user.profile?.emergency_concat_relationship || "N/A"}
							/>
							<DetailRow
								label="Contact Address"
								value={user.profile?.emergency_contact_address || "N/A"}
							/>
						</div>
					</div>

					<Separator />

					{/* Timestamps */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Calendar className="h-4 w-4 text-muted-foreground" />
							<h3 className="font-semibold">Record Information</h3>
						</div>
						<div className="space-y-2 pl-6">
							<DetailRow
								label="Profile Created"
								value={formatDate(user.profile?.created_at)}
							/>
							<DetailRow
								label="Profile Updated"
								value={formatDate(user.profile?.updated_at)}
							/>
							<DetailRow
								label="Profile ID"
								value={user.profile?.id?.toString() || "N/A"}
							/>
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};

const DetailRow = ({
	label,
	value,
	highlight = false,
}: {
	label: string;
	value: string | number | null | undefined;
	highlight?: boolean;
}) => (
	<div className="flex justify-between items-center text-sm">
		<span className="text-muted-foreground">{label}:</span>
		<span className={highlight ? "font-semibold" : "font-medium"}>
			{value ?? "N/A"}
		</span>
	</div>
);
