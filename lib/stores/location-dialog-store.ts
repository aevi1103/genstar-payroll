import { create } from "zustand";

interface LocationDialogState {
	isOpen: boolean;
	latitude: number | null;
	longitude: number | null;
	openDialog: (latitude: number, longitude: number) => void;
	closeDialog: () => void;
}

export const useLocationDialogStore = create<LocationDialogState>((set) => ({
	isOpen: false,
	latitude: null,
	longitude: null,
	openDialog: (latitude, longitude) =>
		set({ isOpen: true, latitude, longitude }),
	closeDialog: () => set({ isOpen: false, latitude: null, longitude: null }),
}));
