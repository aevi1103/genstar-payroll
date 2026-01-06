"use client";

import type React from "react";
import { Eye, Target, Heart, Sparkles } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

export const VISION_TEXT =
	"Clients total satisfaction as to Quality, Affordability and Service.";

export const MISSION_TEXT =
	"Provision of Quality Prints in a timely manner of delivery";

export const CORE_VALUES: Array<{
	name: string;
	color: "emerald" | "blue" | "purple" | "orange" | "rose";
	description: string;
}> = [
	{
		name: "Trust",
		color: "emerald",
		description: "Built on integrity and transparency",
	},
	{
		name: "Accountability",
		color: "purple",
		description: "Responsible and reliable",
	},
	{
		name: "Prompt",
		color: "rose",
		description: "Always timely delivery",
	},
	{
		name: "Service",
		color: "blue",
		description: "Dedicated to excellence",
	},
	{
		name: "Innovation",
		color: "orange",
		description: "Embracing new ideas",
	},
];

export function VisionSection(): React.ReactElement {
	const { isIntersecting: isVisionVisible, ref: visionRef } =
		useIntersectionObserver({
			threshold: 0.3,
			freezeOnceVisible: true,
		});

	const { isIntersecting: isMissionVisible, ref: missionRef } =
		useIntersectionObserver({
			threshold: 0.3,
			freezeOnceVisible: true,
		});

	const { isIntersecting: isTrustVisible, ref: trustRef } =
		useIntersectionObserver({
			threshold: 0.3,
			freezeOnceVisible: true,
		});

	const { isIntersecting: isAccountabilityVisible, ref: accountabilityRef } =
		useIntersectionObserver({
			threshold: 0.3,
			freezeOnceVisible: true,
		});

	const { isIntersecting: isPromptVisible, ref: promptRef } =
		useIntersectionObserver({
			threshold: 0.3,
			freezeOnceVisible: true,
		});

	const { isIntersecting: isServiceVisible, ref: serviceRef } =
		useIntersectionObserver({
			threshold: 0.3,
			freezeOnceVisible: true,
		});

	const { isIntersecting: isInnovationVisible, ref: innovationRef } =
		useIntersectionObserver({
			threshold: 0.3,
			freezeOnceVisible: true,
		});

	return (
		<section
			id="vision"
			className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-28 lg:py-32"
		>
			{/* Decorative background elements */}
			<div className="absolute inset-0 -z-10 overflow-hidden">
				<div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-emerald-100/30 blur-3xl" />
				<div className="absolute bottom-32 right-10 h-96 w-96 rounded-full bg-blue-100/20 blur-3xl" />
			</div>

			{/* Header */}
			<div className="mb-12 sm:mb-16 md:mb-20 text-center">
				<div className="mb-6 sm:mb-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-50 px-4 sm:px-6 py-2.5 sm:py-3 ring-1 ring-emerald-200">
					<Heart className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
					<span className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-emerald-700">
						Core Principles
					</span>
				</div>
				<h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-emerald-950">
					Vision, Mission &{" "}
					<span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
						Values
					</span>
				</h2>
				<p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed text-emerald-900/70">
					These guiding principles shape every decision we make and every
					service we deliver to our valued clients.
				</p>
			</div>

			{/* Vision & Mission Cards */}
			<div className="grid gap-6 sm:gap-8 lg:grid-cols-2 mb-16 sm:mb-20 md:mb-24">
				{/* Vision Card */}
				<div
					ref={visionRef}
					className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-blue-50/50 to-cyan-50/30 p-8 sm:p-10 md:p-12 shadow-lg ring-1 ring-blue-200/60 transition-all duration-300 hover:shadow-2xl hover:ring-blue-300 hover:-translate-y-2 ${
						isVisionVisible
							? "animate-in fade-in slide-in-from-left-4 duration-700"
							: "opacity-0 -translate-x-4"
					}`}
				>
					<div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 transition-all duration-300" />
					<div
						className={`absolute -top-16 -right-16 h-40 w-40 rounded-full bg-blue-200/20 blur-3xl group-hover:bg-blue-200/30 transition-all duration-300 ${
							isVisionVisible ? "animate-pulse" : ""
						}`}
					/>
					<div className="relative">
						<div
							className={`inline-flex h-14 sm:h-16 w-14 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 ring-1 ring-blue-200/50 group-hover:ring-blue-300 group-hover:shadow-md transition-all duration-300 ${
								isVisionVisible
									? "animate-in zoom-in duration-500 delay-200"
									: "opacity-0 scale-0 transform-gpu"
							}`}
						>
							<Eye className="h-7 sm:h-8 w-7 sm:w-8 text-blue-600" />
						</div>
						<h3
							className={`mt-6 sm:mt-8 text-2xl sm:text-3xl font-bold text-blue-950 ${
								isVisionVisible
									? "animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300"
									: "opacity-0 translate-y-2"
							}`}
						>
							Our Vision
						</h3>
						<div
							className={`mt-3 h-1 w-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 ${
								isVisionVisible
									? "animate-in fade-in slide-in-from-left duration-400 delay-500"
									: "opacity-0 -translate-x-4"
							}`}
						/>
						<p
							className={`mt-4 sm:mt-6 text-base sm:text-lg leading-relaxed text-blue-950/85 ${
								isVisionVisible
									? "animate-in fade-in duration-600 delay-700"
									: "opacity-0"
							}`}
						>
							{VISION_TEXT}
						</p>
						<div className="mt-6 sm:mt-8 inline-flex items-center gap-3 rounded-lg bg-blue-100/40 px-4 py-2.5 ring-1 ring-blue-200/50">
							<Sparkles className="h-4 w-4 text-blue-600" />
							<span className="text-xs sm:text-sm font-semibold text-blue-700">
								Excellence & Growth
							</span>
						</div>
					</div>
				</div>

				{/* Mission Card */}
				<div
					ref={missionRef}
					className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-emerald-50/50 to-teal-50/30 p-8 sm:p-10 md:p-12 shadow-lg ring-1 ring-emerald-200/60 transition-all duration-300 hover:shadow-2xl hover:ring-emerald-300 hover:-translate-y-2 ${
						isMissionVisible
							? "animate-in fade-in slide-in-from-right-4 duration-700"
							: "opacity-0 translate-x-4"
					}`}
				>
					<div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-transparent to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-300" />
					<div
						className={`absolute -top-16 -right-16 h-40 w-40 rounded-full bg-emerald-200/20 blur-3xl group-hover:bg-emerald-200/30 transition-all duration-300 ${
							isMissionVisible ? "animate-pulse" : ""
						}`}
					/>
					<div className="relative">
						<div
							className={`inline-flex h-14 sm:h-16 w-14 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 ring-1 ring-emerald-200/50 group-hover:ring-emerald-300 group-hover:shadow-md transition-all duration-300 ${
								isMissionVisible
									? "animate-in zoom-in duration-500 delay-200"
									: "opacity-0 scale-0 transform-gpu"
							}`}
						>
							<Target className="h-7 sm:h-8 w-7 sm:w-8 text-emerald-600" />
						</div>
						<h3
							className={`mt-6 sm:mt-8 text-2xl sm:text-3xl font-bold text-emerald-950 ${
								isMissionVisible
									? "animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300"
									: "opacity-0 translate-y-2"
							}`}
						>
							Our Mission
						</h3>
						<div
							className={`mt-3 h-1 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 ${
								isMissionVisible
									? "animate-in fade-in slide-in-from-left duration-400 delay-500"
									: "opacity-0 -translate-x-4"
							}`}
						/>
						<p
							className={`mt-4 sm:mt-6 text-base sm:text-lg leading-relaxed text-emerald-950/85 ${
								isMissionVisible
									? "animate-in fade-in duration-600 delay-700"
									: "opacity-0"
							}`}
						>
							{MISSION_TEXT}
						</p>
						<div className="mt-6 sm:mt-8 inline-flex items-center gap-3 rounded-lg bg-emerald-100/40 px-4 py-2.5 ring-1 ring-emerald-200/50">
							<Sparkles className="h-4 w-4 text-emerald-600" />
							<span className="text-xs sm:text-sm font-semibold text-emerald-700">
								Quality & Impact
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Divider */}
			<div className="my-12 sm:my-16 md:my-20">
				<div className="mx-auto max-w-xs h-1 rounded-full bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
			</div>

			{/* Core Values */}
			<div>
				<div className="mb-12 sm:mb-16 text-center">
					<div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-50 px-4 sm:px-6 py-2.5 sm:py-3 ring-1 ring-emerald-200">
						<Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
						<span className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-emerald-700">
							Our Foundation
						</span>
					</div>
					<h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-950">
						Core Values We{" "}
						<span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
							Live By
						</span>
					</h3>
					<p className="mt-4 sm:mt-6 text-base sm:text-lg text-emerald-900/65">
						Five pillars that guide our culture and define our operations
					</p>
				</div>
				<div className="grid gap-5 sm:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
					{CORE_VALUES.map((value, index) => {
						const valueRefs = [
							trustRef,
							accountabilityRef,
							promptRef,
							serviceRef,
							innovationRef,
						];
						const valueVisibilities = [
							isTrustVisible,
							isAccountabilityVisible,
							isPromptVisible,
							isServiceVisible,
							isInnovationVisible,
						];
						const delays = [
							"",
							"delay-100",
							"delay-200",
							"delay-300",
							"delay-[400ms]",
						];
						const currentRef = valueRefs[index];
						const isVisible = valueVisibilities[index];
						const delay = delays[index];

						const colorMap = {
							emerald: {
								bg: "from-emerald-50 to-teal-50/30",
								ring: "ring-emerald-200",
								icon: "bg-emerald-100",
								accent: "via-emerald-500",
								text: "text-emerald-950",
								badge: "bg-emerald-100/50 ring-emerald-200",
								badgeText: "text-emerald-700",
								hoverRing: "hover:ring-emerald-300",
								gradient: "from-emerald-600 to-teal-600",
							},
							blue: {
								bg: "from-blue-50 to-cyan-50/30",
								ring: "ring-blue-200",
								icon: "bg-blue-100",
								accent: "via-blue-500",
								text: "text-blue-950",
								badge: "bg-blue-100/50 ring-blue-200",
								badgeText: "text-blue-700",
								hoverRing: "hover:ring-blue-300",
								gradient: "from-blue-600 to-cyan-600",
							},
							purple: {
								bg: "from-purple-50 to-indigo-50/30",
								ring: "ring-purple-200",
								icon: "bg-purple-100",
								accent: "via-purple-500",
								text: "text-purple-950",
								badge: "bg-purple-100/50 ring-purple-200",
								badgeText: "text-purple-700",
								hoverRing: "hover:ring-purple-300",
								gradient: "from-purple-600 to-indigo-600",
							},
							orange: {
								bg: "from-orange-50 to-amber-50/30",
								ring: "ring-orange-200",
								icon: "bg-orange-100",
								accent: "via-orange-500",
								text: "text-orange-950",
								badge: "bg-orange-100/50 ring-orange-200",
								badgeText: "text-orange-700",
								hoverRing: "hover:ring-orange-300",
								gradient: "from-orange-600 to-amber-600",
							},
							rose: {
								bg: "from-rose-50 to-pink-50/30",
								ring: "ring-rose-200",
								icon: "bg-rose-100",
								accent: "via-rose-500",
								text: "text-rose-950",
								badge: "bg-rose-100/50 ring-rose-200",
								badgeText: "text-rose-700",
								hoverRing: "hover:ring-rose-300",
								gradient: "from-rose-600 to-pink-600",
							},
						};

						const colors = colorMap[value.color];

						return (
							<div
								key={value.name}
								ref={currentRef}
								className={`group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br ${colors.bg} p-6 sm:p-8 shadow-md ring-1 ${colors.ring} transition-all duration-300 hover:shadow-xl ${colors.hoverRing} hover:-translate-y-2 ${
									isVisible
										? `animate-in fade-in slide-in-from-bottom-4 duration-600 ${delay}`
										: "opacity-0 translate-y-4"
								}`}
							>
								{/* Gradient overlay on hover */}
								<div
									className={`absolute inset-0 bg-gradient-to-br from-${value.color}-50/0 via-transparent to-${value.color}-100/0 group-hover:from-${value.color}-50 group-hover:to-${value.color}-100/40 transition-all duration-300`}
								/>

								{/* Animated top accent line */}
								<div
									className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-transparent ${colors.accent} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
								/>

								<div className="relative flex flex-col items-center text-center">
									{/* Icon circle */}
									<div
										className={`inline-flex h-14 sm:h-16 w-14 sm:w-16 items-center justify-center rounded-full ${colors.icon} ring-2 ${colors.ring} group-hover:shadow-lg transition-all duration-300`}
									>
										<span
											className={`text-2xl sm:text-3xl font-bold bg-gradient-to-br ${colors.gradient} bg-clip-text text-transparent`}
										>
											{value.name.charAt(0)}
										</span>
									</div>

									{/* Value name */}
									<p
										className={`mt-4 sm:mt-5 text-base sm:text-lg font-bold ${colors.text}`}
									>
										{value.name}
									</p>

									{/* Description badge */}
									<div
										className={`mt-3 sm:mt-4 inline-flex items-center gap-1.5 rounded-full ${colors.badge} px-3 py-1.5 ring-1`}
									>
										<div
											className={`h-1 w-1 rounded-full bg-gradient-to-r ${colors.gradient}`}
										/>
										<span
											className={`text-xs sm:text-xs font-medium ${colors.badgeText}`}
										>
											{value.description}
										</span>
									</div>

									{/* Bottom accent */}
									<div
										className={`mt-4 sm:mt-5 h-0.5 w-10 rounded-full bg-gradient-to-r from-transparent ${colors.accent} to-transparent`}
									/>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
