import { BackgroundBeams } from "@/components/ui/shadcn-io/background-beams";
import "animate.css";
import { Suspense } from "react";

export default function Loading() {
	return (
		<div className="relative min-h-screen bg-linear-to-b from-emerald-50/50 via-white to-emerald-950/5 flex items-center justify-center overflow-hidden">
			<Suspense>
				<BackgroundBeams className="absolute inset-0" />
			</Suspense>

			<div className="relative z-10 flex flex-col items-center gap-6 animate__animated animate__fadeIn">
				{/* Animated Logo/Spinner */}
				<div className="relative">
					<div className="w-20 h-20 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
					<div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-emerald-400 rounded-full animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
				</div>

				{/* Loading Text */}
				<div className="flex flex-col items-center gap-2">
					<h2 className="text-2xl font-semibold text-emerald-950 animate__animated animate__pulse animate__infinite">
						Preparing Your Experience
					</h2>
					<p className="text-sm text-emerald-700/70">
						Setting up your professional printing solutions...
					</p>
				</div>

				{/* Animated Dots */}
				<div className="flex gap-2">
					<span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce [animation-delay:0ms]" />
					<span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce [animation-delay:150ms]" />
					<span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce [animation-delay:300ms]" />
				</div>
			</div>
		</div>
	);
}
