import {
	HeadContent,
	Link,
	Scripts,
	createRootRouteWithContext,
	useRouterState,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools"

import appCss from "../styles.css?url"

import type { QueryClient } from "@tanstack/react-query"
import NotFound from "#/components/not-found"
import {
	UserRound,
	File,
	Image,
	CircleDollarSign,
	ChevronDown,
} from "lucide-react"
import { useState } from "react"

interface MyRouterContext {
	queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "TanStack Start Starter",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
	notFoundComponent: () => <NotFound />,
})

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html
			lang="en"
			className="dark w-screen min-h-svh overflow-x-hidden flex flex-col items-center "
		>
			<head>
				<HeadContent />
			</head>
			<body className="w-full h-screen flex border ">
				<AsideMenu />
				<main className="w-[85svw] h-full">{children}</main>
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	)
}

function AsideMenu() {
	const [activeLink, setActiveLink] = useState("Usuarios")
	const pathname = useRouterState({ select: (s) => s.location.pathname })

	const id = pathname.match(/^\/usuario\/([^/]+)/)?.[1]
	const accordionOpen = activeLink === "Usuarios" && Boolean(id)
	const filesAccordionOpen = activeLink === "Files"

	const accordionLinks = [
		{
			to: "/usuario/$id" as const,
			params: { id: id! },
			path: `/usuario/${id}`,
			label: "Perfil",
			exact: true,
		},
		{
			to: "/usuario/$id/empresas" as const,
			params: { id: id! },
			path: `/usuario/${id}/empresas`,
			label: "Empresas",
		},
		{
			to: "/usuario/$id/instrumentos" as const,
			params: { id: id! },
			path: `/usuario/${id}/instrumentos`,
			label: "Instrumentos",
		},
		{
			to: "/usuario/$id/reportes" as const,
			params: { id: id! },
			path: `/usuario/${id}/reportes`,
			label: "Reportes",
		},
		{
			to: "/usuario/$id/creditos" as const,
			params: { id: id! },
			path: `/usuario/${id}/creditos`,
			label: "Creditos",
		},
	]

	const filesAccordionLinks = [
		{
			to: "/files" as const,
			path: "/files",
			label: "Usuarios",
			exact: true,
		},
		{
			to: "/files/unused" as const,
			path: "/files/unused",
			label: "Sin utilizar",
		},
		{
			to: "/files/repetidas" as const,
			path: "/files/repetidas",
			label: "Repetidas",
		},
	]

	return (
		<aside className="flex flex-col gap-12 w-[15svw] h-full sticky left-0 top-0 border px-2 py-10">
			<div className="flex flex-col gap-0 items-center justify-center">
				<div className="size-20 relative">
					<img
						src="EnHySa_logo.webp"
						alt="logo"
						className="absolute inset-0 w-full h-full object-cover"
					/>
				</div>
				<span className="text-2xl font-bold text-center text-pretty">
					EnHySa
				</span>
			</div>
			<nav className="flex flex-col gap-8">
				<div className="flex flex-col gap-1">
					<Link
						to="/"
						onClick={() => setActiveLink("Usuarios")}
						className={`${activeLink === "Usuarios" && "bg-ring"} p-2 rounded w-full flex gap-3 text-ms tracking-wide font-semibold`}
					>
						<UserRound /> Usuarios
						<ChevronDown
							className={`ml-auto transition-transform ${accordionOpen && "rotate-180"}`}
						/>
					</Link>
					{accordionOpen ? (
						<div className="flex flex-col gap-1 pl-4">
					{accordionLinks.map(link => {
						const isActive = link.exact
							? pathname === link.path
							: pathname === link.path || pathname.startsWith(`${link.path}/`)
						return (
							<Link
								key={link.to}
								to={link.to}
								params={link.params}
								className={`p-2 rounded w-full flex gap-3 text-sm tracking-wide font-medium ${isActive ? "text-foreground" : "text-foreground/80 hover:text-foreground"}`}
							>
								<span
									className={`${isActive && "underline underline-offset-4 decoration-2"}`}
								>
									{link.label}
								</span>
							</Link>
						)
					})}
						</div>
					) : null}
				</div>
				<Link
					to="/reportes"
					onClick={() => setActiveLink("Reportes")}
					className={`${activeLink === "Reportes" && "bg-ring"} p-2 rounded w-full flex gap-3 text-ms tracking-wide font-semibold`}
				>
					<File /> Reportes
				</Link>
				<Link
					to="/files"
					onClick={() => setActiveLink("Files")}
					className={`${activeLink === "Files" && "bg-ring"} p-2 rounded w-full flex gap-3 text-ms tracking-wide font-semibold`}
				>
					<Image /> Imagenes
					<ChevronDown
						className={`ml-auto transition-transform ${filesAccordionOpen && "rotate-180"}`}
					/>
				</Link>
				{filesAccordionOpen ? (
					<div className="flex flex-col gap-1 pl-4">
						{filesAccordionLinks.map(link => {
							const isActive = link.exact
								? pathname === link.path
								: pathname === link.path || pathname.startsWith(`${link.path}/`)
							return (
								<Link
									key={link.to}
									to={link.to}
									className={`p-2 rounded w-full flex gap-3 text-sm tracking-wide font-medium ${isActive ? "text-foreground" : "text-foreground/80 hover:text-foreground"}`}
								>
									<span
										className={`${isActive && "underline underline-offset-4 decoration-2"}`}
									>
										{link.label}
									</span>
								</Link>
							)
						})}
					</div>
				) : null}
				<Link
					to="/money"
					onClick={() => setActiveLink("Monetizacion")}
					className={`${activeLink === "Monetizacion" && "bg-ring"} p-2 rounded w-full flex gap-3 text-ms tracking-wide font-semibold`}
				>
					<CircleDollarSign /> Monetizacion
				</Link>
			</nav>
		</aside>
	)
}
