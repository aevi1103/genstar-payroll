"use client";

import { useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { LogoutButton } from "@/components/logout-button";
import { Menu, X } from "lucide-react";
import {
	Drawer,
	DrawerTrigger,
	DrawerContent,
	DrawerClose,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { Logo } from "../../components/logo";

interface HeaderProps {
	user: User | null;
}

export function Header({ user }: HeaderProps) {
	const [open, setOpen] = useState(false);

	return (
		<header className="sticky top-0 z-20 border-b border-emerald-100/70 bg-emerald-50/80 backdrop-blur">
			<div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
				<div className="flex items-center gap-3">
					<Logo />
				</div>

				{/* Desktop nav */}
				<nav className="hidden items-center gap-4 text-sm text-emerald-800 md:flex">
					<Link href="#services" className="hover:text-emerald-900">
						Services
					</Link>
					<Link href="#vision" className="hover:text-emerald-900">
						Vision
					</Link>
					<Link href="#about" className="hover:text-emerald-900">
						About Us
					</Link>
					<Link href="#contact" className="hover:text-emerald-900">
						Contact
					</Link>
					{user && (
						<Link href="/payroll" className="hover:text-emerald-900">
							Payroll
						</Link>
					)}
				</nav>

				{/* Right-side actions */}
				<div className="flex items-center gap-3">
					{/* Desktop auth */}
					<div className="hidden md:flex items-center gap-3 text-sm text-emerald-900/80">
						{user ? (
							<>
								<span className="hidden rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-800 sm:inline">
									{user.email ?? "Signed in"}
								</span>
								<LogoutButton />
							</>
						) : (
							<Link
								href="/auth/login"
								className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md"
							>
								Employee signin
							</Link>
						)}
					</div>

					{/* Mobile hamburger */}
					<div className="md:hidden">
						<Drawer open={open} onOpenChange={setOpen}>
							<DrawerTrigger asChild>
								<button
									type="button"
									aria-label="Open menu"
									className="p-2 text-emerald-800"
								>
									<Menu className="h-6 w-6" />
								</button>
							</DrawerTrigger>
							<DrawerContent className="bg-emerald-50">
								<div className="flex items-center justify-between p-4">
									<DrawerHeader className="p-0">
										<DrawerTitle className="text-emerald-900">Menu</DrawerTitle>
									</DrawerHeader>
									<DrawerClose className="rounded p-2" aria-label="Close menu">
										<X className="h-5 w-5 text-emerald-800" />
									</DrawerClose>
								</div>
								<nav className="flex flex-col gap-3 p-4 text-emerald-800">
									<Link
										href="#services"
										onClick={() => setOpen(false)}
										className="hover:text-emerald-900"
									>
										Services
									</Link>
									<Link
										href="#vision"
										onClick={() => setOpen(false)}
										className="hover:text-emerald-900"
									>
										Vision
									</Link>
									<Link
										href="#about"
										onClick={() => setOpen(false)}
										className="hover:text-emerald-900"
									>
										About
									</Link>
									<Link
										href="#contact"
										onClick={() => setOpen(false)}
										className="hover:text-emerald-900"
									>
										Contact
									</Link>
									{user && (
										<Link
											href="/payroll"
											onClick={() => setOpen(false)}
											className="hover:text-emerald-900"
										>
											Payroll
										</Link>
									)}
								</nav>
								<div className="border-t border-emerald-200 p-4">
									{user ? (
										<div className="flex items-center justify-between">
											<span className="text-sm text-emerald-800">
												{user.email ?? "Signed in"}
											</span>
											<LogoutButton />
										</div>
									) : (
										<Link
											href="/auth/login"
											onClick={() => setOpen(false)}
											className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm"
										>
											Employee signin
										</Link>
									)}
								</div>
							</DrawerContent>
						</Drawer>
					</div>
				</div>
			</div>
		</header>
	);
}
