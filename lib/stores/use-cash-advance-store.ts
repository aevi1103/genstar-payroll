import { create } from "zustand";

type CashAdvanceState = {
	isLoadingRevert: Record<string, boolean>;
	isLoadingDelete: Record<string, boolean>;
	isLoadingPayment: Record<string, boolean>;
	setLoadingRevert: (id: string, loading: boolean) => void;
	setLoadingDelete: (id: string, loading: boolean) => void;
	setLoadingPayment: (id: string, loading: boolean) => void;
	resetLoading: (id: string) => void;
};

export const useCashAdvanceStore = create<CashAdvanceState>((set) => ({
	isLoadingRevert: {},
	isLoadingDelete: {},
	isLoadingPayment: {},
	setLoadingRevert: (id, loading) =>
		set((state) => ({
			isLoadingRevert: { ...state.isLoadingRevert, [id]: loading },
		})),
	setLoadingDelete: (id, loading) =>
		set((state) => ({
			isLoadingDelete: { ...state.isLoadingDelete, [id]: loading },
		})),
	setLoadingPayment: (id, loading) =>
		set((state) => ({
			isLoadingPayment: { ...state.isLoadingPayment, [id]: loading },
		})),
	resetLoading: (id) =>
		set((state) => {
			const newRevert = { ...state.isLoadingRevert };
			const newDelete = { ...state.isLoadingDelete };
			const newPayment = { ...state.isLoadingPayment };
			delete newRevert[id];
			delete newDelete[id];
			delete newPayment[id];
			return {
				isLoadingRevert: newRevert,
				isLoadingDelete: newDelete,
				isLoadingPayment: newPayment,
			};
		}),
}));
