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
		<article className="flex flex-col gap-10">
			{/* <div className='flex flex-col gap-4'>
      <span className='text-lg font-bold border-b border-white/20 pb-1.5'>AREAS TOTALES</span>
      <div className='w-full grid grid-cols-1 sm:grid-cols-3'>
      {
        areas.map(area => 
          <div key={area.id} className='flex flex-col border text-sm'>
            <span className='text-amber-700' ><b>{area.nombre}</b></span>
            <span >{area.reportId}</span>
          </div>
        )
      }

      </div>
    </div>

    <div className='flex flex-col gap-4'>
          <span className='text-lg font-bold border-b border-white/20 pb-1.5'>REPORTES TOTALES</span>
          <div className='w-full grid grid-cols-1 sm:grid-cols-3'>
          {
            reportes.map(reporte => 
              <div key={reporte.id} className='flex flex-col border text-sm'>
                <span className='text-amber-700' ><b>{reporte.title}</b></span>
                <span >{reporte.id}</span>
              </div>
            )
          }
          </div>
      </div> */}

			<div className="flex flex-col gap-4 w-full items-center">
				{tecnicos.map(tecnico => (
					<div key={tecnico.id} className="flex flex-col border text-sm">
						<span className="text-amber-700">
							<b>
								{tecnico.nombre} - {tecnico.userId}
							</b>
						</span>
						{reportes
							.filter(reporte => reporte.userId === tecnico.userId)
							.map(reporte => (
								<div key={reporte.id} className="flex flex-col gap-2">
									<span>REPORTE : {reporte.title}</span>
									{areas
										.filter(area => area.reportId === reporte.id)
										.map(area => (
											<span key={area.id}>AREA : {area.nombre}</span>
										))}
								</div>
							))}
					</div>
				))}
			</div>
		</article>
	)
}
