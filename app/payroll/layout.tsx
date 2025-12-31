import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
	SidebarProvider,
	SidebarInset,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { getSessionWithRole } from "@/lib/session";
import DynamicBreadcrumb from "@/components/dynamic-bread-crumb";
import { Logo } from "@/components/logo";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const sessionWithRole = await getSessionWithRole();

	return (
		<SidebarProvider>
			<AppSidebar session={sessionWithRole} className="hidden lg:flex" />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
					<div className="flex items-center">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="hidden lg:block mr-2 data-[orientation=vertical]:h-4"
						/>
						<Breadcrumb>
							<DynamicBreadcrumb />
						</Breadcrumb>
					</div>
					<div className="flex lg:hidden">
						<Logo width={80} height={24} />
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
