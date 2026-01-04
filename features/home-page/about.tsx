"use client";

import type React from "react";
import { BookOpen, Star, Lightbulb, Award } from "lucide-react";

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
		<section
			id="about"
			className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24"
		>
			{/* Header */}
			<div className="mb-10 sm:mb-12 md:mb-16">
				<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2">
					<BookOpen className="h-4 w-4 text-emerald-700" />
					<span className="text-xs sm:text-sm font-semibold text-emerald-700">
						Our Story
					</span>
				</div>
				<h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-emerald-950">
					From Humble Beginnings to Industry Leader
				</h2>
				<p className="mt-3 sm:mt-4 max-w-3xl text-base sm:text-lg text-emerald-900/60">
					A journey of passion, innovation, and unwavering commitment to
					excellence that started with one machine and a vision.
				</p>
			</div>

			{/* Main Story - Introduction */}
			<div className="mb-10 sm:mb-12 overflow-hidden rounded-lg sm:rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 sm:p-10 shadow-md ring-1 ring-emerald-200">
				<div className="max-w-4xl">
					<p className="text-base sm:text-lg leading-relaxed text-emerald-950">
						{ABOUT_PARAGRAPHS[0]}
					</p>
				</div>
			</div>

			{/* Timeline/Story Sections */}
			<div className="space-y-4 sm:space-y-6 mb-10 sm:mb-12">
				{/* Section 1: The Beginning */}
				<div className="group relative overflow-hidden rounded-lg sm:rounded-xl bg-white p-5 sm:p-8 shadow-sm ring-1 ring-emerald-100 transition-all hover:shadow-md hover:ring-emerald-300">
					<div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-transparent" />
					<div className="flex gap-4 sm:gap-6">
						<div className="flex-shrink-0">
							<div className="flex h-12 sm:h-14 w-12 sm:w-14 items-center justify-center rounded-lg bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
								<Star className="h-6 sm:h-7 w-6 sm:w-7 text-emerald-600" />
							</div>
						</div>
						<div className="flex-1">
							<h3 className="text-base sm:text-lg font-bold text-emerald-950">
								The Beginning (March 2007)
							</h3>
							<p className="mt-2 sm:mt-3 text-sm sm:text-base leading-relaxed text-emerald-900/80">
								{ABOUT_PARAGRAPHS[1]}
							</p>
						</div>
					</div>
				</div>

				{/* Section 2: Our Name & Location */}
				<div className="group relative overflow-hidden rounded-lg sm:rounded-xl bg-white p-5 sm:p-8 shadow-sm ring-1 ring-emerald-100 transition-all hover:shadow-md hover:ring-emerald-300">
					<div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-blue-500 via-blue-400 to-transparent" />
					<div className="flex gap-4 sm:gap-6">
						<div className="flex-shrink-0">
							<div className="flex h-12 sm:h-14 w-12 sm:w-14 items-center justify-center rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
								<span className="text-base sm:text-lg font-bold text-blue-600">
									G
								</span>
							</div>
						</div>
						<div className="flex-1">
							<h3 className="text-base sm:text-lg font-bold text-emerald-950">
								Identity & Location
							</h3>
							<p className="mt-2 sm:mt-3 text-sm sm:text-base leading-relaxed text-emerald-900/80">
								{ABOUT_PARAGRAPHS[2]}
							</p>
						</div>
					</div>
				</div>

				{/* Section 3: Innovation */}
				<div className="group relative overflow-hidden rounded-lg sm:rounded-xl bg-white p-5 sm:p-8 shadow-sm ring-1 ring-emerald-100 transition-all hover:shadow-md hover:ring-emerald-300">
					<div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-purple-500 via-purple-400 to-transparent" />
					<div className="flex gap-4 sm:gap-6">
						<div className="flex-shrink-0">
							<div className="flex h-12 sm:h-14 w-12 sm:w-14 items-center justify-center rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors">
								<Lightbulb className="h-6 sm:h-7 w-6 sm:w-7 text-purple-600" />
							</div>
						</div>
						<div className="flex-1">
							<h3 className="text-base sm:text-lg font-bold text-emerald-950">
								Growth Through Innovation
							</h3>
							<p className="mt-2 sm:mt-3 text-sm sm:text-base leading-relaxed text-emerald-900/80">
								{ABOUT_PARAGRAPHS[3]}
							</p>
						</div>
					</div>
				</div>

				{/* Section 4: Commitment */}
				<div className="group relative overflow-hidden rounded-lg sm:rounded-xl bg-white p-5 sm:p-8 shadow-sm ring-1 ring-emerald-100 transition-all hover:shadow-md hover:ring-emerald-300">
					<div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-orange-500 via-orange-400 to-transparent" />
					<div className="flex gap-4 sm:gap-6">
						<div className="flex-shrink-0">
							<div className="flex h-12 sm:h-14 w-12 sm:w-14 items-center justify-center rounded-lg bg-orange-100 group-hover:bg-orange-200 transition-colors">
								<Award className="h-6 sm:h-7 w-6 sm:w-7 text-orange-600" />
							</div>
						</div>
						<div className="flex-1">
							<h3 className="text-base sm:text-lg font-bold text-emerald-950">
								Excellence & Commitment
							</h3>
							<p className="mt-2 sm:mt-3 text-sm sm:text-base leading-relaxed text-emerald-900/80">
								{ABOUT_PARAGRAPHS[4]}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Closing Statement */}
			<div className="rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-900 to-emerald-950 p-6 sm:p-10 text-center text-white shadow-lg">
				<p className="text-base sm:text-xl font-semibold italic">
					&quot;{ABOUT_PARAGRAPHS[5]}&quot;
				</p>
				<p className="mt-3 sm:mt-4 text-sm sm:text-base text-emerald-200">
					—Genstar Printing Services
				</p>
			</div>
		</section>
	);
}
