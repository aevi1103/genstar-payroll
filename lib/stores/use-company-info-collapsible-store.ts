import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CompanyInfoCollapsibleState {
	// Section toggle states
	companyOverview: boolean;
	address: boolean;
	contactOwner: boolean;
	geolocation: boolean;
	machines: boolean;
	otherServices: boolean;
	suppliers: boolean;
	teamPositions: boolean;
	whatWePrint: boolean;

	// Actions
	toggleSection: (
		section: keyof Omit<CompanyInfoCollapsibleState, "toggleSection">,
	) => void;
	setSection: (
		section: keyof Omit<
			CompanyInfoCollapsibleState,
			"toggleSection" | "setSection"
		>,
		value: boolean,
	) => void;
}

export const useCompanyInfoCollapsibleStore =
	create<CompanyInfoCollapsibleState>()(
		persist(
			(set) => ({
				// Default states - main sections open, optional/lists closed
				companyOverview: true,
				address: true,
				contactOwner: true,
				geolocation: false,
				machines: false,
				otherServices: false,
				suppliers: false,
				teamPositions: false,
				whatWePrint: false,

				toggleSection: (section) =>
					set((state) => ({
						[section]: !state[section as keyof CompanyInfoCollapsibleState],
					})),

				setSection: (section, value) =>
					set({
						[section]: value,
					}),
			}),
			{
				name: "company-info-collapsible-storage",
			},
		),
	);
