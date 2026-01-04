"use client";

import type React from "react";
import { Eye, Target, Heart } from "lucide-react";

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
		<section
			id="vision"
			className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24"
		>
			{/* Header */}
			<div className="mb-10 sm:mb-12 md:mb-16">
				<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2">
					<Heart className="h-4 w-4 text-emerald-700" />
					<span className="text-xs sm:text-sm font-semibold text-emerald-700">
						Our Philosophy
					</span>
				</div>
				<h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-emerald-950">
					Vision, Mission & Values
				</h2>
				<p className="mt-3 sm:mt-4 max-w-3xl text-base sm:text-lg text-emerald-900/60">
					These guiding principles shape every decision we make and every
					service we deliver to our valued clients.
				</p>
			</div>

			{/* Vision & Mission Cards */}
			<div className="grid gap-4 sm:gap-6 md:grid-cols-2 mb-10 sm:mb-12">
				{/* Vision Card */}
				<div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 sm:p-10 shadow-md ring-1 ring-blue-200 transition-all hover:shadow-lg hover:ring-blue-300">
					<div className="absolute top-0 right-0 -mr-8 -mt-8 h-24 w-24 rounded-full bg-blue-200/30 blur-2xl" />
					<div className="relative">
						<div className="inline-flex h-12 sm:h-14 w-12 sm:w-14 items-center justify-center rounded-lg sm:rounded-xl bg-blue-100 group-hover:bg-blue-200 transition-colors">
							<Eye className="h-6 sm:h-7 w-6 sm:w-7 text-blue-600" />
						</div>
						<h3 className="mt-4 sm:mt-6 text-lg sm:text-2xl font-bold text-blue-950">
							Our Vision
						</h3>
						<p className="mt-3 sm:mt-4 text-sm sm:text-lg leading-relaxed text-blue-950/80">
							{VISION_TEXT}
						</p>
						<div className="mt-4 sm:mt-6 flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-700">
							<div className="h-1 w-8 rounded-full bg-blue-600" />
							Vision for Excellence
						</div>
					</div>
				</div>

				{/* Mission Card */}
				<div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 sm:p-10 shadow-md ring-1 ring-emerald-200 transition-all hover:shadow-lg hover:ring-emerald-300">
					<div className="absolute top-0 right-0 -mr-8 -mt-8 h-24 w-24 rounded-full bg-emerald-200/30 blur-2xl" />
					<div className="relative">
						<div className="inline-flex h-12 sm:h-14 w-12 sm:w-14 items-center justify-center rounded-lg sm:rounded-xl bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
							<Target className="h-6 sm:h-7 w-6 sm:w-7 text-emerald-600" />
						</div>
						<h3 className="mt-4 sm:mt-6 text-lg sm:text-2xl font-bold text-emerald-950">
							Our Mission
						</h3>
						<p className="mt-3 sm:mt-4 text-sm sm:text-lg leading-relaxed text-emerald-950/80">
							{MISSION_TEXT}
						</p>
						<div className="mt-4 sm:mt-6 flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-700">
							<div className="h-1 w-8 rounded-full bg-emerald-600" />
							Driving Purpose
						</div>
					</div>
				</div>
			</div>

			{/* Core Values */}
			<div>
				<div className="mb-6 sm:mb-8">
					<h3 className="text-xl sm:text-2xl font-bold text-emerald-950">
						Core Values We Live By
					</h3>
					<p className="mt-2 text-sm sm:text-base text-emerald-900/60">
						These five pillars define our culture and operations
					</p>
				</div>
				<div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
					{CORE_VALUES.map((value, index) => (
						<div
							key={value}
							className="group relative overflow-hidden rounded-lg sm:rounded-xl bg-white p-4 sm:p-6 shadow-sm ring-1 ring-emerald-100 transition-all hover:shadow-md hover:ring-emerald-300 hover:-translate-y-1"
						>
							<div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
							<div className="relative flex flex-col items-center text-center">
								<div className="inline-flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-full bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
									<span className="text-base sm:text-xl font-bold text-emerald-700">
										{value.charAt(0)}
									</span>
								</div>
								<p className="mt-2 sm:mt-4 text-sm sm:text-base font-semibold text-emerald-950">
									{value}
								</p>
								<div className="mt-2 sm:mt-3 h-0.5 w-6 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
