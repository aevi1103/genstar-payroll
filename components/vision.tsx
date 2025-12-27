"use client";

import type React from "react";

export const VISION_TEXT =
	"Clients total satisfaction as to Quality, Affordability and Service.";

export const MISSION_TEXT =
	"Provision of Quality Prints in a timely manner of delivery";

export const CORE_VALUES: string[] = [
	"Trust",
	"Service",
	"Accountability",
	"Innovation",
	"Prompt",
];

export function VisionSection(): React.ReactElement {
	return (
		<section id="vision" className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">
						Vision, Mission & Values
					</p>
					<h2 className="mt-2 text-2xl font-semibold text-emerald-950">
						What guides our work
					</h2>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<div className="rounded-2xl bg-white/90 p-6 shadow-sm ring-1 ring-emerald-100">
					<h3 className="text-base font-semibold text-emerald-900">Vision</h3>
					<p className="mt-2 text-sm text-emerald-900/85 leading-relaxed">
						{VISION_TEXT}
					</p>
				</div>

				<div className="rounded-2xl bg-white/90 p-6 shadow-sm ring-1 ring-emerald-100">
					<h3 className="text-base font-semibold text-emerald-900">Mission</h3>
					<p className="mt-2 text-sm text-emerald-900/85 leading-relaxed">
						{MISSION_TEXT}
					</p>
				</div>

				<div className="rounded-2xl bg-white/90 p-6 shadow-sm ring-1 ring-emerald-100">
					<h3 className="text-base font-semibold text-emerald-900">
						Our Core Values
					</h3>
					<ul className="mt-2 space-y-2 text-sm text-emerald-900/85">
						{CORE_VALUES.map((value) => (
							<li key={value} className="flex items-start gap-2">
								<span
									className="mt-1 h-2 w-2 rounded-full bg-emerald-600"
									aria-hidden
								/>
								<span>{value}</span>
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
}
