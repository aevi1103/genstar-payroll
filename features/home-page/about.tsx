"use client";

import type React from "react";
import { BookOpen, Star, Lightbulb, Award, Sparkles } from "lucide-react";

export const ABOUT_PARAGRAPHS: string[] = [
	"The Genstar Printing Services is recognized as a commercial print industry.",
	"Its humble beginning started in March 2007 by a young entrepreneur who opened his doors of his field of expertise in putting up a printing business. It all started with only one Heidelberg offset machine, one cutter, one offset operator, an office staff and a small office with one computer to entertain clients.",
	"Genstar Printing Services is situated in the stretch of General Avenue Project 8 Quezon City. It is the only Printing Services that exist in the area, thus GENSTAR was named after the name of the (General Avenue) and a star of a General.",
	"One of Genstar Printing Services goal is to constantly come up with innovative ways to meeting up with our clients full satisfaction both to printing and creative design services. As we innovatively find ways to improve our services, we slowly acquired more equipments / machines to quickly meet up with client’s target dates of delivery. Promptness in delivery and sincerity to clients are the unique strength of Genstar’s existence.",
	"Helping our clients stay on top of today’s competitive printing business industry is what we shall strive to do best. As we geared towards fulfilling of our commitment on satisfaction of our clients, we are also committed to the best satisfaction of our staff who works hard for every detail in bringing up the best that we can be. We shall face the many challenges on meeting the standards of excellence, to continue having quality prints, to help our staff be upgraded with their knowledge in the challenging world of printing industry. We shall strive and We are committed.",
	"To God Be All The Glory.",
];

export function AboutSection(): React.ReactElement {
	return (
		<section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-28 lg:py-32">
			{/* Decorative background elements */}
			<div className="absolute inset-0 -z-10 overflow-hidden">
				<div className="absolute top-10 right-20 h-80 w-80 rounded-full bg-emerald-100/20 blur-3xl" />
				<div className="absolute bottom-40 left-10 h-96 w-96 rounded-full bg-blue-100/15 blur-3xl" />
			</div>

			{/* Header */}
			<div className="mb-12 sm:mb-16 md:mb-20 text-center">
				<div className="mb-6 sm:mb-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-50 px-4 sm:px-6 py-2.5 sm:py-3 ring-1 ring-emerald-200">
					<BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
					<span
						id="about"
						className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-emerald-700"
					>
						Our Story
					</span>
				</div>
				<h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-emerald-950">
					From Humble Beginnings to{" "}
					<span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
						Industry Leader
					</span>
				</h2>
				<p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed text-emerald-900/70">
					A journey of passion, innovation, and unwavering commitment to
					excellence that started with one machine and a vision.
				</p>
			</div>

			{/* Main Story - Introduction */}
			<div className="mb-16 sm:mb-20 md:mb-24 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-emerald-50/50 to-teal-50/30 p-8 sm:p-10 md:p-12 shadow-lg ring-1 ring-emerald-200/60">
				<div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-transparent to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5" />
				<div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-emerald-200/20 blur-3xl" />
				<div className="relative max-w-4xl">
					<div className="inline-flex items-center gap-2 rounded-lg bg-emerald-100/50 px-3 sm:px-4 py-2 ring-1 ring-emerald-200 mb-4 sm:mb-6">
						<Sparkles className="h-4 w-4 text-emerald-600" />
						<span className="text-xs sm:text-sm font-semibold text-emerald-700">
							Industry Recognition
						</span>
					</div>
					<p className="text-base sm:text-lg md:text-xl leading-relaxed text-emerald-950 font-semibold">
						{ABOUT_PARAGRAPHS[0]}
					</p>
				</div>
			</div>

			{/* Timeline/Story Sections */}
			<div className="space-y-5 sm:space-y-6 mb-16 sm:mb-20 md:mb-24">
				{/* Section 1: The Beginning */}
				<div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50/30 p-6 sm:p-8 md:p-10 shadow-md ring-1 ring-blue-200/60 transition-all duration-300 hover:shadow-lg hover:ring-blue-300 hover:-translate-y-1">
					<div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 transition-all duration-300" />
					<div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-blue-200/20 blur-2xl group-hover:bg-blue-200/30 transition-all duration-300" />

					<div className="flex gap-5 sm:gap-6">
						<div className="flex-shrink-0">
							<div className="flex h-14 sm:h-16 w-14 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 ring-1 ring-blue-200/50 group-hover:ring-blue-300 group-hover:shadow-md transition-all duration-300">
								<Star className="h-7 sm:h-8 w-7 sm:w-8 text-blue-600" />
							</div>
						</div>
						<div className="flex-1 relative">
							<h3 className="text-lg sm:text-xl font-bold text-blue-950">
								The Beginning (March 2007)
							</h3>
							<div className="mt-2 h-1 w-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
							<p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-blue-950/80">
								{ABOUT_PARAGRAPHS[1]}
							</p>
						</div>
					</div>
				</div>

				{/* Section 2: Our Name & Location */}
				<div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50/30 p-6 sm:p-8 md:p-10 shadow-md ring-1 ring-purple-200/60 transition-all duration-300 hover:shadow-lg hover:ring-purple-300 hover:-translate-y-1">
					<div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-indigo-500/0 group-hover:from-purple-500/5 group-hover:to-indigo-500/5 transition-all duration-300" />
					<div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-purple-200/20 blur-2xl group-hover:bg-purple-200/30 transition-all duration-300" />

					<div className="flex gap-5 sm:gap-6">
						<div className="flex-shrink-0">
							<div className="flex h-14 sm:h-16 w-14 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 ring-1 ring-purple-200/50 group-hover:ring-purple-300 group-hover:shadow-md transition-all duration-300">
								<span className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-purple-600 to-indigo-600 bg-clip-text text-transparent">
									G
								</span>
							</div>
						</div>
						<div className="flex-1 relative">
							<h3 className="text-lg sm:text-xl font-bold text-purple-950">
								Identity & Location
							</h3>
							<div className="mt-2 h-1 w-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500" />
							<p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-purple-950/80">
								{ABOUT_PARAGRAPHS[2]}
							</p>
						</div>
					</div>
				</div>

				{/* Section 3: Innovation */}
				<div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50/30 p-6 sm:p-8 md:p-10 shadow-md ring-1 ring-orange-200/60 transition-all duration-300 hover:shadow-lg hover:ring-orange-300 hover:-translate-y-1">
					<div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-transparent to-amber-500/0 group-hover:from-orange-500/5 group-hover:to-amber-500/5 transition-all duration-300" />
					<div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-orange-200/20 blur-2xl group-hover:bg-orange-200/30 transition-all duration-300" />

					<div className="flex gap-5 sm:gap-6">
						<div className="flex-shrink-0">
							<div className="flex h-14 sm:h-16 w-14 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 ring-1 ring-orange-200/50 group-hover:ring-orange-300 group-hover:shadow-md transition-all duration-300">
								<Lightbulb className="h-7 sm:h-8 w-7 sm:w-8 text-orange-600" />
							</div>
						</div>
						<div className="flex-1 relative">
							<h3 className="text-lg sm:text-xl font-bold text-orange-950">
								Growth Through Innovation
							</h3>
							<div className="mt-2 h-1 w-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500" />
							<p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-orange-950/80">
								{ABOUT_PARAGRAPHS[3]}
							</p>
						</div>
					</div>
				</div>

				{/* Section 4: Commitment */}
				<div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50/30 p-6 sm:p-8 md:p-10 shadow-md ring-1 ring-rose-200/60 transition-all duration-300 hover:shadow-lg hover:ring-rose-300 hover:-translate-y-1">
					<div className="absolute inset-0 bg-gradient-to-br from-rose-500/0 via-transparent to-pink-500/0 group-hover:from-rose-500/5 group-hover:to-pink-500/5 transition-all duration-300" />
					<div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-rose-200/20 blur-2xl group-hover:bg-rose-200/30 transition-all duration-300" />

					<div className="flex gap-5 sm:gap-6">
						<div className="flex-shrink-0">
							<div className="flex h-14 sm:h-16 w-14 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-rose-100 to-rose-50 ring-1 ring-rose-200/50 group-hover:ring-rose-300 group-hover:shadow-md transition-all duration-300">
								<Award className="h-7 sm:h-8 w-7 sm:w-8 text-rose-600" />
							</div>
						</div>
						<div className="flex-1 relative">
							<h3 className="text-lg sm:text-xl font-bold text-rose-950">
								Excellence & Commitment
							</h3>
							<div className="mt-2 h-1 w-8 rounded-full bg-gradient-to-r from-rose-500 to-pink-500" />
							<p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-rose-950/80">
								{ABOUT_PARAGRAPHS[4]}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Closing Statement */}
			<div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-950 to-teal-950 p-8 sm:p-10 md:p-14 text-center shadow-xl ring-1 ring-emerald-800/50">
				<div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-transparent to-teal-500/0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10" />
				<div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />
				<div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-teal-400/10 blur-3xl" />

				<div className="relative">
					<div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-lg bg-emerald-500/20 px-4 py-2 ring-1 ring-emerald-400/30">
						<Sparkles className="h-4 w-4 text-emerald-300" />
						<span className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-emerald-200">
							Our Promise
						</span>
					</div>
					<p className="text-lg sm:text-2xl md:text-3xl font-bold italic text-white">
						&quot;{ABOUT_PARAGRAPHS[5]}&quot;
					</p>
					<div className="mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 mx-auto" />
					<p className="mt-6 sm:mt-8 text-sm sm:text-base font-semibold text-emerald-200">
						—Genstar Printing Services
					</p>
				</div>
			</div>
		</section>
	);
}
