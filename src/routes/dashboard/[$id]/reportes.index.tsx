import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Suspense } from "react"
import { reportesQueryOptions } from "../../../../queries/iluminacion/reportes-queries"
import { FileClock, FileLock, FileCheck } from "lucide-react"
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

	if (!reportes || reportes.length === 0) return <ReportesVacios />
	return (
		<div className="w-full sm:w-2/3 mx-auto flex flex-col gap-4">
			{sortedByRecentDate(reportes)?.map(reporte => (
				<Link
					key={reporte.id}
					to={
						reporte.finishedAt
							? "/dashboard/$id/reportes/$reporteId/general"
							: "/dashboard/$id/reportes/$reporteId/general"
					}
					params={{ id, reporteId: reporte.id }}
					className="p-4 bg-accent rounded-lg ring-[1px] dark:ring-foreground/15 ring-foreground/50 justify-between w-full"
				>
					<div className="flex gap-4 items-center w-full">
						{reporte.finishedAt ? (
							reporte.creditConsumed ? (
								<FileCheck className="size-8 text-blue-500" />
							) : (
								<FileLock className="size-8 text-blue-700" />
							)
						) : (
							<FileClock className="size-8 text-amber-600" />
						)}
						<div className="flex flex-col gap-1 w-full">
							<span className="textM font-semibold w-60 truncate sm:w-full">
								{reporte.title.toUpperCase()}
							</span>
							<div className="flex items-center justify-between text-xs text-foreground/50 w-full">
								<span className="">
									{reporte.finishedAt
										? `Realizado el ${reporte.finishedAt?.toLocaleDateString("it-IT")}`
										: "En curso"}
								</span>
								<span>id: {reporte.id}</span>
							</div>
						</div>
					</div>
				</Link>
			))}
		</div>
	)
}

function ReportesVacios() {
	return (
		<div className="w-5/6 h-[30svh] flex flex-col gap-8 items-center justify-center mx-auto">
			<span className="text-sm font-medium text-gray-500 italic text-center text-pretty">
				¡Ups! Parece que no tienes reportes registrados
			</span>
		</div>
	)
}

function sortedByRecentDate(reportes: ReporteIluminacionType[]) {
	return reportes?.sort(
		(a, b) =>
			(b.finishedAt || b.createdAt).getTime() -
			(a.finishedAt || a.createdAt).getTime()
	)
}
