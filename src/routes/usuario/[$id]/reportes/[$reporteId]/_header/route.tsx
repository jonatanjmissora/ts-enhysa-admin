import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link, Outlet } from "@tanstack/react-router"
import {
	RulerDimensionLine,
	UserRound,
	File,
	CalendarDays,
	FileCheck,
	FileLock,
	FileClock,
} from "lucide-react"
import { Suspense } from "react"
import { reporteQueryOptions } from "../../../../../../../queries/iluminacion/reportes-queries"
import { empresasQueryOptions } from "../../../../../../../queries/empresas-queries"

export const Route = createFileRoute(
	"/usuario/$id/reportes/$reporteId/_header"
)({
	component: RouteComponent,
})

function RouteComponent() {
	const id = Route.useParams().id
	const reporteId = Route.useParams().reporteId
	return (
		<div className="w-full flex flex-col">
			<Suspense fallback={<span className="animate-pulse">. . .</span>}>
				<SuspenseTitle />
			</Suspense>
			<nav className="flex items-center justify-between gap-2 w-full my-4">
				<Link
					to="/usuario/$id/reportes/$reporteId/general"
					params={{ id, reporteId }}
					activeProps={{
						className:
							"bg-accent ring-[1px] dark:ring-cyan-700/25 ring-cyan-700/75 text-cyan-700",
					}}
					className="flex-1 h-20 flex flex-col gap-2 items-center justify-center text-sm rounded-lg"
				>
					<File className="size-10" />
					General
				</Link>
				<Link
					to="/usuario/$id/reportes/$reporteId/areas"
					params={{ id, reporteId }}
					activeProps={{
						className:
							"bg-accent ring-[1px] dark:ring-purple-700/25 ring-purple-700/75 text-purple-700",
					}}
					className="flex-1 h-20 flex flex-col gap-2 items-center justify-center text-sm rounded-lg"
				>
					<RulerDimensionLine className="size-10" />
					Mediciones
				</Link>
				<Link
					to="/usuario/$id/reportes/$reporteId/resumen"
					params={{ id, reporteId }}
					activeProps={{
						className:
							"bg-accent ring-[1px] dark:ring-amber-700/25 ring-amber-700/75 text-amber-700",
					}}
					className="flex-1 h-20 flex flex-col gap-2 items-center justify-center text-sm rounded-lg"
				>
					<UserRound className="size-10" />
					Resumen
				</Link>
			</nav>

			<Outlet />
		</div>
	)
}

const SuspenseTitle = () => {
	const { id, reporteId } = Route.useParams()
	const { data: reporte } = useSuspenseQuery(
		reporteQueryOptions({ userId: id, reporteId })
	)
	const { data: empresas } = useSuspenseQuery(empresasQueryOptions(id))
	const empresa = empresas?.find(empresa => empresa.id === reporte?.empresaId)

	return (
		<div className="flex items-center justify-center gap-2 w-full px-10 border-b border-white/50 py-2">
			<span>
				{reporte?.finishedAt ? (
					reporte.creditConsumed ? (
						<FileCheck className="size-8 text-blue-500" />
					) : (
						<FileLock className="size-8 text-blue-700" />
					)
				) : (
					<FileClock className="size-8 text-amber-600" />
				)}
			</span>
			<span className="tracking-wider">
				{empresa?.razonSocial.toUpperCase()} -{" "}
				{reporte?.finishedAt?.toLocaleDateString("it-IT")}
			</span>
			<CalendarDays className="size-4 text-foreground/75" />

			<span className="text-foreground/50 text-sm tracking-wide ml-auto">
				id: {reporteId}
			</span>
		</div>
	)
}
