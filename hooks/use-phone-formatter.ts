import { useCallback } from "react";

export const usePhoneFormatter = () => {
	const formatPhone = useCallback(
		(phoneNumber: string | null | undefined): string => {
			if (!phoneNumber) return "";

			const cleaned = phoneNumber.replace(/\D/g, "");

			// Format as (xxxx) xxx xxxx
			const match = cleaned.match(/^(\d{4})(\d{3})(\d{4})$/);
			return match ? `(${match[1]}) ${match[2]} ${match[3]}` : phoneNumber;
		},
		[],
	);

	return { formatPhone };
};
