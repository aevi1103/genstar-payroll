"use client";

import type React from "react";

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
		<section id="about" className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">
						About
					</p>
					<h2 className="mt-2 text-2xl font-semibold text-emerald-950">
						Our Story
					</h2>
				</div>
			</div>

			<div className="rounded-2xl bg-white/90 p-6 shadow-sm ring-1 ring-emerald-100">
				<div className="space-y-4 text-emerald-900/85">
					{ABOUT_PARAGRAPHS.map((text, idx) => (
						<p key={idx.toString()} className="text-sm leading-relaxed">
							{text}
						</p>
					))}
				</div>
			</div>
		</section>
	);
}
