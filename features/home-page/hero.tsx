import TypingText from "@/components/ui/shadcn-io/typing-text";

export const Hero = () => {
	return (
		<>
			<section className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12 lg:py-20 md:flex-row md:items-center md:py-32 animate__animated animate__slideInUp animate__slow">
				<div className="flex-1 space-y-8 animate__animated animate__fadeInLeft animate__slower">
					<div>
						<TypingText
							text={["Premium print solutions that move your brand forward."]}
							typingSpeed={75}
							pauseDuration={1500}
							showCursor={true}
							cursorCharacter="|"
							className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-emerald-950 lg:py-2"
							textColors={["#059669", "#047857", "#065f46"]}
							variableSpeed={{ min: 50, max: 120 }}
							initialDelay={1000}
						/>
					</div>

					<p className="max-w-2xl text-lg sm:text-xl text-emerald-900/75 leading-relaxed">
						High-quality offset, digital, and large-format printing with
						meticulous color management, fast turnarounds, and a team that
						sweats the details so you do not have to.
					</p>
					<div className="flex flex-wrap gap-4 pt-4" />
				</div>

				<div className="relative flex-1 animate__animated animate__fadeInRight animate__slower hover:scale-105 transition-transform duration-500">
					<div className="absolute inset-0 bg-linear-to-br from-emerald-600/20 to-emerald-400/10 rounded-3xl blur-2xl" />
					<div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-white via-emerald-50/30 to-white p-8 shadow-2xl ring-1 ring-emerald-200/60 backdrop-blur-sm hover:shadow-2xl hover:ring-emerald-300 transition-all duration-500 group">
						<div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/5 rounded-full -mr-48 -mt-48 blur-3xl" />
						<div className="relative space-y-6">
							<div className="flex items-center justify-between gap-3">
								<div>
									<h2 className="text-2xl font-bold text-emerald-950">
										Why Choose Us
									</h2>
									<p className="text-sm text-emerald-600 font-semibold mt-1">
										Since 2007 • Premium Quality
									</p>
								</div>
								<span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700 whitespace-nowrap">
									18+ Years
								</span>
							</div>

							<div className="space-y-4 pt-4">
								<div className="flex gap-4">
									<div className="shrink-0">
										<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
											{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
											<svg
												className="h-6 w-6 text-emerald-700"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
										</div>
									</div>
									<div>
										<p className="font-semibold text-emerald-950">
											Color-Managed Workflows
										</p>
										<p className="text-sm text-emerald-900/70 mt-0.5">
											Brand consistency guaranteed
										</p>
									</div>
								</div>

								<div className="flex gap-4">
									<div className="flex-shrink-0">
										<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
											{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
											<svg
												className="h-6 w-6 text-emerald-700"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M13 10V3L4 14h7v7l9-11h-7z"
												/>
											</svg>
										</div>
									</div>
									<div>
										<p className="font-semibold text-emerald-950">
											Fast Turnarounds
										</p>
										<p className="text-sm text-emerald-900/70 mt-0.5">
											Quick delivery without compromise
										</p>
									</div>
								</div>

								<div className="flex gap-4">
									<div className="flex-shrink-0">
										<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
											{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
											<svg
												className="h-6 w-6 text-emerald-700"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
												/>
											</svg>
										</div>
									</div>
									<div>
										<p className="font-semibold text-emerald-950">
											Precise Control
										</p>
										<p className="text-sm text-emerald-900/70 mt-0.5">
											Finishing excellence every time
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="relative z-10 mx-auto max-w-6xl px-6 py-10 animate__animated animate__fadeInUp animate__slow">
				<div className="mb-12 space-y-4">
					<div>
						<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-emerald-950 leading-tight">
							Complete Printing Solutions
						</h2>
						<p className="mt-4 text-lg text-emerald-900/70 max-w-3xl">
							From concept to final product, we deliver excellence across every
							printing method.
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
					{/* Offset Printing */}
					<div className="group relative rounded-2xl bg-linear-to-br from-white to-emerald-50/50 p-8 shadow-lg ring-1 ring-emerald-200/60 backdrop-blur-sm hover:shadow-2xl hover:ring-emerald-300/80 hover:bg-linear-to-br hover:from-white hover:to-emerald-100/40 transition-all duration-500 animate__animated animate__fadeInUp animate__slow">
						<div className="absolute inset-0 rounded-2xl bg-linear-to-t from-emerald-600/0 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
						<div className="relative space-y-4">
							<div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-100 group-hover:bg-emerald-600 transition-all duration-300">
								{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
								<svg
									className="h-8 w-8 text-emerald-700 group-hover:text-white transition-colors"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<h3 className="text-2xl font-bold text-emerald-950">
								Offset Printing
							</h3>
							<p className="text-emerald-900/75 leading-relaxed">
								Large-volume runs with unmatched color precision and crisp,
								professional results.
							</p>
						</div>
					</div>

					{/* Digital Printing */}
					<div className="group relative rounded-2xl bg-linear-to-br from-white to-emerald-50/50 p-8 shadow-lg ring-1 ring-emerald-200/60 backdrop-blur-sm hover:shadow-2xl hover:ring-emerald-300/80 hover:bg-linear-to-br hover:from-white hover:to-emerald-100/40 transition-all duration-500 animate__animated animate__fadeInUp animate__slow animate__delay-1s">
						<div className="absolute inset-0 rounded-2xl bg-linear-to-t from-emerald-600/0 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
						<div className="relative space-y-4">
							<div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-100 group-hover:bg-emerald-600 transition-all duration-300">
								{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
								<svg
									className="h-8 w-8 text-emerald-700 group-hover:text-white transition-colors"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5h.01M12 12h4.01M7.29 7.29l2.83 2.83"
									/>
								</svg>
							</div>
							<h3 className="text-2xl font-bold text-emerald-950">
								Digital Printing
							</h3>
							<p className="text-emerald-900/75 leading-relaxed">
								On-demand flexibility with fast turnarounds for small batches
								and personalized prints.
							</p>
						</div>
					</div>

					{/* Large Format */}
					<div className="group relative rounded-2xl bg-linear-to-br from-white to-emerald-50/50 p-8 shadow-lg ring-1 ring-emerald-200/60 backdrop-blur-sm hover:shadow-2xl hover:ring-emerald-300/80 hover:bg-linear-to-br hover:from-white hover:to-emerald-100/40 transition-all duration-500 animate__animated animate__fadeInUp animate__slow animate__delay-2s">
						<div className="absolute inset-0 rounded-2xl bg-linear-to-t from-emerald-600/0 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
						<div className="relative space-y-4">
							<div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-100 group-hover:bg-emerald-600 transition-all duration-300">
								{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
								<svg
									className="h-8 w-8 text-emerald-700 group-hover:text-white transition-colors"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<h3 className="text-2xl font-bold text-emerald-950">
								Large Format
							</h3>
							<p className="text-emerald-900/75 leading-relaxed">
								Banners, signage, and displays that command attention with
								vibrant colors and impact.
							</p>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};
