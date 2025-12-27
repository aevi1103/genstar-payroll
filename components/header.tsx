import Image from "next/image";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { LogoutButton } from "@/components/logout-button";

const logoSrc = encodeURI("/genstar logo.png");

interface HeaderProps {
	user: User | null;
}

export function Header({ user }: HeaderProps) {
	return (
		<header className="sticky top-0 z-20 border-b border-emerald-100/70 bg-emerald-50/80 backdrop-blur">
			<div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
				<div className="flex items-center gap-3">
					<Link href="/">
						<Image
							src={logoSrc}
							alt="GenStar Printing Services"
							width={140}
							height={50}
							priority
						/>
					</Link>

					<div className="hidden text-sm font-semibold text-emerald-900 sm:block">
						Quality-driven offset, digital, and large-format print.
					</div>
				</div>
				<nav className="hidden items-center gap-4 text-sm text-emerald-800 md:flex">
					<Link href="#services" className="hover:text-emerald-900">
						Services
					</Link>
					<Link href="#vision" className="hover:text-emerald-900">
						Vision
					</Link>
					<Link href="#about" className="hover:text-emerald-900">
						About
					</Link>
					<Link href="#contact" className="hover:text-emerald-900">
						Contact
					</Link>
				</nav>
				{user ? (
					<div className="flex items-center gap-3 text-sm text-emerald-900/80">
						<span className="hidden rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-800 sm:inline">
							{user.email ?? "Signed in"}
						</span>
						<LogoutButton />
					</div>
				) : (
					<Link
						href="/auth/login"
						className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md"
					>
						Employee signin
					</Link>
				)}
			</div>
		</header>
	);
}
