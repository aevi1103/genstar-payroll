"use client";
import React, { useState } from "react";
import { TableWrapper } from "../table-wrapper";
import type { User, Users } from "@/app/payroll/settings/user/profile/actions";
import type {
	ColDef,
	ColGroupDef,
	ISelectCellEditorParams,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { usePhoneFormatter } from "@/hooks/use-phone-formatter";

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
		},
		{
			headerName: "Profile Info",
			children: [
				{
					field: "profile.first_name",
					headerName: "First Name",
					editable: true,
				},
				{
					field: "profile.last_name",
					headerName: "Last Name",
					editable: true,
				},
				{
					field: "profile.middle_name",
					headerName: "Middle Name",
					editable: true,
				},
				{
					field: "profile.phone",
					headerName: "Phone Number",
					editable: true,
					valueFormatter: (params) => formatPhone(params.value),
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
				},
			],
		},
	]);

	return (
		<TableWrapper>
			<AgGridReact
				columnDefs={colDefs}
				rowData={data || []}
				getRowId={(params) => params?.data?.id?.toString() || ""}
				defaultColDef={{
					filter: true,
				}}
			/>
		</TableWrapper>
	);
};
