import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link, Outlet } from "@tanstack/react-router"
import { RulerDimensionLine, UserRound, File, CalendarDays } from "lucide-react"
import { Suspense } from "react"
import { reporteQueryOptions } from "../../../../../../../queries/iluminacion/reportes-queries"
import { empresasQueryOptions } from "../../../../../../../queries/empresas-queries"

export const Route = createFileRoute(
	"/dashboard/$id/reporte/$reporteId/_header"
)({
	component: RouteComponent,
})

function RouteComponent() {
	const id = Route.useParams().id
	const reporteId = Route.useParams().reporteId
	return (
		<div className="w-full flex flex-col">
			<nav className="flex items-center justify-between gap-2 w-full my-4">
				<Link
					to="/dashboard/$id/reporte/$reporteId/general"
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
					to="/dashboard/$id/reporte/$reporteId/areas"
					params={{ id, reporteId }}
					activeProps={{
						className:
							"bg-accent ring-[1px] dark:ring-purple-700/25 ring-purple-700/75 text-purple-700",
					}}
					className="flex-1 h-20 flex flex-col gap-2 items-center justify-center text-sm rounded-lg"
				>
					<RulerDimensionLine className="size-10" />
					Areas
				</Link>
				<Link
					to="/dashboard/$id/reporte/$reporteId/resumen"
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
			<Suspense fallback={<span className="animate-pulse">. . .</span>}>
				<SuspenseTitle />
			</Suspense>
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
		<div className="flex items-center justify-center gap-2 w-full border-t border-b border-white/50 py-2">
			<span className="tracking-wider">
				{empresa?.razonSocial.toUpperCase()} -{" "}
				{reporte?.finishedAt?.toLocaleDateString("it-IT")}
			</span>
			<CalendarDays className="size-4 text-foreground/75" />
		</div>
	)
}
