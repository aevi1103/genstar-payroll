"use client";
import { useState } from "react";
import { TableWrapper } from "../../components/table-wrapper";
import type { User, Users } from "@/app/payroll/settings/user/profile/actions";
import { upsertUserData } from "@/app/payroll/settings/user/profile/actions";
import type {
	ColDef,
	ColGroupDef,
	ISelectCellEditorParams,
	CellValueChangedEvent,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { usePhoneFormatter } from "@/hooks/use-phone-formatter";
import { toast } from "sonner";
import { useUserProfileStore } from "@/lib/stores/use-user-profile-store";

export const UsersTable = ({ data }: { data: Users }) => {
	const { formatPhone } = usePhoneFormatter();
	const openSheet = useUserProfileStore((state) => state.openSheet);
	const setUser = useUserProfileStore((state) => state.setUser);
	const [colDefs] = useState<(ColDef<User> | ColGroupDef<User>)[]>([
		{
			field: "email",
			headerName: "Email",
			initialWidth: 230,
			tooltipValueGetter: () => "Click to view profile",
			cellClass: "text-blue-600 cursor-pointer font-semibold hover:underline",
			onCellClicked: (params) => {
				setUser(params.data);
				openSheet();
			},
		},
		{
			field: "profile.active",
			headerName: "Active",
			editable: true,
			initialWidth: 100,
			cellRenderer: "agCheckboxCellRenderer",

			cellEditor: "agCheckboxCellEditor",
			valueGetter: (params) => params.data?.profile?.active ?? false,
			tooltipValueGetter: () =>
				"Click to toggle, this will allow/disallow user login",
		},
		{
			field: "role.role",
			headerName: "Role",
			cellEditor: "agSelectCellEditor",
			editable: true,
			cellEditorParams: {
				values: ["admin", "user"],
			} as ISelectCellEditorParams,
			tooltipValueGetter: () => "Double click to edit",
		},
		{
			field: "salary.salary_per_day",
			headerName: "Salary Per Day",
			editable: true,
			valueFormatter: (params) => {
				return params.value
					? Intl.NumberFormat("en-PH", {
							style: "currency",
							currency: "PHP",
						}).format(params.value)
					: "";
			},
			tooltipValueGetter: () => "Double click to edit",
		},

		{
			headerName: "Profile Info",
			children: [
				{
					field: "profile.first_name",
					headerName: "First Name",
					editable: true,
					tooltipValueGetter: () => "Double click to edit",
				},
				{
					field: "profile.last_name",
					headerName: "Last Name",
					editable: true,
					tooltipValueGetter: () => "Double click to edit",
				},
				{
					field: "profile.middle_name",
					headerName: "Middle Name",
					editable: true,
					tooltipValueGetter: () => "Double click to edit",
				},
				{
					field: "profile.phone",
					headerName: "Phone Number",
					editable: true,
					valueFormatter: (params) => formatPhone(params.value),
					tooltipValueGetter: () => "Double click to edit",
				},
				{
					field: "profile.address",
					headerName: "Address",
					editable: true,
					cellEditor: "agLargeTextCellEditor",
					cellEditorPopup: true,
					cellEditorParams: {
						maxLength: 200,
					},
					tooltipValueGetter: () => "Double click to edit",
				},
				{
					field: "profile.employment_role",
					headerName: "Employment Role",
					editable: true,
					tooltipValueGetter: () => "Double click to edit",
				},
			],
		},
		{
			headerName: "Emergency Contact",
			children: [
				{
					field: "profile.emergency_contact_person",
					headerName: "Contact Person",
					editable: true,
					tooltipValueGetter: () => "Double click to edit",
				},
				{
					field: "profile.emergency_contact_number",
					headerName: "Contact Number",
					editable: true,
					valueFormatter: (params) => formatPhone(params.value),
					tooltipValueGetter: () => "Double click to edit",
				},
				{
					field: "profile.emergency_contact_address",
					headerName: "Contact Address",
					editable: true,
					cellEditor: "agLargeTextCellEditor",
					cellEditorPopup: true,
					cellEditorParams: {
						maxLength: 200,
					},
					tooltipValueGetter: () => "Double click to edit",
				},
				{
					field: "profile.emergency_concat_relationship",
					headerName: "Relationship",
					editable: true,
					tooltipValueGetter: () => "Double click to edit",
				},
			],
		},
	]);

	const handleCellValueChanged = async (event: CellValueChangedEvent<User>) => {
		if (!event.data || !event.colDef.field) return;

		const userId = event.data.id;
		const field = event.colDef.field;
		const newValue = event.newValue;

		const toastId = toast.loading("Updating user data...");

		const result = await upsertUserData({
			userId,
			field,
			value: newValue,
		});

		if (result.success) {
			toast.success("User data updated successfully", { id: toastId });
		} else {
			toast.error(result.error || "Failed to update user data", {
				id: toastId,
			});
			// Revert the change on error
			event.node.setDataValue(field, event.oldValue);
		}
	};

	return (
		<TableWrapper>
			<AgGridReact
				columnDefs={colDefs}
				rowData={data || []}
				getRowId={(params) => params?.data?.id?.toString() || ""}
				defaultColDef={{
					filter: true,
					initialWidth: 120,
				}}
				onCellValueChanged={handleCellValueChanged}
			/>
		</TableWrapper>
	);
};
