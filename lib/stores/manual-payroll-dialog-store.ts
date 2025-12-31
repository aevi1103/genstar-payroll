import { create } from "zustand";
import type { PayrollDataSource } from "@/hooks/use-payroll-history-query";
interface ManualPayrollDialogState {
	isOpen: boolean;
	openDialog: () => void;
	closeDialog: () => void;

	payrollEntryData: PayrollDataSource | null | undefined;
	setPayrollEntryData: (data: PayrollDataSource | null | undefined) => void;
}

export const useManualPayrollDialogStore = create<ManualPayrollDialogState>(
	(set) => ({
		isOpen: false,
		openDialog: () => set({ isOpen: true }),
		closeDialog: () => set({ isOpen: false }),

		payrollEntryData: null,
		setPayrollEntryData: (data: PayrollDataSource | null | undefined) =>
			set({ payrollEntryData: data }),
	}),
);
