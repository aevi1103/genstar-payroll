import { create } from "zustand";
import type { WeeklySummaryDataSource } from "@/features/weekly-history/utils/hooks/use-weekly-summary";

interface WeeklyPayrollHistoryStore {
	record: WeeklySummaryDataSource | null | undefined;
	setRecord: (record: WeeklySummaryDataSource | null | undefined) => void;

	isSheetOpen: boolean;
	openSheet: () => void;
	closeSheet: () => void;
}

export const useWeeklyPayrollHistoryStore = create<WeeklyPayrollHistoryStore>(
	(set) => ({
		record: null,
		setRecord: (record: WeeklySummaryDataSource | null | undefined) =>
			set({ record }),

		isSheetOpen: false,
		openSheet: () => set({ isSheetOpen: true }),
		closeSheet: () => set({ isSheetOpen: false }),
	}),
);
