import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"
import { allAreasQueryOptions } from "../../../queries/iluminacion/areas-queries"
import { allReportesQueryOptions } from "../../../queries/iluminacion/reportes-queries"
import { tecnicosQueryOptions } from "../../../queries/tecnicos-queries"

export const Route = createFileRoute("/areas/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<Suspense fallback={<div>Cargando areas y reportes...</div>}>
			<Inner />
		</Suspense>
	)
}

function Inner() {
	const { data: tecnicos } = useSuspenseQuery(tecnicosQueryOptions)
	const { data: areas } = useSuspenseQuery(allAreasQueryOptions)
	const { data: reportes } = useSuspenseQuery(allReportesQueryOptions)

	if (!reportes || !areas || !tecnicos)
		return <div>No hay areas o informes</div>

	// obtener todas las areas que no tiene un reporteId existente
	// const reportesIds = areas.map(area => area.reportId)
	// reportes.forEach(reporte => {
	//   if(reportesIds.includes(reporte.id)) {
	//     //eliminar el reporteId de reportesIds
	//     reportesIds.splice(reportesIds.indexOf(reporte.id), 1)
	//   }
	// })

	return (
		<article className="flex flex-col gap-8 w-full mb-40">
			<span className="text-center">Areas Totales: {areas.length}</span>
			<div className="flex flex-col gap-20 w-full items-center">
				{tecnicos.map(tecnico => (
					<div key={tecnico.id} className="flex flex-col w-full text-sm">
						<div className="text-amber-700 w-full border-b flex sm:flex-row flex-col sm:items-center items-end sm:justify-center justify-between">
							<b className="flex items-center justify-between w-full">
								{tecnico.nombre.toUpperCase()}(
								{areas.filter(area => area.userId === tecnico.userId).length})
							</b>
							<b>{tecnico.userId}</b>
						</div>
						{reportes
							.filter(reporte => reporte.userId === tecnico.userId)
							.map(reporte => (
								<div
									key={reporte.id}
									className="flex flex-col gap-2 my-4 ml-0 sm:ml-10"
								>
									<div className="w-full flex sm:flex-row flex-col sm:items-center items-end sm:justify-center justify-between border-b text-amber-400">
										<span className="mr-auto">REPORTE</span>
										<span>{reporte.title.toUpperCase()}</span>
										<span>{reporte.id}</span>
									</div>
									{areas
										.filter(area => area.reportId === reporte.id)
										.map(area => (
											<div
												key={area.id}
												className="w-full flex sm:flex-row flex-col sm:items-center items-end sm:justify-between justify-between"
											>
												<span className="mr-auto sm:mr-0 sm:ml-10">AREA</span>
												<span>{area.nombre.toUpperCase()}</span>
												<span>{area.id}</span>
											</div>
										))}
								</div>
							))}
					</div>
				))}
			</div>
		</article>
	)
}
