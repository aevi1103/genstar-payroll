"use client";

import { useEffect, useRef, useState } from "react";

export function useSectionObserver(sectionIds: string[]) {
	const [activeSection, setActiveSection] = useState<string>("");
	const observerRef = useRef<IntersectionObserver | null>(null);

	useEffect(() => {
		// Create intersection observer
		observerRef.current = new IntersectionObserver(
			(entries) => {
				// Find the entry with the highest intersection ratio
				const visibleEntries = entries.filter((entry) => entry.isIntersecting);

				if (visibleEntries.length > 0) {
					// Sort by intersection ratio and get the most visible section
					const mostVisible = visibleEntries.reduce((prev, current) => {
						return current.intersectionRatio > prev.intersectionRatio
							? current
							: prev;
					});

					const sectionId = mostVisible.target.id;
					setActiveSection(sectionId);

					// Update URL hash without scrolling
					if (sectionId) {
						if (sectionId.includes("home")) {
							// Remove hash for home section
							if (window.location.hash) {
								window.history.replaceState(null, "", window.location.pathname);
							}
						} else if (window.location.hash !== `#${sectionId}`) {
							window.history.replaceState(null, "", `#${sectionId}`);
						}
					}
				}
			},
			{
				rootMargin: "-20% 0px -60% 0px", // Trigger when section is in the middle-ish of viewport
				threshold: [0, 0.25, 0.5, 0.75, 1],
			},
		);

		// Observe all sections
		for (const id of sectionIds) {
			const element = document.getElementById(id);
			if (element && observerRef.current) {
				observerRef.current.observe(element);
			}
		}

		// Cleanup
		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, [sectionIds]);

	return activeSection;
}
