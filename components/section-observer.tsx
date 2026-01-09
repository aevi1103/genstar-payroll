"use client";

import { useSectionObserver } from "@/hooks/use-section-observer";

interface SectionObserverProps {
	sectionIds: string[];
}

export function SectionObserver({ sectionIds }: SectionObserverProps) {
	useSectionObserver(sectionIds);
	return null;
}
