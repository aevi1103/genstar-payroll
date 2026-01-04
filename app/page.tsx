import { Header } from "@/features/home-page/header";
import { AboutSection } from "@/features/home-page/about";
import { VisionSection } from "@/features/home-page/vision";
import { ServicesSection } from "@/features/home-page/services";
import { ContactForm } from "@/features/home-page/contact-form";
import { createClient } from "@/lib/supabase/server";
import { Alert, AlertDescription } from "@/components/ui/alert";
import "animate.css";

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<{ message?: string }>;
}) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const { message } = await searchParams;

	return (
		<main className="relative min-h-screen bg-linear-to-b from-emerald-50 via-white to-emerald-50 text-emerald-950">
			<Header user={user} />

			{message === "no role assigned to user" && (
				<div className="mx-auto max-w-6xl px-6 pt-6 animate__animated animate__pulse">
					<Alert className="border-red-200 bg-red-50">
						<AlertDescription className="text-red-800">
							No role has been assigned to your account. Please contact an
							administrator to request access.
						</AlertDescription>
					</Alert>
				</div>
			)}

			<section className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 md:flex-row md:items-center md:py-24 animate__animated animate__slideInUp animate__slow">
				<div className="flex-1 space-y-6 animate__animated animate__fadeInLeft animate__slower">
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

				<div className="relative flex-1 animate__animated animate__fadeInRight animate__slower">
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

			<section className="relative z-10 mx-auto max-w-6xl px-6 pb-20 animate__animated animate__fadeInUp animate__slow">
				<div className="mb-6 flex items-center justify-between animate__animated animate__fadeIn animate__slower">
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
					<div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-emerald-100 animate__animated animate__fadeInUp animate__slow">
						<p className="text-base font-semibold text-emerald-900">
							Offset printing
						</p>
						<p className="mt-2 text-sm text-emerald-900/80">
							High-volume precision with exacting ink control for catalogs,
							packaging, and marketing kits.
						</p>
					</div>
					<div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-emerald-100 animate__animated animate__fadeInUp animate__slow animate__delay-1s">
						<p className="text-base font-semibold text-emerald-900">
							Digital printing
						</p>
						<p className="mt-2 text-sm text-emerald-900/80">
							Fast-turn variable data, short runs, proofs, and personalized
							campaigns without sacrificing quality.
						</p>
					</div>
					<div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-emerald-100 animate__animated animate__fadeInUp animate__slow animate__delay-2s">
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

			<section
				id="services"
				className="scroll-mt-20 animate__animated animate__fadeIn animate__slow"
			>
				<ServicesSection />
			</section>
			<section
				id="vision"
				className="scroll-mt-20 animate__animated animate__slideInUp animate__slow"
			>
				<VisionSection />
			</section>
			<section
				id="about"
				className="scroll-mt-20 animate__animated animate__fadeInUp animate__slow"
			>
				<AboutSection />
			</section>
			<section
				id="contact"
				className="scroll-mt-20 animate__animated animate__slideInUp animate__slow"
			>
				<ContactForm />
			</section>
		</main>
	);
}
