import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";
import { BackgroundBeams } from "@/components/ui/shadcn-io/background-beams";
import "animate.css";

export default function Page() {
	return (
		<div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-gradient-to-b from-emerald-50/50 via-white to-emerald-950/5 p-6 md:p-10">
			<Suspense>
				<BackgroundBeams className="absolute inset-0" />
			</Suspense>
			<div className="relative z-10 w-full max-w-sm animate__animated animate__fadeIn animate__slow">
				<LoginForm />
			</div>
		</div>
	);
}
