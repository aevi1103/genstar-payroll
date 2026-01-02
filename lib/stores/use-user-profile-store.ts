import { create } from "zustand";
import type { User } from "@/app/payroll/settings/user/profile/actions";

interface UserProfileStore {
	user: User | null | undefined;
	setUser: (user: User | null | undefined) => void;

	isSheetOpen: boolean;
	openSheet: () => void;
	closeSheet: () => void;
}

export const useUserProfileStore = create<UserProfileStore>((set) => ({
	user: null,
	setUser: (user: User | null | undefined) => set({ user }),

	isSheetOpen: false,
	openSheet: () => set({ isSheetOpen: true }),
	closeSheet: () => set({ isSheetOpen: false }),
}));
