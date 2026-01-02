import { create } from "zustand";
import type { PayrollDataSource } from "../map-payroll-datasource";

interface PayrollHistoryStore {
	record: PayrollDataSource | null | undefined;
	setRecord: (record: PayrollDataSource | null | undefined) => void;

	isSheetOpen: boolean;
	openSheet: () => void;
	closeSheet: () => void;
}

export const uePayrollHistoryStore = create<PayrollHistoryStore>((set) => ({
	record: null,
	setRecord: (record: PayrollDataSource | null | undefined) => set({ record }),

	isSheetOpen: false,
	openSheet: () => set({ isSheetOpen: true }),
	closeSheet: () => set({ isSheetOpen: false }),
}));
