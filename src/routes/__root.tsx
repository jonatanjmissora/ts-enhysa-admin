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

import { useSuspenseQuery, type QueryClient } from "@tanstack/react-query"
import NotFound from "#/components/not-found"
import {
	UserRound,
	File,
	Image,
	CircleDollarSign,
	ChevronDown,
} from "lucide-react"
import { usersQueryOptions } from "../../queries/users-queries"
import { Suspense } from "react"
import {
	allReportesQueryOptions,
	reportesQueryOptions,
} from "../../queries/iluminacion/reportes-queries"
import { filesQueryOptions } from "../../queries/files-queries"
import { allCreditHistoryQueryOptions } from "../../queries/credits/credit-history-queries"
import { empresasQueryOptions } from "../../queries/empresas-queries"
import { instrumentosQueryOptions } from "../../queries/instrumentos-queries"

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
	const pathname = useRouterState({ select: s => s.location.pathname })

	const isUsuariosActive = pathname === "/" || pathname.startsWith("/usuario")
	const isReportesActive =
		pathname === "/reportes" || pathname.startsWith("/reportes/")
	const isFilesActive = pathname === "/files" || pathname.startsWith("/files/")
	const isMoneyActive = pathname === "/money" || pathname.startsWith("/money/")

	const id = pathname.match(/^\/usuario\/([^/]+)/)?.[1]
	const accordionOpen = isUsuariosActive && Boolean(id)
	const filesAccordionOpen = isFilesActive

	const usersAccordionLinks = [
		{
			to: "/usuario/$id" as const,
			params: { id: id! },
			path: `/usuario/${id}`,
			label: "Perfil",
			exact: true,
			number: null,
		},
		{
			to: "/usuario/$id/empresas" as const,
			params: { id: id! },
			path: `/usuario/${id}/empresas`,
			label: "Empresas",
			number: (
				<Suspense>
					<AsyncEmpresas id={id || ""} />
				</Suspense>
			),
		},
		{
			to: "/usuario/$id/instrumentos" as const,
			params: { id: id! },
			path: `/usuario/${id}/instrumentos`,
			label: "Instrumentos",
			number: (
				<Suspense>
					<AsyncInstrumentos id={id || ""} />
				</Suspense>
			),
		},
		{
			to: "/usuario/$id/reportes" as const,
			params: { id: id! },
			path: `/usuario/${id}/reportes`,
			label: "Reportes",
			number: (
				<Suspense>
					<AsyncReportesUser id={id || ""} />
				</Suspense>
			),
		},
		{
			to: "/usuario/$id/creditos" as const,
			params: { id: id! },
			path: `/usuario/${id}/creditos`,
			label: "Creditos",
			number: null,
		},
	]

	const filesAccordionLinks = [
		{
			to: "/files" as const,
			path: "/files",
			label: "Usuarios",
			exact: true,
			number: (
				<Suspense>
					<AsyncUsers />
				</Suspense>
			),
		},
		{
			to: "/files/unused" as const,
			path: "/files/unused",
			label: "Sin utilizar",
			number: null,
		},
		{
			to: "/files/repetidas" as const,
			path: "/files/repetidas",
			label: "Repetidas",
			number: null,
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
						className={`${isUsuariosActive && "bg-ring"} p-2 rounded w-full flex gap-2 text-ms tracking-wide font-semibold`}
					>
						<UserRound /> Usuarios{" "}
						<Suspense>
							<AsyncUsers />
						</Suspense>
						<ChevronDown
							className={`ml-auto transition-transform ${accordionOpen && "rotate-180"}`}
						/>
					</Link>
					{accordionOpen ? (
						<div className="flex flex-col gap-1 pl-4">
							{usersAccordionLinks.map(link => {
								const isActive = link.exact
									? pathname === link.path
									: pathname === link.path ||
										pathname.startsWith(`${link.path}/`)
								return (
									<Link
										key={link.to}
										to={link.to}
										params={link.params}
										className={`p-2 rounded w-full flex gap-3 text-sm tracking-wide font-medium ${isActive ? "text-foreground" : "text-foreground/80 hover:text-foreground"}`}
									>
										<span
											className={`${isActive && "underline underline-offset-4 decoration-2"} flex gap-2`}
										>
											{link.label}
											{link.number}
										</span>
									</Link>
								)
							})}
						</div>
					) : null}
				</div>
				<Link
					to="/reportes"
					className={`${isReportesActive && "bg-ring"} p-2 rounded w-full flex gap-2 text-ms tracking-wide font-semibold`}
				>
					<File /> Reportes{" "}
					<Suspense>
						<AsyncReportes />
					</Suspense>
				</Link>
				<Link
					to="/files"
					className={`${isFilesActive && "bg-ring"} p-2 rounded w-full flex gap-2 text-ms tracking-wide font-semibold`}
				>
					<Image /> Imagenes{" "}
					<Suspense>
						<AsyncFiles />
					</Suspense>
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
									{link.number}
								</Link>
							)
						})}
					</div>
				) : null}
				<Link
					to="/money"
					className={`${isMoneyActive && "bg-ring"} p-2 rounded w-full flex gap-2 text-ms tracking-wide font-semibold`}
				>
					<CircleDollarSign /> Monetizacion{" "}
					<Suspense>
						<AsyncCreditsHistory />
					</Suspense>
				</Link>
			</nav>
		</aside>
	)
}

function AsyncUsers() {
	const { data: users } = useSuspenseQuery(usersQueryOptions)
	return <span className="text-foreground/50">({users?.length})</span>
}

function AsyncReportes() {
	const { data: reportes } = useSuspenseQuery(allReportesQueryOptions)
	return <span className="text-foreground/50">({reportes?.length})</span>
}

function AsyncFiles() {
	const { data: files } = useSuspenseQuery(filesQueryOptions)
	return <span className="text-foreground/50">({files?.files.length})</span>
}

function AsyncCreditsHistory() {
	const { data: creditsHistory } = useSuspenseQuery(
		allCreditHistoryQueryOptions
	)
	return <span className="text-foreground/50">({creditsHistory?.length})</span>
}

function AsyncEmpresas({ id }: { id: string }) {
	const { data: empresas } = useSuspenseQuery(empresasQueryOptions(id))
	return <span className="text-foreground/50">({empresas?.length})</span>
}

function AsyncInstrumentos({ id }: { id: string }) {
	const { data: instrumentos } = useSuspenseQuery(instrumentosQueryOptions(id))
	return <span className="text-foreground/50">({instrumentos?.length})</span>
}

function AsyncReportesUser({ id }: { id: string }) {
	const { data: reportes } = useSuspenseQuery(reportesQueryOptions(id))
	return <span className="text-foreground/50">({reportes?.length})</span>
}

function Async 