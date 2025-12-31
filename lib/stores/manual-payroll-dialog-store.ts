import type { DataSource } from "@/components/payroll/payroll-history";
import { create } from "zustand";

interface ManualPayrollDialogState {
	isOpen: boolean;
	openDialog: () => void;
	closeDialog: () => void;

	payrollEntryData: DataSource | null | undefined;
	setPayrollEntryData: (data: DataSource | null | undefined) => void;
}

export const useManualPayrollDialogStore = create<ManualPayrollDialogState>(
	(set) => ({
		isOpen: false,
		openDialog: () => set({ isOpen: true }),
		closeDialog: () => set({ isOpen: false }),

		payrollEntryData: null,
		setPayrollEntryData: (data: DataSource | null | undefined) =>
			set({ payrollEntryData: data }),
	}),
);
