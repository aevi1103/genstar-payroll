"use client";

import { useState } from "react";
import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import {
	LogOut,
	Menu,
	PhilippinePeso,
	User as UserIcon,
	UserPen,
	X,
} from "lucide-react";
import Image from "next/image";
import {
	Drawer,
	DrawerTrigger,
	DrawerContent,
	DrawerClose,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { Logo } from "../../components/logo";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
	user: User | null;
}

export function Header({ user }: HeaderProps) {
	const [open, setOpen] = useState(false);

	const router = useRouter();

	const logout = async () => {
		const supabase = createClient();
		await supabase.auth.signOut();
		router.push("/auth/login");
	};

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
						<Link
							href="/payroll"
							className="hover:text-emerald-900
							 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-1 rounded-full font-medium
							  transition-colors ease-in-out duration-200 lg:hidden"
						>
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
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Avatar className="rounded-lg">
														<AvatarImage
															src={
																user.user_metadata.avatar_url ||
																"/avatars/default.png"
															}
															alt={user.user_metadata.name || "User avatar"}
															className="cursor-pointer"
														/>
														<AvatarFallback>
															{(user.user_metadata.name || "U")
																.charAt(0)
																.toUpperCase()}
														</AvatarFallback>
													</Avatar>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													align="start"
													className="bg-emerald-50 border-emerald-200 "
												>
													<DropdownMenuLabel className="text-emerald-700">
														My Account
													</DropdownMenuLabel>
													<DropdownMenuSeparator />
													<DropdownMenuItem className="focus:bg-emerald-100 hover:bg-emerald-100 text-emerald-700">
														<UserIcon className="text-emerald-700" />
														{user.user_metadata.name}
													</DropdownMenuItem>
													<DropdownMenuItem className="focus:bg-emerald-100 hover:bg-emerald-100 text-emerald-700">
														<UserPen className="text-emerald-700" />
														<Link href="/account">Profile</Link>
													</DropdownMenuItem>
													<DropdownMenuItem className="focus:bg-emerald-100 hover:bg-emerald-100 text-emerald-700">
														<PhilippinePeso className="text-emerald-700" />
														<Link href="/payroll">Payroll</Link>
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={logout}
														className="focus:bg-emerald-100 hover:bg-emerald-100 text-emerald-700"
													>
														<LogOut className="text-emerald-700" />
														Logout
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TooltipTrigger>
										<TooltipContent>
											<p>{user.user_metadata.name ?? "Signed in"}</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</>
						) : (
							<Link
								href="/auth/login"
								className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md"
							>
								Employee Login
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
											Employee Login
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
