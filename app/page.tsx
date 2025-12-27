import { Header } from "@/components/header";
import { AboutSection } from "@/components/about";
import { VisionSection } from "@/components/vision";
import { ServicesSection } from "@/components/services";
import { ContactForm } from "@/components/contact-form";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<main className="relative min-h-screen bg-linear-to-b from-emerald-50 via-white to-emerald-50 text-emerald-950">
			<Header user={user} />

			<section className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 md:flex-row md:items-center md:py-24">
				<div className="flex-1 space-y-6">
					<h1 className="text-4xl font-semibold leading-tight tracking-tight text-emerald-950 md:text-5xl">
						Premium print solutions that move your brand forward.
					</h1>
					<p className="max-w-2xl text-lg text-emerald-900/80">
						High-quality offset, digital, and large-format printing with
						meticulous color management, fast turnarounds, and a team that
						sweats the details so you do not have to.
					</p>
					<div className="flex flex-wrap gap-3" />
				</div>

				<div className="relative flex-1">
					<div className="relative overflow-hidden rounded-3xl bg-white/90 p-6 shadow-2xl ring-1 ring-emerald-100 backdrop-blur">
						<div className="flex items-center justify-between gap-3">
							<h2 className="text-lg font-semibold text-emerald-950">
								Fast, precise, and reliable
							</h2>
							<span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
								Since 2007
							</span>
						</div>
						<ul className="mt-4 space-y-3 text-sm text-emerald-900/80">
							<li className="flex items-start gap-2">
								<span
									className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-600"
									aria-hidden
								/>
								<p>Color-managed workflows to maintain brand consistency.</p>
							</li>
							<li className="flex items-start gap-2">
								<span
									className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-600"
									aria-hidden
								/>
								<p>Responsive support and timeline clarity for every job.</p>
							</li>
							<li className="flex items-start gap-2">
								<span
									className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-600"
									aria-hidden
								/>
								<p>Sustainable stock options and precise finishing control.</p>
							</li>
						</ul>
					</div>
				</div>
			</section>

			<section className="relative z-10 mx-auto max-w-6xl px-6 pb-20">
				<div className="mb-6 flex items-center justify-between">
					<div>
						<p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">
							What we do
						</p>
						<h2 className="mt-2 text-2xl font-semibold text-emerald-950">
							Capabilities built around your deadlines
						</h2>
					</div>
					{/* Company profile PDF link removed */}
				</div>
				<div className="grid gap-4 md:grid-cols-3">
					<div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-emerald-100">
						<p className="text-base font-semibold text-emerald-900">
							Offset printing
						</p>
						<p className="mt-2 text-sm text-emerald-900/80">
							High-volume precision with exacting ink control for catalogs,
							packaging, and marketing kits.
						</p>
					</div>
					<div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-emerald-100">
						<p className="text-base font-semibold text-emerald-900">
							Digital printing
						</p>
						<p className="mt-2 text-sm text-emerald-900/80">
							Fast-turn variable data, short runs, proofs, and personalized
							campaigns without sacrificing quality.
						</p>
					</div>
					<div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-emerald-100">
						<p className="text-base font-semibold text-emerald-900">
							Large format & signage
						</p>
						<p className="mt-2 text-sm text-emerald-900/80">
							Banners, standees, billboards, and exhibition graphics engineered
							to stay vivid indoors or outdoors.
						</p>
					</div>
				</div>
			</section>

			<section id="services" className="scroll-mt-20">
				<ServicesSection />
			</section>
			<section id="vision" className="scroll-mt-20">
				<VisionSection />
			</section>
			<section id="about" className="scroll-mt-20">
				<AboutSection />
			</section>
			<section id="contact" className="scroll-mt-20">
				<ContactForm />
			</section>
		</main>
	);
}
