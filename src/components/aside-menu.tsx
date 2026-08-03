import { Link, useRouterState } from "@tanstack/react-router"

import { useSuspenseQuery } from "@tanstack/react-query"
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
import { userCreditsByUserQueryOptions } from "../../queries/credits/user-credits-queries"

export default function AsideMenu() {
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
			params: { id: id },
			path: `/usuario/${id}`,
			label: "Perfil",
			exact: true,
			number: null,
		},
		{
			to: "/usuario/$id/empresas" as const,
			params: { id: id },
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
			params: { id: id },
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
			params: { id: id },
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
			params: { id: id },
			path: `/usuario/${id}/creditos`,
			label: "Creditos",
			number: (
				<Suspense>
					<AsyncCreditos id={id || ""} />
				</Suspense>
			),
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
		<aside className="flex flex-col sm:gap-8 2xl:gap-12 sm:w-[20svw] 2xl:w-[15svw] h-full sticky left-0 top-0 border px-2 sm:py-5 2xl:py-10">
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
			<nav className="flex flex-col sm:gap-3 2xl:gap-8 sm:text-sm 2xl:text-base">
				<div className="flex flex-col gap-1">
					<Link
						to="/"
						className={`${isUsuariosActive && "bg-ring"} p-2 rounded w-full flex gap-2 tracking-wide font-semibold`}
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
										className={`p-2 rounded w-full flex gap-3 sm:text-xs 2xl:text-sm tracking-wide font-medium ${isActive ? "text-foreground" : "text-foreground/80 hover:text-foreground"}`}
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
					className={`${isReportesActive && "bg-ring"} p-2 rounded w-full flex gap-2 tracking-wide font-semibold`}
				>
					<File /> Reportes{" "}
					<Suspense>
						<AsyncReportes />
					</Suspense>
				</Link>
				<Link
					to="/files"
					className={`${isFilesActive && "bg-ring"} p-2 rounded w-full flex gap-2 tracking-wide font-semibold`}
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
									className={`p-2 rounded w-full flex gap-3 sm:text-xs 2xl:text-sm tracking-wide font-medium ${isActive ? "text-foreground" : "text-foreground/80 hover:text-foreground"}`}
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
					className={`${isMoneyActive && "bg-ring"} p-2 rounded w-full flex gap-2 tracking-wide font-semibold`}
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
	return <span className="text-foreground/50">({users?.length ?? 0})</span>
}

function AsyncReportes() {
	const { data: reportes } = useSuspenseQuery(allReportesQueryOptions)
	return <span className="text-foreground/50">({reportes?.length ?? 0})</span>
}

function AsyncFiles() {
	const { data: files } = useSuspenseQuery(filesQueryOptions)
	return (
		<span className="text-foreground/50">({files?.files.length ?? 0})</span>
	)
}

function AsyncCreditsHistory() {
	const { data: creditsHistory } = useSuspenseQuery(
		allCreditHistoryQueryOptions
	)
	return (
		<span className="text-foreground/50">({creditsHistory?.length ?? 0})</span>
	)
}

function AsyncEmpresas({ id }: { id: string }) {
	const { data: empresas } = useSuspenseQuery(empresasQueryOptions(id))
	return <span className="text-foreground/50">({empresas?.length ?? 0})</span>
}

function AsyncInstrumentos({ id }: { id: string }) {
	const { data: instrumentos } = useSuspenseQuery(instrumentosQueryOptions(id))
	return (
		<span className="text-foreground/50">({instrumentos?.length ?? 0})</span>
	)
}

function AsyncReportesUser({ id }: { id: string }) {
	const { data: reportes } = useSuspenseQuery(reportesQueryOptions(id))
	return <span className="text-foreground/50">({reportes?.length ?? 0})</span>
}

function AsyncCreditos({ id }: { id: string }) {
	const { data: userCredits } = useSuspenseQuery(
		userCreditsByUserQueryOptions({ userId: id })
	)
	return (
		<span className="text-foreground/50">({userCredits?.credits ?? 0})</span>
	)
}
