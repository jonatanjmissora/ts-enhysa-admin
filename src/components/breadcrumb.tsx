import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from "@tanstack/react-router"

export function BreadcrumbDemo() {
	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink render={<Link to="/">Home</Link>} />
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button size="icon-sm" variant="ghost">
									<BreadcrumbEllipsis />
									<span className="sr-only">Toggle menu</span>
								</Button>
							}
						/>
						<DropdownMenuContent align="start">
							<DropdownMenuGroup>
								<DropdownMenuItem>Documentation</DropdownMenuItem>
								<DropdownMenuItem>Themes</DropdownMenuItem>
								<DropdownMenuItem>GitHub</DropdownMenuItem>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbLink render={<Link to="/usuario">Reportes</Link>} />
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbPage>Breadcrumb</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	)
}
