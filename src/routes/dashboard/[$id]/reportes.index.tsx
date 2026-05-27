import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Suspense } from "react"
import { reportesQueryOptions } from "../../../../queries/iluminacion/reportes-queries"
import { Clock, FileChartColumn } from "lucide-react"
import type { ReporteIluminacionType } from "../../../../db/reportes/iluminacion/scheme"

export const Route = createFileRoute("/dashboard/$id/reportes/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="w-full sm:w-5/6 mx-auto flex flex-col gap-4 flex-1 rounded-lg items-start my-14">
			<Suspense
				fallback={
					<span className="animate-pulse text-sm italic text-foreground/50 p-7 bg-secondary/50 rounded-lg ring-[1px] ring-foreground/15 flex items-center justify-center w-full sm:w-2/3 mx-auto">
						Obteniendo Reportes...
					</span>
				}
			>
				<Reportes />
			</Suspense>
		</div>
	)
}

function Reportes() {
	const id = Route.useParams().id
	const { data: reportes } = useSuspenseQuery(reportesQueryOptions(id))

	if (!reportes || reportes.length === 0) return <NoReports />
	return (
		<div className="w-full sm:w-2/3 mx-auto flex flex-col gap-4">
			{sortedByRecentDate(reportes)?.map(reporte => (
				<Link
					key={reporte.id}
					to={
						reporte.finishedAt
							? "/dashboard/$id/reporte/$reporteId/general"
							: "/dashboard/$id/reporte/reporte-nuevo"
					}
					params={{ id, reporteId: reporte.id }}
					className="p-4 bg-accent rounded-lg ring-[1px] dark:ring-foreground/15 ring-foreground/50 justify-between w-full"
				>
					<div className="flex gap-4 items-center">
						{reporte.finishedAt ? (
							<FileChartColumn className="size-8 text-blue-600" />
						) : (
							<Clock className="size-8 text-amber-600" />
						)}
						<div className="flex flex-col gap-1">
							<span className="textM font-semibold w-60 truncate">
								{reporte.title.toUpperCase()}
							</span>
							<span className="text-xs text-foreground/50">
								{reporte.finishedAt
									? `Realizado el ${reporte.finishedAt?.toLocaleDateString("it-IT")}`
									: "En curso"}
							</span>
						</div>
					</div>
				</Link>
			))}
		</div>
	)
}

function NoReports() {
	return (
		<article className="w-5/6 mx-auto flex flex-col items-center justify-center gap-10 mt-20">
			<span className="text-center text-foreground/70 text-sm italic tracking-wide">
				No posee informes de Iluminación. Realice su primer reporte ...
			</span>
		</article>
	)
}

function sortedByRecentDate(reportes: ReporteIluminacionType[]) {
	return reportes?.sort(
		(a, b) =>
			(b.finishedAt || b.createdAt).getTime() -
			(a.finishedAt || a.createdAt).getTime()
	)
}
