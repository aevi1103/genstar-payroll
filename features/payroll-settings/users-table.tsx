"use client";
import React, { useState } from "react";
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

export const UsersTable = ({ data }: { data: Users }) => {
	const { formatPhone } = usePhoneFormatter();
	const [colDefs] = useState<(ColDef<User> | ColGroupDef<User>)[]>([
		{
			field: "email",
			headerName: "Email",
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
				}}
				onCellValueChanged={handleCellValueChanged}
			/>
		</TableWrapper>
	);
};
